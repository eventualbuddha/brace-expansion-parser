export enum TokenType {
  LBRACE,
  RBRACE,
  COMMA,
  STRING,
}

export class Token {
  type: TokenType;
  start: number;
  end: number;

  constructor(type: TokenType, start: number, end: number) {
    this.type = type;
    this.start = start;
    this.end = end;
  }
}

/**
 * Get a list of tokens from a brace expansion expression string.
 */
export default function lex(string: string): Array<Token> {
  const tokens: Array<Token> = [];
  let braceLevel = 0;
  let start = 0;

  for (let i = 0; i < string.length; i++) {
    const chr = string[i];

    if (chr === '{') {
      if (i !== start) {
        tokens.push(new Token(
          TokenType.STRING,
          start,
          i
        ));
      }
      const token = new Token(
        TokenType.LBRACE,
        i,
        i + '{'.length
      );
      tokens.push(token);
      braceLevel += 1;
      start = token.end;
    } else if (chr === '}') {
      if (braceLevel === 0) {
        throw new Error(`found '}' without matching '{' at offset ${i}`);
      }

      if (string[i - 1] !== '}' && string[i - 1] !== '{') {
        const stringToken = new Token(
          TokenType.STRING,
          start,
          i
        );

        tokens.push(stringToken);
      }

      const braceToken = new Token(
        TokenType.RBRACE,
        i,
        i + '}'.length
      );
      braceLevel -= 1;
      tokens.push(braceToken);
      start = braceToken.end;
    } else if (chr === ',' && braceLevel > 0) {
      const stringToken = new Token(
        TokenType.STRING,
        start,
        i
      );
      const commaToken = new Token(
        TokenType.COMMA,
        i,
        i + ','.length
      );
      tokens.push(stringToken, commaToken);
      start = commaToken.end;
    }
  }

  if (braceLevel > 0) {
    throw new Error(`unexpected EOF while looking for '}'`);
  }

  if (start !== string.length) {
    tokens.push(new Token(
      TokenType.STRING,
      start,
      string.length
    ));
  }

  return tokens;
}
