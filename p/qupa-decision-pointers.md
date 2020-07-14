Title: Why Qupa's design decision for pointers
Date: 14/07/2020
Tags: Design-Decisions, Qupa
Related: ./doc/langref.html
---
Why our pointer syntax was chosen
---

The core influence for Qupa's syntax was C++ however a goal of the language is to be completely explicitly clear. Which means no interpretation order bias. Hence the use of a ``*`` on either side of a variable name to indicate a variable is not a satisfiable solution.

Let's take the example ``a**b``, it has four interpretations depending on how you read it. If we're a human, then we most certainly can read non-linear and can see ``a deref(deref(b))`` - okay, but that produces a syntax error. If you read it from left to right you might see ``a to the power of b``, but that's not right, what if ``b`` is a pointer? So we can see how reading left to right the only viable solution is ``a * deref(b)``.

So if you look at it in a deterministic way from left to right, where you always look for multiplication first, then dereferences, then possibly powers how you can arrive at the correct solution. But as a programmer trying to quickly read some code it is not instantly clear on the solution. Also what if we mean do to a double dereference and the forgot another operator? Now we'd be throwing the wrong error.

So instead we want to make it clear. If you are accessing the address of something you specify that with a prefixed ``@``, and if you want to dereference something and get the value at an address you need to use ``$`` before it. A pointer should never be confused with an actual value, as a pointer introduces concurrency - if it is parsed to a function, it's value may change, and certainly, if you're executing multithreaded it could change at any moment unless you have explicitly prevented that otherwise.