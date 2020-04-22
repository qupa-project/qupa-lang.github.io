**Index:**
> * [Abstract](#Abstract)
> * [Introduction](#Introduction)
> * [Comment](#Comment)
>   * [Single Line](#Comment-Single-Line)
>   * [Multi Line](#Comment-Multi-Line)
> * [Constants](#Constant)
>   * [Integer](#Constant-Integer)
>   * [Double](#Constant-Double)
>   * [Text](#Constant-Text)
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
> * [Loop](#Loop)
>   * [For](#Loop-For)
>   * [White](#Loop-While)
>   * [Break](#Loop-Break)
>   * [Continue](#Loop-Continue)
> * [Expression](#Expression)
> * [Import](#Import)
>   * [Import Direct](#Import-Direct)
>   * [Import As](#Import-As)
> * [Expose](#Expose)
> * [Class](#Class)
>   * [Variables](#Class-Variables)
>   * [Functions](#Class-Functions)
>   * [Attribute Modifier](#Class-Attribute-Modifier)
>     * [Public](#Class-Attribute-Modifier-Public)
>     * [Private](#Class-Attribute-Modifier-Private)
>     * [Protected](#Class-Attribute-Modifier-Protected)
>     * [Static](#Class-Attribute-Modifier-Static)
>   * [Extends](#Class-Extends)
>   * [Implements](#Class-Implements)
>   * [Standard Methods](#Class-Standard-Methods)
>     * [Init](#Class-Standard-Methods-Init)
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
>   * [Then](#Async-Then)
>   * [Await](#Async-Await)

# Abstract
This document is the outline for the behaviour of Qupa's syntax, while it does also outline the syntax itself, there is a non-ambiguous BNF found [here](./SyntaxOutline.md)

# Introduction

Note that spacing in the syntax examples are optional. As long as white space doesn't interfer with a string, or a namespace. White space is completely ignored.

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


# Constant
Constants are assumed certain types based on their pattern. These types/patterns are described below

## Constant: Boolean
This constant is always resolved as if it is of a [boolean]() class.

**Regex:**
```regex
/(false|true)/w
```

## Constant: Integer
This constant is always resolved as if it is of a [i64]() class.

**Regex:**
```regex
/([0-9]{0,})/w
```

## Constant: Double
This constant is always resolved as if it is of a [f64]() class.

**Regex:**
```regex
/([0-9]{1,})\.([0-9]{1,})/w
```
or
```
/([0-9]{1}\.[0-9]{1,})e(\+|\-)([0-9]{1,})/w
```

**Examples:**
```qupa
123.45
1.2345e-2
```

## Constant: Text
This constant will behave differently depending on which character you use to open and close it. If you use a single quote ``'``, then the constant data will be interpreted into a [string]() class. Otherwise if a ``"`` is used, then the data will interpreted into a [unicode]() class.  

> Note that a [string]() behaves presuming each character is 1 byte long, while [unicode]() supports variable length characters, and thus UTF-8 support.  
> Both string and unicode implement the interface ``text``.

**Regex:**
```regex
(")(.+)(?!\\")
```
or
```regex
(')(.+)(?!\\')
```


# Function
Functions are defined with a static return type, with zero to many function arguments. A function may only return once, attempting to return more than once will result in a runtime error.

The ``type_rtrn`` must be a classname accessible by the current scope.

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
``type`` can be a classname, or an interface available at the current scope. If the type is an interface it must be marked [upgradable](#Function-Argument-Upgrade), otherwise a compilation error will occur, as an interface is not a vaild variable type.
```
<type> <name>
```
```
<type> <name>, <type2> <name2>
```

### Function: Argument: Default
> Implementation Stage: Beta/Release

Arguments may have a default value which it will posess if no value is specified at a call point. These values must be static constants, which are resolved at compile time.

**Syntax:**
```
<type> <name> = <constant>
```

### Function: Argument: Upgrade
> Implementation Stage: Beta/Release

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
> Implementation Stage Pre-Alpha

There can be multiple definitions under the same function definition within the same namespace. Each instance using that function name is refered to as a method. Each method must have a unique function signature, or else a interpretation error will occur.

## Function: Modifier
> Implementation Stage Alpha

Function modifiers are optional, however they change the compilation and execution behaviour of a function. Modifiers are listed by adding a ``:`` after the function name, then listing the modifiers afterwards. Note that multiple modifiers can be used via using a space `` `` as the deliminer.

**Syntax**
```
<type_rtrn> <name>: <modifier> (<arguments>) {
  <body>
}
```

### Function: Modifier: Async
> Implementation Stage Alpha

The ``async`` modifier specified this function will behave asynchnously. Meaning it can have delayed returns, interupted execution, and may continue execution due to cleanup or other listeners after returning. Further execution behaviour defined in [async](#Async).  

Note that the async modifier cannot be used at the same time as the ``inline`` modifier.

**Syntax:**
```
<type_rtrn> <name>: async ( <arguments> ) {
  <body>
}
```

### Function: Modifier: inline
> Implementation Release

The ``inline`` deliminer specifies to the compiler to embed the behaviour of this function at the place of calling.

**Syntax:**
```
<type_rtrn> <name>: inline ( <arguments> ) {
  <body>
}
```

## Function: Template
> Implementation Beta

Allows the compile time generation of methods for this function based syntax input. Specifiers are declared similar to arguments - ``<type> <name>``, however all types must be marked as [upgradeable](#Function-Argument-Upgrade) and the name specified can then be used as a classname within the function arguments and body.

Note that the brackets of the specifier must be before any modifiers. Multiple specifiers are seperated via commas.

**Syntax: Definition**
```
<type_rtrn> <name>[<specifier>] (<arguments>) {
  <body>
}
```
```
<type_rtrn> <name>[<specifier>]: async (<arguments>) {
  <body>
}
```

**Syntax: Execution**
```
<name>[<specifier>](<arguments>)
```




# Declare
Variable can be defined in two scopes: global; and function. All definitions are raised to the top of the current scope. Thus if defining a varaible at any point within a function would be have the same as defining it at the beginning of the function.

**Syntax:**
``type`` must be a classname accessible to the current scope.
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

# Loop
A loop repeats the ``body`` until the condition fails. The ``condition`` is an expression which resolves an [expression](#Expression) and then checks [validity](#Class-Standard-Methods-Valid), this is tested before the execution of each loop.

## Loop: For
When a for loop starts will will first execute any ``init`` cases, it will then test the ``condition``, from there it will repeatedly execute ``condition -> body -> itterate`` until condition fails, which will then execute the program continuing after the for loop.

``init`` can obtain any [assignment](#Assign), and multiple assignments can occur within this segment via seperating them with a comma. E.g. ``i=0, j=1``

``itterate`` this behaves similarly to ``init``, however it executes each time the loop repeats, this can be triggered by reaching the end of the loop or a [continue](#Loop-Continue) statement. E.g. ``i += 1, j += 2``

```
for (<init>; <condition>; <itterate>) {
  <body>
}
```
```
<lable>: for (<init>; <condition>; <itterate>) {
  <body>
}
```
## Loop: While
**Syntax:**
```
while (<condition>) {
  <body>
}
```
```
<lable>: while (<condition>) {
  <body>
}
```

## Loop: Break
This is immediatly (itterate will not execute) exit the loop block specified. If no block is specified then it exists the current depth loop. Otherwise the loop of which will be exited can be specified via the optional term ``<lable>``.

**Syntax:**
```
break
```
```
break <lable>
```

## Loop: Continue
This will jump straight to the itteration process to continue another loop. If no ``<lable>`` is specified then the continue will apply to the current loop.
**Syntax:**
```
continue
```
```
continue <lable>
```


# Expression
Expressions dictate how computation is resolved, and how arithmetic symbols are resolved. Most expression opperands are processed according to their [standard class method](#Class-Standard-Methods).  

The order of operations are (from first executed to last);  
| Precedence | Operation | Syntax | Class Standard Method |
|:-|:-|:-|:-|
1 | Invert (aka Not) | ``! <opperand>`` | Yes
1 | Address | ``@ <variable_name>`` | -
2 | Addition | ``<opperand> + <opperand> `` | Yes
2 | Subtraction | ``<opperand> - <opperand>`` | Yes
3 | Multiplication | ``<opperand> * <opperand>`` | Yes
3 | Division | ``<opperand> / <opperand>`` | Yes
4 | Modulus | ``<opperand> % <opperand>`` | Yes
5 | And (boolean/set) | ``<opperand> && <opperand>`` | Yes
5 | Or (boolean/set) | ```<opperand> || <opperand>``` | Yes
6 | Function calls (Async) | [definition](#Async-Await) | -
6 | Function calls (Sync) | [definition](#Function) | -
7 | Brackets | ``( <expr> )`` | -

# Import
Allows access to variables and functions exposed within another file. The compiler will always search the local scopes first, before trying to resolve to names within other files.  

The front end compiler is multiparse, thus it loads all required files and interprets all variable, function and class declarations before resolving any namespaces, or compiling any behvaiour. Thus importations can have circular references. i.e. ``A imports B; B imports C; C imports A`` 

Also note that all import filepaths are relative to the current file.

## Import: Direct
If a variable or function call cannot be resolved within the current file scope, the compiler will search within libraries imported into the current file scope.

**Syntax**
```
import "<filepath>"
```

## Import: As
All exposed namepsaces within the imported file are only accessible under the namespace provided.  
**Example:**
```qupa
import "library.qp" as library
library.HelloWorld();
```

**Syntax**
```
import "<filepath>" as <namespace>
```

# Expose
Exposing a namespace allows the variable/function/class/interface to be accessed when imported in another file. If a namespace is not exposed then it cannot be accessed on importation.

```
expose <namespace>
```

# Class
> Implementation Stage: Particial implementation by alpha, full implementation by release.

Classes tie behaviour to data, and allow the accessing of class functions in scopes where the original class definition may not be available. It also allows for polymorphic programming, decreasing on duplicate code increasing project readability and maintainability.

> Note that the name of classes can be used wherever ``<type>`` is used in a syntax outline within this document.

**Syntax:**
```
class <namespace> {

}
```

## Class: Variables
Definining a variable within a class will define a class attribute

**Syntax:**
Same as variable [declaration](#Declare) however it must be within a class.

## Class: Functions
Defines a class method, within any non-static function the namespace ``this`` refers to a pointer which points to a class instance or a child class instance. (Includes children of children)

**Syntax: Declaration**  
Same as a normal [function](#Function) however it must be within a class block.

**Syntax: Call**  
Similar to [function](#Function) however the class instance must be specified. Note that this behaviour is changed when the function has the [static modifier](#Class-Attribute-Modifier-Static) applied to it. In that case `<class_instance>` should be replaced with the class' name.
```
<class_instance>.<function_name>( <argments> )
```

## Class: Attribute Modifier
Class attribute modifiers maybe declared at anypoint with class scope (not within any function's scope). They will then apply to all attributes and functions below them. Note that public/private/protected override eachother's behaviour - while static's affects cannot be removed. Thus all static variables/attributes must be at the bottom of the class body.

### Class: Attribute Modifier: Public
This is the default state of all attributes/methods, which means they accessible by any class function, or any external function.

**Syntax**
```
class <namespace> {
  public:
}
```

### Class: Attribute Modifier: Private
This means the attributes/methods may only be accessed by this class/interface, or any class which upgrades it.

**Syntax**
```
class <namespace> {
  private:
}
```

### Class: Attribute Modifier: Protected
This means the attributes/methods can only be accessed by this class, and not any class which extends it.
Note that if another instance of this class accessed by a method of this class, it can also access it's protected attributes.

**Syntax**
```
class <namespace> {
  protected:
}
```

### Class: Attribute Modifier: Static
This means there is only one instance of this method/attribute for all instances.

Hence a static variable behaves similar to a global variable, however it may not be accessible by other methods/classes depedning what other modifiers are acting on it (public/private/protected).

A static function behaves instead much more like a normal function, and does not possess a ``this`` variable within it's local scope. However it can still access any ``private``/``protected`` variables this class should have access to.

**Syntax**
```
class <namespace> {
  static:
}
```


## Class: Extends
This will cause the new class to duplicate all of the attributes/methods from the exention class to this one. Note that in every case ``this`` will be upgraded to the new class type.  
Also note that methods will not be copied if they are replaced within the new class.

**Syntax:**  
A class may only have one extention clause, the exention clause must be after the class name
```
class <namespace> extends <class> {
  <body>
}
```

## Class: Implmenents
This defines that this class will implement all features (methods/attributes) that the interface specified has defined. If an attribute or function is not implemented within this class, that is declared within the interface the compiler will throw an error and will fail to compile.

A single class can implement multiple interfaces, any interface that the class implements - this class will not be considered an upgrade of the interface.

**Syntax:**  
The implements clause must be after the class name, and after any extention.  
```
class <namespace> extends <class> implements <interface> {
  <body>
}
```
For multiple interfaces they must be surrounded by square brackets ``[]``, and there must be a comma after each interface
```
class <namespace> extends <class> implements [ <interface1>, <interface2> ] {
  <body>
}
```

## Class: Template
This allows for dynamically generation of multiple versions of this class, each with customizeable structure and methods. This behaviour is very similar to [function templates](#Function-Template).

Specifiers are declared similar to arguments - ``<type> <name>``, however all types must be marked as [upgradeable](#Function-Argument-Upgrade) and the name specified can then be used as a classname within the class body.

When a class is defined in template form, the namespace itself assumes the form of an interface, which then all versions of the class generated then implement said interface, and extend the defined class if extend clause is present.

**Syntax Definition:**  
The specification must be defined before any [extends](#Class-Extends) or [implmenents](#Class-Implements) clauses and after the class' namespace.

One class may have multiple specifiers via seperating them with a comma.
```
class <namespace>[<specifier>] {
  <body>
}
```

**Syntax Use:**
``namespace`` is the name of a template class available within the current scope.
``type`` must be a classname available within the current scope.
```
<namespace>[<type>]
```

## Class: Standard Methods
Standard methods are methods used within [expressions](#Expression) to handle operators. These are not compulsory (except init), unless specified in an interface that is being implemented.  
They also may have any modifiers on them unless specified otherwise.

It is assumed that these methods return a new class instance, rather than altering the existing instance they were called upon. I.e. ``a.__add__(b)`` should not alter ``a`` but instead return a new value for the result.

### Class: Standard Methods: Init
Init may **not** have the async specifier on it.
```
class <namespace> {
  void __init__ (<attributes>) {

  }
}
```

### Class: Standard Methods: Get
```
class <namespace> {
  <classname> __get__ (<attributes>) {

  }
}
```

### Class: Standard Methods: Invert
```
class <namespace> {
  <namespace> __invert__ () {

  }
}
```

### Class: Standard Methods: And (boolean/set)
```
class <namespace> {
  <namespace> __and__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Or (boolean/set)
```
class <namespace> {
  <namespace> __or__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Add
```
class <namespace> {
  <namespace> __add__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Subtract
```
class <namespace> {
  <namespace> __subtact__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Multiply
```
class <namespace> {
  <namespace> __multiply__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Divide
```
class <namespace> {
  <namespace> __divide__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Modulo
```
class <namespace> {
  <namespace> __modulo__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Valid
```
class <namespace> {
  bool __modulo__ () {

  }
}
```

### Class: Standard Methods: Equal
```
class <namespace> {
  <namespace> __equal__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Less
```
class <namespace> {
  <namespace> __less__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Less Equal
```
class <namespace> {
  <namespace> __lessEqual__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Greater
```
class <namespace> {
  <namespace> __greater__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: Greater Equal
```
class <namespace> {
  <namespace> __greaterEqual__ (<classname> <variable_1>) {

  }
}
```

### Class: Standard Methods: To String
Note that ``<text>`` may be of any type that is an upgrade from ``text``.
```
class <namespace> {
  <text> __modulo__ () {

  }
}
```

# Interface
> Note that the name of interfaces can be used wherever ``<type>`` is used in a syntax outline within this document.

# Async
A sync class declaration is defined in the [function outline](#Function-Modifier-Async). This segment outlines the change in execution behaviour and where async functions can and cannot be executed.

An async function can only be executed normally within another async function. Async functions may have a large time delay between call and return, and also multiple other processes may take process within the current thread between call and return on an execution.

## Async: Then
> Implementation stage alpha

The execution of a then clause occurs when function execution has finished.
**Syntax:**
```
<namespace>(<attributes>) then {
  <body>
}
```
The return value can be written to a local varaible via the syntax below. Note until the return event occurs, no alterations will occur to this variable.
```
<namespace>(<attributes>) then -> <namespace2> {
  <body>
}
```

## Async: Await
> Implementation stage beta

This will pause the execution of the current method until the return of the called function. The result of which will then be parsed inline similar to the normal behaviour of function. Thus via the use of the await term async functions can be used within expressions.

**Syntax:**
```
await <namespace>(<attributes>)
```
