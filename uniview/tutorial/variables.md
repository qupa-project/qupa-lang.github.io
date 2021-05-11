Title: Variables
Date: 19/01/2000
Tags: uv-tut
---
A learn by example tutorial for Uniview  
How variables behave in Uniview 
---

## Linear Types

Variables within Uniview should be thought of in a slightly different way to most languages. Instead of thinking about assigning values to variables, it would be more accurate to say that you're giving a name to a value. You could think about it like naming a car; if you provide a car with a name, it doesn't change anything about the car itself or where it is stored - instead now you just have a way to refer to it.

Continuing with this metaphor, it would be confusing for any specific car to have multiple names; hence, it loses any previous name when receiving a new one.
```uniview
let a = Blank#[Car]();
let b = a;
  // a is now undefined
  // b now refers to the car that was called a
```

Note that not all variables within Uniview behave like this; the variables that act like this are internally called linear.
> A linear type because the value must be used once and only once
Technically the behaviour shown above is not linear because ``b`` is left unused - however, the language detects that and destructs the value for you.

## Normal Types

Variables use normal types when their values represent something intrisic to computing (a primative value).  
Within uniview there are three main catagories of primative types: integers, floats, and booleans.
```uniview
let a = 10;   // integer
let b = 10.0; // float
let c = true; // boolean
```
These values under a given name infinitely.

## Cloning a Value

Cloning produces an exact copy of a variable - this operation can only be applied to linear types.  
This allows you to effectively reuse a value without using the original.
```uniview
let a = Blank#[Car]();
print($a); // prints a clone of a
let b = a; // valid because a hasn't been consumed
```

## Reinstating (Lending) a Value

> If you are new to programming, this concept might be a little complex, and I recommend you relook over this once you understand functions.

Reinstating a value allows the value to put fed forwards into a function call, then after the function is complete the altered version created by the function is reassigned under the original name.
```uniview
let p = Blank#[Person]();
print($p); // { age: 18 }
age($p);   // no change to p as a clone was passed
print($p); // { age: 18 }
age(@p);   // the function aged the person p
           // and the new value was re assigned to p
print($p); // { age: 19 }
```

| [<< Introduction](/uniview/tutorial/introduction.html) | [Index](/uniview/tutorial.html) | [If Statements >>](/uniview/tutorial/if-statements.html) |
|:-|:-:|-:|