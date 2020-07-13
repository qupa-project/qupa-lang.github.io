Title: Syntax outline
Date: 14/07/2020
Tags: Specification
Related: ./LangRef.html
---
The syntax outline for Qupa
---

## Forammting
The table above is a hybrid of [Regular Extensions to BNF](http://matt.might.net/articles/grammars-bnf-ebnf/) to be more easily readable. If the term in a table row is ``-`` then it means it is a variant of the above term.

## Literals
Anything within double quotes ``" "`` means the literal character should be used. Note that ``\"`` means use the literal ``"`` rather than exiting the literal statement.


## Syntax Table
| Term | Syntax |
|:-|:-|
any | consume all characters until next requirement is reached
eol | ``"\n"``
comment | ``"//" * eol``
~ | ``"/*" any* "*/"``
**Namespace** | 
letters | ``( "a" \| "b" \| "c" \| "d" \| "e" \| "f" \| "g" \| "h" \| "i" \| "j" \| "k" \| "l" \| "m" \| "n" \| "o" \| "p" \| "q" \| "r" \| "s" \| "t" \| "u" \| "v" \| "w" \| "x" \| "y" \| "z" \| "A" \| "B" \| "C" \| "D" \| "E" \| "F" \| "G" \| "H" \| "I" \| "J" \| "K" \| "L" \| "M" \| "N" \| "O" \| "P" \| "Q" \| "R" \| "S" \| "T" \| "U" \| "V" \| "W" \| "X" \| "Y" \| "Z" )``
digit | ``( "0" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" )``
name | ``( letters \| "_" )+ ( letters \| digit \| "_" )+ ``
name_dotted | ``( letters \| "_" \| "." \| "->" )+ ( letters \| digit \| "_" \| "." \| "->" )+``
**Constants** | 
constant | ``( bool \| int \| double \| text )``
bool | ``( "true" \| "false" )``
int | ``digit+``
double | ``digit+ "." digit+``
~ | ``digit+ "." digit+ "e" digit+``
text | ``"\"" any* "\""``
~ | ``"'" any* "'"``
**Template** |
template | ``"[" template_argument ("," template_argument)* "]"`` 
template_argument | ``"^" name_dotted name``
**Functions** | 
function | ``name_dotted name template? ( ":" func_mod+ )? "(" arguments ")" "{" func_body "}"``
arguments | ``argument ("," argument)*``
argument | ``("^")? name name ( "=" constant )?``
func_call_sync | ``name_dotted "(" ( expression ( "," expression )* )? ")" ``
func_body | ``(declare \| declare assign \| func_call_sync \| async_call \| if_stmt \| loop \| loop_cont \| look_break)*``
**Async** | 
async_call | ``name_dotted "(" expression ( "," expression )* ")" "then" "->" name_dotted "{" func_body "}"``
async_await | ``"await" name_dotted "(" expression ( "," expression )* ")"``
**Class** |
class | ``"class" name template? ("extends" name_dotted)? ("implements" name_dotted ("," name_dotted)*)? "{" class_body "}"``
class_modifier | ``("public:" \| "private:" \| "protected:" \| "static:")``
class_body | ``(function \| declare \| declare_assign_static \| class_modifier)*``
**Variables** |
declare | ``name_dotted name``
declare_assign | ``name_dotted name "=" expression``
declare_assign_static | ``name_dotted name "=" constant``
assign | ``name_dotted assign_oppr? "=" expression``
assign_oppr | ``( "+" \| "-" \| "*" \| "/" )``
**Expressions** |
expression | ``expr_p5``
expr_opperand | ``name \| constant \| func_call_sync \| async_call \| "(" expression ")"``
expr_p1_invert | ``"!" expr_opperand``
expr_p1_address | ``"@" name``
expr_p2_add | ``expr_p2 "+" expr_p1``
expr_p2_subtract | ``expr_p2 "-" expr_p1``
expr_p3_multiply | ``expr_p3 "*" expr_p2``
expr_p3_divide | ``expr_p3 "/" expr_p2``
expr_p4_modulus | ``expr_p4 "%" expr_p3``
expr_p5_and | ``expr_p5 "&&" expr_p4``
expr_p5_or | ``expr_p5 "\|\|" expr_p4``
expr_p1 | ``expr_p1_invert \| expr_p1_address \| expr_opperand ``
expr_p2 | ``expr_p2_add \| expr_p2_subtract \| expr_p1``
expr_p3 | ``expr_p3_multiply \| expr_p3_divide \| expr_p2``
expr_p4 | ``expr_p4_modulus \| expr_p3``
expr_p5 | ``expr_p5_and \| expr_p5_or \| expr_p4``
**Loop** |
loop | ``( loop_for \| loop_while )``
loop_for | ``loop_lable? "for" "(" for_loop_init ";" expression ";" loop_for_ittr ")" "{" func_body "}"``
loop_lable | ``name ":"``
loop_for_init | ``( assign \| declare_assign) ( "," ( assign \| declare_assign ) )?``
loop_for_ittr | ``assign ( "," assign )*``
loop_while | ``loop_lable? while "(" expression ")" "{" func_body "}"``
loop_cont | ``"continue" name?``
loop_break | ``"break" name?``
**If Statement** |
if_stmt | ``if_block elif_block* else_block?``
if_block | ``"if" "(" expression ")" "{" func_body "}"``
elif_block | ``"elif" "(" expression ")" "{" func_body "}"``
else_block | ``"else" "{" func_body "}"``
**Libraries** |
import | ``( import_direct \| import_as )``
import_direct | ``"import" text``
import_as | ``"import" text "as" name``
expose | ``"expose" name_dotted``
