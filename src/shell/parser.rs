/*
* Copyright 2023-2024 Juan Miguel Giraldo
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

use alloc::string::String;
use alloc::vec::Vec;
use core::str::Chars;

#[derive(Debug, Clone, PartialEq)]
pub struct Token {
    pub value: String,
    pub token_type: TokenType,
}

#[derive(Debug, Clone, PartialEq)]
pub enum TokenType {
    Command,
    Argument,
    Pipe,
    Redirect,
}

#[derive(Debug)]
pub enum ParseError {
    UnterminatedQuote,
    InvalidEscape,
    EmptyCommand,
    InvalidSyntax(String),
}

pub struct Parser<'a> {
    input: Chars<'a>,
    current: Option<char>,
    tokens: Vec<Token>,
}

impl<'a> Parser<'a> {
    pub fn new(input: &'a str) -> Self {
        let mut chars = input.chars();
        let current = chars.next();
        Self {
            input: chars,
            current,
            tokens: Vec::new(),
        }
    }

    fn advance(&mut self) {
        self.current = self.input.next();
    }

    fn skip_whitespace(&mut self) {
        while let Some(c) = self.current {
            if !c.is_whitespace() {
                break;
            }
            self.advance();
        }
    }

    fn parse_quoted_string(&mut self, quote: char) -> Result<String, ParseError> {
        let mut result = String::new();
        self.advance();

        while let Some(c) = self.current {
            match c {
                c if c == quote => {
                    self.advance();
                    return Ok(result);
                }
                '\\' => {
                    self.advance();
                    match self.current {
                        Some(escaped) => {
                            result.push(match escaped {
                                'n' => '\n',
                                't' => '\t',
                                'r' => '\r',
                                '\\' | '\'' | '"' => escaped,
                                _ => return Err(ParseError::InvalidEscape),
                            });
                            self.advance();
                        }
                        None => return Err(ParseError::InvalidEscape),
                    }
                }
                _ => {
                    result.push(c);
                    self.advance();
                }
            }
        }
        Err(ParseError::UnterminatedQuote)
    }

    fn parse_word(&mut self) -> String {
        let mut result = String::new();

        while let Some(c) = self.current {
            match c {
                c if c.is_whitespace() => {
                    break;
                }
                '|' | '>' | '<' => {
                    break;
                }
                '\\' => {
                    self.advance();
                    if let Some(escaped) = self.current {
                        result.push(escaped);
                    }
                }
                _ => {
                    result.push(c);
                }
            }
            self.advance();
        }

        result
    }

    pub fn parse(&mut self) -> Result<Vec<Token>, ParseError> {
        let mut is_first_token = true;
        self.tokens.clear();

        while let Some(c) = self.current {
            self.skip_whitespace();

            if self.current.is_none() {
                break;
            }

            let token = match self.current.unwrap() {
                '"' | '\'' => {
                    let value = self.parse_quoted_string(self.current.unwrap())?;
                    Token {
                        value,
                        token_type: if is_first_token {
                            TokenType::Command
                        } else {
                            TokenType::Argument
                        },
                    }
                }
                '|' => {
                    self.advance();
                    Token {
                        value: String::from("|"),
                        token_type: TokenType::Pipe,
                    }
                }
                '>' | '<' => {
                    self.advance();
                    Token {
                        value: String::from(if c == '>' { ">" } else { "<" }),
                        token_type: TokenType::Redirect,
                    }
                }
                _ => {
                    let word = self.parse_word();
                    if word.is_empty() {
                        self.advance();
                        continue;
                    }
                    Token {
                        value: word,
                        token_type: if is_first_token {
                            TokenType::Command
                        } else {
                            TokenType::Argument
                        },
                    }
                }
            };

            self.tokens.push(token);
            is_first_token = false;
        }

        if self.tokens.is_empty() {
            return Err(ParseError::EmptyCommand);
        }

        self.validate_syntax()?;
        Ok(self.tokens.clone())
    }

    fn validate_syntax(&self) -> Result<(), ParseError> {
        let mut prev_token: Option<&Token> = None;

        for token in &self.tokens {
            match (&token.token_type, prev_token.map(|t| &t.token_type)) {
                (TokenType::Pipe, Some(TokenType::Pipe)) => {
                    return Err(ParseError::InvalidSyntax(
                        "Cannot have two consecutive pipes".into(),
                    ));
                }
                (TokenType::Redirect, Some(TokenType::Redirect)) => {
                    return Err(ParseError::InvalidSyntax(
                        "Cannot have two consecutive redirects".into(),
                    ));
                }
                (TokenType::Pipe, None) => {
                    return Err(ParseError::InvalidSyntax(
                        "Cannot start command with pipe".into(),
                    ));
                }
                _ => {}
            }
            prev_token = Some(token);
        }

        if let Some(last_token) = self.tokens.last() {
            match last_token.token_type {
                TokenType::Pipe | TokenType::Redirect => {
                    return Err(ParseError::InvalidSyntax(
                        "Cannot end command with pipe or redirect".into(),
                    ));
                }
                _ => {}
            }
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_command() {
        let mut parser = Parser::new("ls -la");
        let tokens = parser.parse().unwrap();
        assert_eq!(tokens.len(), 2);
        assert_eq!(tokens[0].value, "ls");
        assert_eq!(tokens[0].token_type, TokenType::Command);
        assert_eq!(tokens[1].value, "-la");
        assert_eq!(tokens[1].token_type, TokenType::Argument);
    }

    #[test]
    fn test_quoted_strings() {
        let mut parser = Parser::new("echo \"Hello World\"");
        let tokens = parser.parse().unwrap();
        assert_eq!(tokens.len(), 2);
        assert_eq!(tokens[1].value, "Hello World");
    }

    #[test]
    fn test_escaped_characters() {
        let mut parser = Parser::new("echo \"Hello\\nWorld\"");
        let tokens = parser.parse().unwrap();
        assert_eq!(tokens[1].value, "Hello\nWorld");
    }
}
