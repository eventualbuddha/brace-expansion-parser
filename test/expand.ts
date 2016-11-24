import expand from '../lib/expand';
import { deepEqual } from 'assert';
import { suite, test } from 'mocha-typescript';

@suite class ExpandTest {
  @test 'does not expand an empty expression'() {
    deepEqual(
      expand(''),
      ['']
    );
  }

  @test 'does not expand a simple expression'() {
    deepEqual(
      expand('abc'),
      ['abc']
    );
  }

  @test 'expands an expression containing only an expansion to the parts of the expansion'() {
    deepEqual(
      expand('{a,b}'),
      ['a', 'b']
    );
  }

  @test 'prefixes strings before an expansion in each part'() {
    deepEqual(
      expand('0{a,b}'),
      ['0a', '0b']
    );
  }

  @test 'suffixes strings after an expansion in each part'() {
    deepEqual(
      expand('{a,b}z'),
      ['az', 'bz']
    );
  }

  @test 'prefixes and suffixes strings with an expansion in each part'() {
    deepEqual(
      expand('0{a,b}z'),
      ['0az', '0bz']
    );
  }

  @test 'multiplies multiple expansions'() {
    deepEqual(
      expand('{a,b}-{c,d}-{e,f}'),
      ['a-c-e', 'a-c-f', 'a-d-e', 'a-d-f', 'b-c-e', 'b-c-f', 'b-d-e', 'b-d-f']
    );
  }
}
