Title: Qupa's design choice for pointers & templates
Date: 15/07/2020
Tags: Design-Decisions, Qupa
Related: ./doc/langref.html
---
Why our pointer syntax was chosen
---

The core influence for Qupa's syntax was C++ however a goal of our language's is to be completely explicitly clear. Which means no interpretation order bias. Hence ambiguous context-sensitive uses of ``*``, ``<``, and ``>`` which are used in C/++ are not acceptable.

## Pointers
Let's take the example ``a**b``, it has four interpretations depending on how you read it. If we're a human, then we most certainly can read non-linear and can see ``a deref(deref(b))`` - okay, but that produces a syntax error. If you read it from left to right you might see ``a to the power of b``, but that's not right, what if ``b`` is a pointer? So we can see how reading left to right the only viable solution is ``a * deref(b)``.

So if you look at it in a deterministic way from left to right, where you always look for multiplication first, then dereferences, then possibly powers how you can arrive at the correct solution. But as a programmer trying to quickly read some code it is not instantly clear on the solution. Also what if we mean do to a double dereference and the forgot another operator? Now we'd be throwing the wrong error.

So instead we want to make it clear. If you are accessing the address of something you specify that with a prefixed ``@``, and if you want to dereference something and get the value at an address you need to use ``$`` before it. A pointer should never be confused with an actual value, as a pointer introduces concurrency - if it is parsed to a function, it's valued may change, and certainly, if you're executing multithreaded it could change at any moment unless you have explicitly prevented that otherwise.

## Templates
Within C++ templates are handled via the syntax ``name<args>``. Which in type declarations is clear and obvious, however when it comes into the context of expressions it can become ambiguous.  
Take for example ``a<b>(c)`` - if we know that ``a`` is a template then it is quite clear that this should be resolved as ``a`` being a template function with generation argument ``b`` and the generated function should then execute with arguments ``c``. However, if a is not known to be a template it can be interpreted multiple ways, one such being ``a`` is less than ``b`` which is greater than ``c``.

If you have a template which takes two types ``X`` and ``Y``, then any generated function/class from that simplifies a certain point within the dimensions of possibility. Hence if you passed a constant into a template you can see how it behaves the same as a function, however, instead, it is returning behaviour. You can then quite literally think of templates as lazy evaluation of a multiple dimension array of possible results. Hence if you wanted to get a template when given ``X`` and ``Y`` why would you not use the accessing syntax already used for arrays?

Hence this is why we chose to use the syntax of ``[]`` to access a given template instance rather than the obfuscated syntax of ``<>``. So going back to the first example the equivalent Qupa syntax would be ``a[b](c)``. Whereof course ``a[b]`` is a compile time-resolved event.