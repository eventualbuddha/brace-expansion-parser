import parse from '../lib/parse';
import { BraceExpression, StringExpression, ExpansionExpression } from '../lib/expressions';
import { deepEqual, strictEqual } from 'assert';
import { suite, test } from 'mocha-typescript';

@suite class ParseTest {
  @test 'parses an empty string as an empty brace expression'() {
    deepEqual(
      parse(''),
      new BraceExpression([], 0, 0)
    );
  }

  @test 'leaves strings without braces as-is'() {
    deepEqual(
      parse('a.b.c'),
      new BraceExpression(
        [new StringExpression('a.b.c', 0, 5)], 0, 5
      )
    );
  }

  @test 'expands braces with elements separated by commas'() {
    deepEqual(
      parse('<{,ab}-{cd,}>'),
      new BraceExpression(
        [
          new StringExpression('<', 0, 1),
          new ExpansionExpression(
            [
              new StringExpression('', 2, 2),
              new StringExpression('ab', 3, 5),
            ],
            1, 6
          ),
          new StringExpression('-', 6, 7),
          new ExpansionExpression(
            [
              new StringExpression('cd', 8, 10),
              new StringExpression('', 11, 11)
            ],
            7, 12
          ),
          new StringExpression('>', 12, 13)
        ],
        0, 13
      )
    );
  }

  @test 'supports nested braces'() {
    deepEqual(
      parse('{a,{b,c}}'),
      new BraceExpression(
        [
          new ExpansionExpression(
            [
              new StringExpression('a', 1, 2),
              new ExpansionExpression(
                [
                  new StringExpression('b', 4, 5),
                  new StringExpression('c', 6, 7)
                ],
                3, 8
              )
            ],
            0, 9
          )
        ],
        0, 9
      )
    );
  }

  @test 'supports empty expansions'() {
    deepEqual(
      parse('a{}b'),
      new BraceExpression(
        [
          new StringExpression('a', 0, 1),
          new ExpansionExpression([], 1, 3),
          new StringExpression('b', 3, 4)
        ],
        0, 4
      )
    );
  }

  @test 'returns an object whose `serialize` method returns the original string'() {
    strictEqual(
      parse('a{}b').serialize(),
      'a{}b'
    );
  }

  @test 'returns an object whose `serialize` method allows simplifying the original string'() {
    strictEqual(
      parse('a{}b').serialize({ simplify: true }),
      'ab'
    );
  }
}
