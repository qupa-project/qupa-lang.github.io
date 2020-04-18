**Index:**
> * [Abstract](#Abstract)
> * [Introduction](#Introduction)
> * [Comment](#Comment)
>   * [Single Line](#Comment-Single-Line)
>   * [Multi Line](#Comment-Multi-Line)
> * [Function](#Function)
>   * [Argument](#Function-Argument)
>     * [Default](#Function-Argument-Default)
>     * [Upgrade](#Function-Argument-Upgrade)
>   * [Method](#Function-Method)
>   * [Template](#Function-Template)
>   * [Modifier](#Function-Modifier)
>     * [Async](#Function-Modifier-Async)
>     * [Inline](#Function-Modifier-Inline)
> * [Declare](#Declare)
> * [Assign](#Assign)
>   * [Short Hand](#Assign-Short-Hand)
> * [If statement](#If-statement)
>   * [Elif statement](#If-Elif)
>   * [Else statement](#If-Else)
> * [Expression](#Expression)
> * [Import](#Import)
>   * [Import As](#Import-As)
>   * [Import Direct](#Import-Direct)
> * [Expose](#Expose)
> * [Class](#Class)
>   * [Standard Methods](#Class-Standard-Methods)
>     * [Add](#Class-Standard-Methods-Add)
>     * [Subtract](#Class-Standard-Methods-Subtract)
>     * [Multiply](#Class-Standard-Methods-Multiply)
>     * [Divide](#Class-Standard-Methods-Divide)
>     * [Modulo](#Class-Standard-Methods-Modulo)
>     * [Valid](#Class-Standard-Methods-Valid)
>     * [Equal](#Class-Standard-Methods-Equal)
>     * [Less](#Class-Standard-Methods-Less)
>     * [Less Equal](#Class-Standard-Methods-Less-Equal)
>     * [Greater](#Class-Standard-Methods-Greater)
>     * [Greater Equal](#Class-Standard-Methods-Greater-Equal)
>     * [To String](#Class-Standard-Methods-To-String)
> * [Interface](#Interface)
> * [Async](#Async)

# Abstract
# Introduction

# Comment
Comments are sections of code which are purely for the aid of the programmer, and are ignored at the interpretation stage.

## Comment: Single line
This type of code comment will ignore everything from the start of a ``//`` to a new line character.

**Syntax**
```
// <text>\n
```

## Comment: Multi Line
This type of code comment will ignore everything from the start of a ``/*`` to a ``*/`` this can span multiple lines.

**Syntax**
```
/* <text> */
```


# Function
Functions are defined with a static return type, with zero to many function arguments. A function may only return once, attempting to return more than once will result in a runtime error.

**Syntax Definition:**
```
<type_rtrn> <func_name> ( <arguments> ) {
  <body>
}
```
**Syntax Call**
```
<func_name> ( <arguments> )
```

## Function: Argument
Function arguments must each have a type, and a name. Each argument must be delimetered by a ``,``, however there must not be a trailing ``,``.

**Syntax:**
```
<type> <name>
```
```
<type> <name>, <type2> <name2>
```

### Function: Argument: Default
> Implmentation Stage: Beta/Release

Arguments may have a default value which it will posess if no value is specified at a call point. These values must be static constants, which are resolved at compile time.

**Syntax:**
```
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
```
<type> <name>: <modifier> (<arguments>) {
  <body>
}
```

### Function: Modifier: Async
> Implmentation Stage Alpha

The ``async`` modifier specified this function will behave asynchnously. Meaning it can have delayed returns, interupted execution, and may continue execution due to cleanup or other listeners after returning. Further execution behaviour defined in [async](#Async).  

Note that the async modifier cannot be used at the same time as the ``inline`` modifier.

**Syntax:**
```
<type> <name>: async ( <arguments> ) {
  <body>
}
```

### Function: Modifier: inline
> Implementation Release

The ``inline`` deliminer specifies to the compiler to embed the behaviour of this function at the place of calling.

**Syntax:**
```
<type> <name>: inline ( <arguments> ) {
  <body>
}
```

## Function: Template
> Implementation Beta

Allows the compile time generation of methods for this function based syntax input. Specifiers are declared similar to arguments - ``<type> <name>``, however all types are presumed [upgradeable](#Function-Argument-Upgrade) and the name specified can then be used as a type/class name within the function arguments and body.

Note that the brackets of the specifier must be before any modifiers

**Syntax: Definition**
```
<type> <name>[<specifier>] (<arguments>) {
  <body>
}
```
```
<type> <name>[<specifier>]: async (<arguments>) {
  <body>
}
```

**Syntax: Execution**
```
<name>[<specifier>](<arguments>)
```




# Declare
Variable can be defined in two scopes: global; and function. All definitions are raised to the top of the current scope. Thus if defining a varaible at any point within a function would be have the same as defining it at the beginning of the function.
```
<type> <name>
```

# Assign

Assigns the result of an expression being resolved to a certain variable. How expressions are resolved are defined within [expression](#Expression).

**Syntax:**
```
<name> = <expr>;
```

## Assign: Short Hand
> Implemented in beta stage

Long form
```
<name> = <name> <opper> ( <expr> );
```
Short form
```
<name> <opper>= <expr>;
```

Operations that the short form can be applied to; ``+``, ``-``, ``*``, ``/``

**Examples:**
```qupa
number += a;
```
```qupa
number -= a;
```
```qupa
number *= a;
```
```qupa
number /= a;
```

# If statement
The [expression](#Expression) will be resolved according to the [expression](#Expression) definition, then the resulting value will have it's [class validity check](#Class-standard-methods-valid) ran. If the result is true, then the ``<body>`` code content will execute.

After execution of the ``if`` clause execution will continue after the last chain of the ``if`` statement. Be that the last ``elif`` clause, or the last ``else`` clause.

**Syntax:**
```
if ( <expr> ) {
  <body>
}
```
## If: Elif
These statement can be continued off of other [if statements](#If-Statement) and other [elif statements](#IF-Elif), however it cannot exist anywhere else. This behaves similarly to an ``if`` statement, however it will only execute if the previous ``if`` and ``elif`` statement's conditions fail.

After execution of the ``elif`` clause execution will continue after the last chain of the ``if`` statement. Be that the last ``elif`` clause, or the last ``else`` clause.

**Syntax:**
```
elif ( <expr> ) {
  <body>
}
```

**Examples**
```qupa
if (false) {
  // will not execute
} elif (true) {
  // will execute
}
```

## If: Else
This statement can be continued off of any [if statements](#If-Statement) or [elif statements](#IF-Elif), and will only execute the body code if the previous statement's conditions fail.

After execution of the ``else`` clause executione will continue after it's closing bracket.

**Syntax:**
```
else {
  <body>
}
```

**Examples**
```qupa
if (false) {
  // will not execute
} elif (false) {
  // will not execute
} else {
  // will execute
}
```

# Expression
Expressions dictate how computation is resolved, and how arithmetic symbols are resolved. Most expression opperands are processed according to their [standard class method](#Class-Standard-Methods).  

The order of operations are (from last executed to first);  
| Operation | Syntax | Class Standard Method |
|:-|:-|:-|
Brackets | ``( <expr> )`` | -
Add (boolean/set) | ``<opperand> && <opperand>`` | Yes
Or (boolean/set) | ``<opperand> || <opperand>`` | Yes
Modulus | ``<opperand> % <opperand>`` | Yes
Multiplication | ``<opperand> * <opperand>`` | Yes
Division | ``<opperand> / <opperand>`` | Yes
Addition | ``<opperand> +<opperand> `` | Yes
Subtraction | ``<opperand> - <opperand>`` | Yes
Invert (aka Not) | ``!<opperand>`` | Yes
Address | ``@<variable_name>`` | -
Function calls (Synchronous) | [definition](#Function) | -

# Import

## Import: As

## Import: Direct

# Expose

# Class

## Class: Standard Methods
### Class: Standard Methods: Get
### Class: Standard Methods: Invert
### Class: Standard Methods: And (boolean/set)
### Class: Standard Methods: Or (boolean/set)
### Class: Standard Methods: Add
### Class: Standard Methods: Subtract
### Class: Standard Methods: Multiply
### Class: Standard Methods: Divide
### Class: Standard Methods: Modulo
### Class: Standard Methods: Valid
### Class: Standard Methods: Equal
### Class: Standard Methods: Less
### Class: Standard Methods: Less Equal
### Class: Standard Methods: Greater
### Class: Standard Methods: Greater Equal
### Class: Standard Methods: To String

# Interface

# Async
