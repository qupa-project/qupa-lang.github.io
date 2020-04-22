## Forammting
The table above is a hybrid of [Regular Extensions to BNF](http://matt.might.net/articles/grammars-bnf-ebnf/) to be more easily readable. If the term in a table row is ``-`` then it means it is a variant of the above term.

<!-- ## Recursion
Note there are some variations, i.e. anything inside ``{ }`` can be repeated one to many times, thus to have zero to many behaviour you must do ``[{ }]``.

## Grouping
Round brackets ``( )`` are used to indicate precendece

## Logic
The pipe ``|`` is used to state one or the other, but not both. -->

## Literals
Anything within double quotes ``" "`` means the literal character should be used. Note that ``\"`` means use the literal ``"`` rather than exiting the literal statement.


## Syntax Table
| Term | Syntax |
|:-|:-|
any | consume all characters until next requirement is reached
eol | ```"\n"```
comment | ```"//" * eol```
~ | ```"/*" any* "*/"```
**Namespace** | 
name | ```( ( A-z \| "_" )+ ( A-z \| 0-9 \| "_")+ )```
name_dotted | ```( ( A-z \| "_" \| "." \| "->" )+ ( A-z \| 0-9 \| "_" \| "." \| "->" )+ )```
**Constants** | 
constant | ```( bool \| int \| double \| text )```
bool | ```( "true" \| "false" )```
int | ```digit+```
double | ```digit+ "." digit+```
~ | ```digit+ "." digit+ "e" digit+```
text | ```"\"" any* "\""```
~ | ```"'" any* "'"```
**Template** |
template | ```"[" template_argument ("," template_argument)* "]"``` 
template_argument | ```"^" name_dotted name```
**Functions** | 
function | ```name_dotted name template? ( ":" func_mod+ )? "(" arguments ")" "{" func_body "}"```
arguments | ```argument ("," argument)*```
argument | ```("^")? name name ( "=" constant )?```
func_call_sync | ```name_dotted "(" ( expression ( "," expression )* )? ")" ```
func_body | ```(declare \| declare assign \| func_call_sync \| async_call)*```
**Async** | 
async_call | ```name_dotted "(" expression ( "," expression )* ")" "then" "->" name_dotted "{" func_body "}"```
async_await | ```"await" name_dotted "(" expression ( "," expression )* ")"```
**Class** |
class | ```"class" name template? ("extends" name_dotted)? ("implements" name_dotted ("," name_dotted)*)? "{" class_body "}"```
class_modifier | ```("public:" \| "private:" \| "protected:" \| "static:")```
class_body | ```(function \| declare \| declare_assign_static \| class_modifier)*```
**Variables** |
declare | ```name_dotted name```
declare_assign | ```name_dotted name "=" expression```
declare_assign_static | ```name_dotted name "=" constant```
assign | ```name_dotted "=" expression```
**Expressions** | *needs rework to account for precedence*
expression | ```opperand ( opperator opperand )*```
~ | ```opperand_mutate expression```
opperator | ```( "&&" \| "\|\|" \| "%" \| "*" \| "/" \| "+" \| "-")```
opperand_mutate | ```( "!" \| "@" )```
opperand | ```( func_call_sync \| async_await \| name_dotted \| constant \| ( "(" expression ")" ) )```
**Libraries** |
import | ```( import_direct \| import_as )```
import_direct | ```"import" text```
import_as | ```"import" text "as" name```
expose | ```"expose" name_dotted```
