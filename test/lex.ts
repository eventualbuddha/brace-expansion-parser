import lex, { Token, TokenType } from '../lib/lex';
import { deepEqual, throws } from 'assert';
import { suite, test } from 'mocha-typescript';

@suite class LexTest {
  @test 'lexes an empty string as an empty token list'() {
    deepEqual(
      lex(''),
      []
    );
  }

  @test 'lexes an simple string as a single string token'() {
    deepEqual(
      lex('abc'),
      [
        new Token(TokenType.STRING, 0, 3),
      ]
    );
  }

  @test 'lexes a string with braces as separate tokens'() {
    deepEqual(
      lex('{a}'),
      [
        new Token(TokenType.LBRACE, 0, 1),
        new Token(TokenType.STRING, 1, 2),
        new Token(TokenType.RBRACE, 2, 3),
      ]
    );
  }

  @test 'lexes a string with a comma inside braces as a separate token'() {
    deepEqual(
      lex('{a,b}'),
      [
        new Token(TokenType.LBRACE, 0, 1),
        new Token(TokenType.STRING, 1, 2),
        new Token(TokenType.COMMA, 2, 3),
        new Token(TokenType.STRING, 3, 4),
        new Token(TokenType.RBRACE, 4, 5),
      ]
    );
  }

  @test 'lexes a string with a comma outside braces as part of the string token'() {
    deepEqual(
      lex('a,b'),
      [
        new Token(TokenType.STRING, 0, 3),
      ]
    );
  }

  @test 'fails to lex a string with mismatched braces'() {
    throws(
      () => lex('{a,{b}'),
      /unexpected EOF/
    );
  }
}
