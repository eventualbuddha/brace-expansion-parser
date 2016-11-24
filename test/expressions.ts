import { StringExpression, ExpansionExpression, BraceExpression } from '../lib/expressions';
import { suite, test } from 'mocha-typescript';
import { strictEqual } from 'assert';

@suite class StringExpressionTest {
  @test 'serializes as its contained string'() {
    strictEqual(
      new StringExpression('a', 0, 1).serialize(),
      'a'
    );
  }
}

@suite class ExpansionExpressionTest {
  @test 'serializes an empty expansion as braces'() {
    strictEqual(
      new ExpansionExpression([], 0, 2).serialize(),
      '{}'
    );
  }

  @test 'serializes an empty expansion as an empty string with simplify: true'() {
    strictEqual(
      new ExpansionExpression([], 0, 2).serialize({ simplify: true }),
      ''
    );
  }

  @test 'serializes by joining elements with a comma'() {
    strictEqual(
      new ExpansionExpression([
        new StringExpression('a', 1, 2),
        new StringExpression('b', 3, 4),
        new ExpansionExpression([], 5, 8),
      ], 0, 7).serialize(),
      '{a,b,{}}'
    );
  }

  @test 'passes the `simplify` parameter to children'() {
    strictEqual(
      new ExpansionExpression([
        new StringExpression('a', 1, 2),
        new StringExpression('b', 3, 4),
        new ExpansionExpression([], 5, 8),
      ], 0, 7).serialize({ simplify: true }),
      '{a,b,}'
    );
  }
}

@suite class BraceExpressionTest {
  @test 'serializes an empty expression as an empty string'() {
    strictEqual(
      new BraceExpression([], 0, 2).serialize(),
      ''
    );
  }

  @test 'serializes by joining elements'() {
    strictEqual(
      new BraceExpression([
        new StringExpression('a', 0, 1),
        new ExpansionExpression([], 1, 3)
      ], 0, 3).serialize(),
      'a{}'
    );
  }

  @test 'passes the `simplify` parameter to children'() {
    strictEqual(
      new BraceExpression([
        new StringExpression('a', 0, 1),
        new ExpansionExpression([], 1, 3),
      ], 0, 3).serialize({ simplify: true }),
      'a'
    );
  }
}
