# brace-expansion-parser

[![Greenkeeper badge](https://badges.greenkeeper.io/eventualbuddha/brace-expansion-parser.svg)](https://greenkeeper.io/)

Parses strings with brace expansions, like this: `foo.{bar,baz}`.

## Install

```
$ npm install [--save] brace-expansion-parser
```

## Use

<a name="expand"></a>
### `expand`

If all you want is the set of expanded strings, use this.

```js
import { expand } from 'brace-expansion-parser';

expand('foo.bar');       // [ 'foo.bar' ]
expand('foo.{bar,baz}'); // [ 'foo.bar', 'foo.baz' ]
expand('{a,b}.{c,d}');   // [ 'a.c', 'a.d', 'b.c', 'b.d' ]
```

<a name="parse"></a>
### `parse`

Provides detailed information about the brace expansion expression.

```js
import { parse } from 'brace-expansion-parser';

parse('foo.{bar,baz}');
/*
BraceExpression {
  start: 0,
  end: 13,
  elements:
   [ StringExpression { start: 0, end: 4, content: 'foo.' },
     ExpansionExpression { start: 4, end: 13, elements: [Object] } ] }
*/
```

If you want to get the string version of the expression, call `serialize`:

```js
import { parse } from 'brace-expansion-parser';

parse('foo.{bar,baz}').serialize(); // 'foo.{bar,baz}'
```

You can modify an expression object and use it to generate a modified expression
string:

```js
import { parse, StringExpression } from 'brace-expansion-parser';

const ast = parse('foo.{bar,baz}');

ast.elements[0].content = 'FOO.';
ast.elements[1].elements.push(new StringExpression('moo'));

ast.serialize(); // 'FOO.{bar,baz,moo}'
```

<a name="lex"></a>
### `lex`

Breaks the brace expresion string into a stream of tokens.

```js
import { lex, TokenType } from 'brace-expansion-parser';

lex('foo.{bar,baz}');
/*
[ Token { type: 3, start: 0, end: 4 },
  Token { type: 0, start: 4, end: 5 },
  Token { type: 3, start: 5, end: 8 },
  Token { type: 2, start: 8, end: 9 },
  Token { type: 3, start: 9, end: 12 },
  Token { type: 1, start: 12, end: 13 } ]
*/
TokenType;
/*
{ '0': 'LBRACE',
  '1': 'RBRACE',
  '2': 'COMMA',
  '3': 'STRING',
  LBRACE: 0,
  RBRACE: 1,
  COMMA: 2,
  STRING: 3 }
*/
```

## Development

Clone this repo, then run `npm install` and `npm test` to make sure everything
works. Add features or fix bugs on a new branch and create a pull request.
