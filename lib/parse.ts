import lex, { Token, TokenType } from './lex';
import { BraceExpression, StringExpression, ExpansionExpression } from './expressions';

/**
 * Gets an object by parsing a brace expansion expression string.
 */
export default function parse(string: string, tokens: Array<Token> = lex(string)): BraceExpression {
  const result = parseBraceExpression(tokens, 0, string);

  if (result.offset !== tokens.length) {
    throw new Error(`unexpected token found after expression: ${JSON.stringify(tokens[result.offset])}`);
  }

  return result.expression;
}

function parseBraceExpression(tokens: Array<Token>, offset: number, source: string): { offset: number, expression: BraceExpression } {
  const elements: Array<StringExpression | ExpansionExpression | BraceExpression> = [];

  if (tokens.length === 0) {
    return { offset, expression: new BraceExpression([], 0, 0) };
  }

  const initialOffset = offset;

  while (offset < tokens.length) {
    const result = parseBraceExpressionElement(tokens, offset, source);

    offset = result.offset;
    elements.push(result.expression);

    const next = tokens[offset];

    if (!next || next.type === TokenType.RBRACE || next.type === TokenType.COMMA) {
      break;
    }
  }

  return {
    offset,
    expression: new BraceExpression(
      elements,
      tokens[initialOffset].start,
      tokens[offset - 1].end
    )
  };
}

function parseBraceExpressionElement(tokens: Array<Token>, offset: number, source: string): { offset: number, expression: StringExpression | ExpansionExpression } {
  if (tokens.length === offset) {
    throw new Error(`cannot parse expression without any tokens!`);
  }

  const token = tokens[offset];

  switch (token.type) {
    case TokenType.LBRACE:
      return parseExpansionExpression(tokens, offset, source);

    case TokenType.STRING:
      return parseString(tokens, offset, source);

    default:
      throw new Error(`unexpected token ${TokenType[token.type]}: ${JSON.stringify(token)}`);
  }
}

function parseExpansionExpression(tokens, offset, source): { offset: number, expression: ExpansionExpression } {
  const firstToken = tokens[offset];

  if (!firstToken || firstToken.type !== TokenType.LBRACE) {
    throw new Error(`unexpected token while looking for expansion: ${firstToken.type}`)
  }

  offset += 1;
  const elements: Array<StringExpression | ExpansionExpression | BraceExpression> = [];

  while (offset < tokens.length) {
    if (tokens[offset].type === TokenType.RBRACE) {
      offset += 1;
      break;
    }

    const result = parseBraceExpression(tokens, offset, source);

    offset = result.offset;

    const element = result.expression;
    if (element.elements.length === 1) {
      elements.push(element.elements[0]);
    } else {
      elements.push(element);
    }

    if (tokens[offset].type === TokenType.COMMA) {
      offset += 1;
    } else if (tokens[offset].type !== TokenType.RBRACE) {
      throw new Error(`unexpected token in expansion: ${tokens[offset].type} (${JSON.stringify(tokens[offset])})`);
    }
  }

  return {
    offset,
    expression: new ExpansionExpression(
      elements,
      firstToken.start,
      tokens[offset - 1].end,
    )
  };
}

function parseString(tokens: Array<Token>, offset: number, source: string): { offset: number, expression: StringExpression } {
  const token = tokens[offset];

  if (token.type !== TokenType.STRING) {
    throw new Error(`unexpected token while looking for a string: ${token.type}`)
  }

  return {
    offset: offset + 1,
    expression: new StringExpression(
      source.slice(token.start, token.end),
      token.start,
      token.end
    )
  };
}
