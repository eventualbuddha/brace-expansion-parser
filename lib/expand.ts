import parse from './parse';
import { Expression, StringExpression, ExpansionExpression, BraceExpression } from './expressions';
import { inspect } from 'util';

/**
 * Expands a brace expansion expression.
 *
 * @example
 *
 *   expand('ab')          // ['ab']
 *   expand('a{b,c}')      // ['ab', 'ac']
 *   expand('a{b,c}{d,e}') // ['abd', 'abe', 'acd', 'ace']
 */
export default function expand(string: string, expression: Expression = parse(string)): Array<string> {
  if (expression instanceof StringExpression) {
    return [expression.content];
  } else if (expression instanceof ExpansionExpression) {
    if (expression.elements.length === 0) {
      return [''];
    } else {
      return expression.elements.reduce(
        (results, element) => results.concat(expand(string, element)),
        [] as Array<string>
      );
    }
  } else if (expression instanceof BraceExpression) {
    if (expression.elements.length === 0) {
      return [''];
    } else {
      return combinations(
        expression.elements.map(element => expand(string, element))
      );
    }
  } else {
    throw new Error(`unexpected expression: ${inspect(expression)}`);
  }
}

/**
 * Generate combination strings by joining combinations of array values.
 *
 * @example
 *
 *   combinations([
 *     ['mom', 'dad'],
 *     [' & '],
 *     ['son', 'daughter']
 *   ])
 *
 *   // ↑ returns ↓
 *
 *   ['mom & son', 'mom & daughter', 'dad & son', 'dad & daughter']
 */
function combinations(arrays: Array<Array<string>>): Array<string> {
  if (arrays.length === 0) {
    return [];
  } else if (arrays.length === 1) {
    return arrays[0];
  } else if (arrays.length === 2) {
    const result: Array<string> = [];

    for (let i = 0; i < arrays[0].length; i++) {
      for (let j = 0; j < arrays[1].length; j++) {
        result.push(arrays[0][i] + arrays[1][j]);
      }
    }

    return result;
  } else {
    const head = arrays[0];
    const tail = combinations(arrays.slice(1));
    return combinations([head, tail]);
  }
}
