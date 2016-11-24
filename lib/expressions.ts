/**
 * Represents part or all of a brace expression.
 */
export abstract class Expression {
  start: number;
  end: number;

  constructor(start: number = 0, end: number = 0) {
    this.start = start;
    this.end = end;
  }

  abstract serialize(options: { simplify?: boolean }): string;
}

/**
 * Represents a brace expression. These may be nested inside expansions.
 */
export class BraceExpression extends Expression {
  elements: Array<StringExpression | ExpansionExpression>;

  constructor(elements: Array<StringExpression | ExpansionExpression>, start: number = 0, end: number = 0) {
    super(start, end);
    this.elements = elements;
  }

  serialize(options: { simplify?: boolean } = {}): string {
    return this.elements.map(element => element.serialize(options)).join('');
  }
}

/**
 * Represents a literal string inside a brace expansion.
 */
export class StringExpression extends Expression {
  content: string;

  constructor(content: string, start: number = 0, end: number = 0) {
    super(start, end);
    this.content = content;
  }

  serialize(options: { simplify?: boolean } = {}): string {
    return this.content;
  }
}

/**
 * Represents an expansion within a brace expression.
 */
export class ExpansionExpression extends Expression {
  elements: Array<StringExpression | ExpansionExpression | BraceExpression>;

  constructor(elements: Array<StringExpression | ExpansionExpression | BraceExpression>, start: number = 0, end: number = 0) {
    super(start, end);
    this.elements = elements;
  }

  serialize(options: { simplify?: boolean } = {}): string {
    const simplify = options.simplify === true;

    if (this.elements.length === 0 && simplify) {
      return '';
    } else {
      return `{${this.elements.map(element => element.serialize(options)).join(',')}}`;
    }
  }
}
