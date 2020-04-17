**Index:**
> * [Abstract](#Abstract)
> * [Introduction](#Introduction)
> * [Function](#Function)
>   * [Argument](#Function:-Argument)
>     * [Default](#Function:-Argument:-Default)
>     * [Upgrade](#Function:-Argument:-Upgrade)
>   * [Method](#Function:-Method)
>   * [Template](#Function:-Template)
>   * [Modifier](#Function:-Modifier)
>     * [Async](#Function:-Modifier:-Async)
>     * [Inline](#Function:-Modifier:-Inline)
> * [Declare](#Declare)
> * [Assign](#Assign)
> * [If statement](#If-statement)
>   * [Elif statement](#If:-Elif)
>   * [Else statement](#If:-Else)
> * [Expression](#Expression)
> * [Import](#Import)
>   * [Import As](#Import:-As)
>   * [Import Direct](#Import:-Direct)
> * [Expose](#Expose)
> * [Class](#Class)
> * [Async](#Async)

# Abstract
# Introduction

# Function
Functions are defined with a static return type, with zero to many function arguments. A function may only return once, attempting to return more than once will result in a runtime error.

**Syntax Definition:**
```qupa
<type_rtrn> <func_name> ( <arguments> ) {
  <body>
}
```
**Syntax Call**
```qupa
<func_name>(<arguments>)
```

## Function: Argument
Function arguments must each have a type, and a name. Each argument must be delimetered by a ``,``, however there must not be a trailing ``,``.

**Syntax:**
```qupa
<type> <name>
```
```qupa
<type> <name>, <type2> <name2>
```

### Function: Argument: Defaults
> Implmentation Stage: Beta/Release

Arguments may have a default value which it will posess if no value is specified at a call point. These values must be static constants, which are resolved at compile time.

**Syntax:**
```qupa
<type> <name> = <constant>
```

### Function: Argument: Upgrade
> Implmentation Stage: Beta/Release

A function argument's type can be marked as upgradable, meaning this function can be produce multiple methods for instances where it is called and parsed a child type.  
For instance if you have ``Student`` as an extended class of ``Person``, you may parse the student inplace of a ``Person`` argument.
```qupa
void SayHi (^Person person) {
  person.say("Hi")
}

void main () {
  Student example;
  SayHi(example);
}
```

**Syntax:**
```
^<type> <name>
```

## Function: Method
> Implmentation Stage Pre-Alpha

There can be multiple definitions under the same function definition within the same namespace. Each instance using that function name is refered to as a method. Each method must have a unique function signature, or else a interpretation error will occur.

## Function: Modifier
> Implmentation Stage Alpha

Function modifiers are optional, however they change the compilation and execution behaviour of a function. Modifiers are listed by adding a ``:`` after the function name, then listing the modifiers afterwards. Note that multiple modifiers can be used via using a space `` `` as the deliminer.

**Syntax**
```qupa
<type> <name>: <modifier> (<arguments>) {
  <body>
}
```

### Function: Modifier: Async
> Implmentation Stage Alpha

The ``async`` modifier specified this function will behave asynchnously. Meaning it can have delayed returns, interupted execution, and may continue execution due to cleanup or other listeners after returning. Further execution behaviour defined in [async](#Async).  

Note that the async modifier cannot be used at the same time as the ``inline`` modifier.

**Syntax:**
```qupa
<type> <name>: async ( <arguments> ) {
  <body>
}
```

### Function: Modifier: inline
> Implementation Release

The ``inline`` deliminer specifies to the compiler to embed the behaviour of this function at the place of calling.

**Syntax:**
```qupa
<type> <name>: inline ( <arguments> ) {
  <body>
}
```

## Function: Template
> Implementation Beta

Allows the compile time generation of methods for this function based syntax input. Specifiers are declared similar to arguments - ``<type> <name>``, however all types are presumed [upgradeable](#Function:-Argument:-Upgrade) and the name specified can then be used as a type/class name within the function arguments and body.

Note that the brackets of the specifier must be before any modifiers

**Syntax: Definition**
```qupa
<type> <name>[<specifier>] (<arguments>) {
  <body>
}
```
```qupa
<type> <name>[<specifier>]: async (<arguments>) {
  <body>
}
```

**Syntax: Execution**
```qupa
<name>[<specifier>](<arguments>)
```




# Declare

# Assign

# If statement
## If: Elif
## If: Else

# Expression

# Import

## Import: As

## Import: Direct

# Expose

# Class

# Async