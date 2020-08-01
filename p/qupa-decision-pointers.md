Title: Qupa's design choice for pointers & templates
Date: 18/07/2020
Tags: Article, Design-Decisions, Qupa
Related: ./doc/langref.html
---
Why our pointer syntax was chosen
---

The core influence for Qupa's syntax was C++ however a goal of our language's is to be completely explicitly clear. Which means no interpretation order bias. Hence ambiguous context-sensitive uses of ``*``, ``<``, and ``>`` which are used in C/++ are not acceptable.

## Pointers

Let's look at this example code snippet, and read it from the pointer of view of a C/++ or Javascript developer and the multiple ways this could be interpreted.

```
a**b
```

### Interpretation 1

<pre><code>a <span class="kwd">*</span> <span class="cal">*b</span></code></pre>

This is the correct interpretation in a C/++ environment. Because as humans as we read the snippet from left to write we first see ``a``, so we know it is likely the first operand of something, then we look across and see ``*`` which stands for multiplication. We can then look at the next character and see another ``*``. We know as humans that you can't have an operator next to an operator, you need something in between them, so it must be a dereference. Then we see ``b``, and we can then go back up our metal stack and determine that we're dereferencing ``b`` then multiplying ``a`` by that dereferenced result.

### Interpretation 2

<pre><code>a <span class="cal">**b</span></code></pre>

What if we read it from right to left? Then it has a completely different mean - and then also includes a syntax error. If we read from right to left we see ``b``, then we see the first ``*`` and this time we might see it a dereference because clearly, a multiplication before a variable is a dereference. Then we go back another step and read the second ``*`` - okay so we're dereferencing twice. Then we hit ``a``. And now what do we do? We haven't seen any operators which take two arguments. So we've hit an error

### Interpretation 3

<pre><code>a <span class="kwd">*</span> <span class="kwd">*</span> b</code></pre>

So now you're tired, or you've just came from a language without pointers and you've forgotten their existence. You read from left to right: ``a``, ``*``, ``*``? You can't have a multiply ``a`` by a multiplication symbol. So this a syntax error incorrect.

### Interpretation 4

<pre><code>a <span class="kwd">**</span> b</code></pre>

You've come from a newer language where ``**`` is shorthand for ``x`` to the power of ``y``. So you read along and you see ``a`` to the power of ``b``. This may work, but it heavily depends on the types of data stored within ``a`` and ``b``.

### Our Syntax

We, of course, want a c-style syntax, which will impose minimal friction when transferring from other languages. So having four possible interpretations depending on your headspace is not an option.
To negate this issue all operations should have their own unique symbol related to them. Hence why we chose ``$`` for dereferencing (getting the value of), and ``@`` for defining a pointer, as you are storing the address of something.

Hence converting each of the previous interpretations into this new syntax they are clearly recognisable as different behaviour without any bracketing or spacing.

<pre><code>a <span class="kwd">*</span> <span class="kwd">$</span>b
a <span class="kwd">$$</span>b
a <span class="kwd">*</span> <span class="kwd">*</span> b
a <span class="kwd">**</span> b</code></pre>

While this does not solve the interpretation of ``**`` alone, the use of ``^`` instead for powers will remove any confusion with the last two examples.

## Templates

Within C++ templates are handled via the syntax ``name<args>``. Which is type declarations are clear and obvious, however when it comes into the context of expressions it can become ambiguous.

<pre><code>a&lt;b&gt;(c)</code></pre>

### Interpretation 1

<pre><code>a <span class="kwd">&lt;</span> b <span class="kwd">&gt;</span></span> (c)</code></pre>

If we know that ``a`` is a template then it is quite clear that this should be resolved as ``a`` being a template function with generation argument ``b`` and the generated function should then execute with arguments ``c``. However, if a is not known to be a template it can be interpreted multiple ways, one such being ``a`` is less than ``b`` which is greater than ``c``.

<pre><code><span class="cal">a<span class="typ">&lt;b&gt;</span></span>(c)</code></pre>

This is the correct C++ interpretation of the snippet where you are accessing an instance of template ``a`` by the argument ``b``.
Then with that template instance you are executing it with arguments ``c``.

### Our Synax

<pre><code><span class="cal">a<span class="typ">#[b]</span></span>(c)</code></pre>

If you have a template which takes two types ``X`` and ``Y``, then any generated function/class from that simplifies a certain point within the dimensions of possibility. Hence if you passed a constant into a template you can see how it behaves the same as a function, however, instead, it is returning behaviour. You can then quite literally think of templates as lazy evaluation of a multiple dimension array of possible results. Hence if you wanted to get a template when given ``X`` and ``Y`` why would you not use the accessing syntax already used for arrays?

Hence this is why we chose to use the syntax of ``#[]`` to access a given template instance rather than the obfuscated syntax of ``<>``.
So going back to the first example the equivalent Qupa syntax would be ``a#[b](c)``. Whereof course ``a#[b]`` is a compile time-resolved event.

Why the ``#``? Because it specifies that the ``[]`` preceding it are a compile-time event. Hence why you cannot use variables within the brackets, and instead can only use literals and datatypes.
This then makes the syntax clear for chaining- example ``foo.bar[x][y].action#[int](a, b)``, you can clearly see that ``foo`` is a structure containing an element named ``bar`` which is a 2D array, and then you are running the function ``action`` on that element with template specifier ``int`` and arguments ``a, b``. You can deduce this all from one simple line without even knowing the definition of any of these datatypes. Without the ``#`` it may be interpreted that ``action`` is another array which holds multiple functions *which is technically what a template is at compile time* however at runtime no template data exists.
