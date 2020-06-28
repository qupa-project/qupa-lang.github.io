# Compile time-resolved variable metadata
This can be a useful feature to reduce the number of run-time checks needed and allows for developers to implement programs which can then throw compile-time type errors instead of what would normally be a run time issue.

> **Index:**
> * [Example 1: Sorting](#Example-1-Sorting)
> 	* [Defining and Assigning our flags](#Sorting-Defining-and-Assigning-our-flags)
> 	* [Using our flags](#Sorting-Using-our-flags)
> * [Example 2: Mutex protected references](#Example-2-Mutex-protected-references)
> 	* [Implementing Mutex](#Protected-References-Implementing-Mutex)
> 	* [Protected References: Implementing References](#Protected-References-Implementing-References)
> * [Summary](#Summary)

Note that none of the syntax below is confirmed, and should be purely viewed as pseudo-code in the current state.

# Example 1: Sorting

## Sorting: Defining and Assigning our flags

First of all, you can define a new metadata type, note that unless a flag has been assigned, the compiler always assumes that the flag's value is the first option. I.e. by default all variables have the order of none.
```qupa
flag order [ none, LE, BE ];
```

Now that we have a way to specify an order we can start by actually updating the order of a given variable or value.
```qupa
class Container {
	void sort() {
		affect flag this order.LE

		// sort the contents of this class
	}
}
```
Alternatively, for a non-mutating sort, you can specify that the return type will have the flag ``order.LE``
```qupa
i32[] sort(i32[] arr) {
	affect flag return [ order.LE ]

	// sort the data
	return arr;
}
```

## Sorting: Using our flags
To define a function as needing a certain value to be sorted, we can simply define the argument as requiring the flag ``order.LE``.
```
void print_ordered( Container[i32] arr: [ order.LE ] ) {
	// do something with the ordered data
}
```

Now say we are given a reference to a value - at first, we know that there is no way to know if the array is sorted. Hence we cannot parse the reference value to any function that requires a sorted array. However, once we run a sort on the value, we know until the variable is next mutated those flags will hold true.
```qupa
void do_something(Reference[Container] arrPtr) {
	with ( arrPtr ) { // locks the mutability of the pointer
		arrPtr->sort(); // the compiler now knows that the side effect of this is that
										// arrPtr is now sorted smallest to largest
		
		print_ordered($arrPtr); // print the values of the container
	}
}
```


# Example 2: Mutex protected references

## Protected References: Implementing Mutex
To create protected references we must first define how a mutex behaves at compile time.
```qupa
flag mut_state = [ unknown, locked ];

class Mutex {
	private:
		bool locked;
	
	public:
		void lock_sync() {
			// Cannot lock an already locked value
			prereq flag this mut_state is unknown;

			// After this function completes this class instance is now locked
			affect flag this mut_state = locked;

			// lock the mutex
		}
		void unlock_sync() {
			// Unlocks are now scope protected due to the compile time nature of flags
			// Hence a function cannot run unlock unless the mutex is currently locked relative to the scope
			// Also inherintly removes hanging locks
			prereq flag this mut_state is unknown;

			// After this function completes this class instance is now unlocked
			affect flag this mut_state = locked;

			// unlock the mutex
		}

		bool try_lock() {
			affect flag this mut_state = unknown;
			affect means {
				case true:
					flag this mut_state = locked;
				case false:
					flag this mut_state = unknown;
			}

			// Attempt atomic lock
			bool success = false;

			if (success) {
				return true;
			} else {
				return false;
			}
		}
}
```
Now, this creates some interesting results within the ``try_lock``. Because we know the meaning behind certain output values if we are in a point in the execution where we know due to a runtime check that the returned value of this function is indeed say ``true``, then we can deduce that within this block the mutex instance is ``locked``.
```qupa
Mutex mut;
if (mut.try_lock()) {
	// mut_state is known to be locked due to the meaning
} else {
	// the lock failed and mut_state = unknown
}
```
At this point, you may be wondering why the only states are ``unknown`` and ``locked`` - why is there no ``unlock``? Because of the nature of multithreaded code and atomics, if you lock failed you only know that the mutex was locked for that exact processor cycle. You cannot know if it is locked within the next cycle unless the lock state is rechecked. Hence having a state of ``unlocked`` is irrelevant information and adds needless complexity.

## Protected References: Implementing References
Now that we have mutex behaviour which updates variable flags we can piggyback off of this to create emergent behaviour to safely interact with the same variable over multiple threads. Note that this example will implement the ``Reference`` class used in example 1.
```qupa
// The actual data stored
// With the actual mutex
template (Wild T)
class Ref_Node {
	Mutex lock;
	T data;
}

template (Wild T)
class Ref {
	private:
		@Ref_Node[T] real;

	public:
		void open_sync () {
			// Again, you can't lock a mutex which has already been locked in this scope
			// Or else you will have a dead lock
			prereq flag this mut_state == unknown;

			// Once this function does complete the state will now be locked
			affect flag this mut_state = locked;

			// Access the raw pointer to reach the mutex and lock it
			unsafe {
				this->real->lock.lock_sync();
			}
		}

		void close_sync () {
			// Same as open_sync but in reverse
			prereq flag this mut_state == locked;
			affect flag this mut_state = unknown;
			unsafe {
				this->real->lock.unlock_sync();
			}
		}

		@T dereference(): [ safety.dangerous ] {
			// Now that we have flags stating whether or not the mutex is locked
			//  in this flow state
			// We can ensure that you cannot access the value of the reference
			//  unless the reference is currently locked
			// Which is all confirmed at compile time

			prereq flag this.mut_state == locked;
			return @this->real->data;
		}
}
```
Now we have compile-time insurance that we cannot access the value of a given reference unless it is currently locked. And to remove the create of dead-locks there is no way to forget to unlock a mutex as the open/close operations are handled via syntax generated code. Also, further deadlocks are removed because the reference is known when to be compile-time locked within this scope, you cannot call a function which will lock this value while it is already locked.
```
void add(Reference[i32] ref) {
	with (ref) {
		ref += 1;
	}
}

Reference[i32] ref;
with (ref) {
	$ref = 28;

	// Cannot call add(ref) as the reference is locked
	//  and the compiler can deduce that this function
	//  requires the reference to be unlocked
}
// However it can be called here
add(ref);
```
If you need to call a function which mutates a given reference from within the scope of a locked reference - you can temporarily invert the lock state. This also makes it explicitly clear to anyone reading the code, that this function the reference is being passed to, may mutate the value.
```qupa
with (ref) {
	$ref = 28;

	with (~ref) {
		// ref is now unlocked
		add(ref);
	}
	// ref is now relocked
}
```


# Summary
* Flags can be used to define certain compile-time pre-requisites which can then reduce the number of runtime errors by introducing new possible compile-time errors.
* All flags are dropped when a value is mutated (values return to default values).  
  *The compiler can determine if any function mutates a given variable either directly or by proxy (if it calls another function that mutates the value). Hence when a function is called on a reference which mutates a variable, or if a variable is reassigned this point activates.*