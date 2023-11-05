import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { match, Either, right, left } from "fp-ts/lib/Either"

const privateKey = "abcd";

type SignFunction = (payload: string | Buffer | object, secretOrPrivateKey: jwt.Secret) => string;
type TokenMaker = (privateKey: string, signFunction: SignFunction) => (username: string) => string;
const tokenMaker: TokenMaker = (privateKey, signFunction) => (username) => signFunction({ username: username }, privateKey);

type VerifyFunction = (
  token: string,
  secretOrPublicKey: jwt.Secret | jwt.GetPublicKeyOrSecret,
  callback?: jwt.VerifyCallback<jwt.JwtPayload>,
) => void;
type TokenDecoder = (privateKey: string, verifyFunction: Function) => (token: string) => Either<Error, jwt.JwtPayload>;
const tokenDecoder: TokenDecoder = (privateKey: string, verifyFunction: VerifyFunction) => (token: string) => {
  let result: Either<Error, jwt.JwtPayload>;
  verifyFunction(token, privateKey, (err, decoded: jwt.JwtPayload) => {
    if (err) {
      // console.error('JWT verification failed:', err);
      result = left(new Error('JWT verification failed: ' + err));
    } else {
      // console.log(decoded.username);
      result = right(decoded);
    }
  });
  console.log(result);
  return result;
};

const encoder = tokenMaker(privateKey, jwt.sign);
const decoder = tokenDecoder(privateKey, jwt.verify);

type ReplyUnauthorized = (res: Response) => (error: Error) => void;
const replyUnauthorized: ReplyUnauthorized = (res) => (error) => res.status(401).send("Authentication failed");

type ReplyToken = (res: Response) => (token: string) => void;
const replyToken: ReplyToken = (res) => (token) => res.json({
  meta: {},
  data: {
    token: token,
  },
});

type ReplyJwtPayload = (res: Response) => (payload: jwt.JwtPayload) => void;
const replyJwtPayload: ReplyJwtPayload = (res) => (payload) => {
  res.set({
    'X-Username': payload.username,
    'X-iat': payload.iat,
  });
  res.send();
}

const validateCredentials = (username: string, password: string): Either<Error, string> => {
  // const isValid: boolean = authenticate(username, password)
  // use monad!
  const isValid: boolean = username === "username" && password === "password" ? true : false;
  return isValid ? right(encoder(username)) : left(new Error("bad credentials"))
}

const validateAuthorizationHeader = (authorizationHeader: string): Either<Error, jwt.JwtPayload> => {
  // Check if the Authorization header is missing
  if (!authorizationHeader) {
    return left(new Error('Authorization header missing'));
  }

  // Check if the Authorization header starts with 'Bearer '
  if (!authorizationHeader.startsWith('Bearer ')) {
    return left(new Error('Bearer token missing'));
  }

  const token = authorizationHeader.split(' ')[1]; // Extract the token part from the Authorization header
  console.log('pass validate');
  return decoder(token);
}

export const handleEncode = (req: Request, res: Response): void => {
  const { username, password } = req.body;
  match(replyUnauthorized(res), replyToken(res))(validateCredentials(username, password));
}

export const handleDecode = (req: Request, res: Response): void => {
  try {
    console.log('hello');
    const authorizationHeader = req.header('Authorization');

    match(replyUnauthorized(res), replyJwtPayload(res))(validateAuthorizationHeader(authorizationHeader));
  } catch (error) {
    // Handle other errors, if any
    console.error('An error occurred:', error);
    res.status(500).send('Internal server error');
  }
}

// Side Effects: The replyUnauthorized and replyToken functions have side effects. They directly modify the response object (res) within the function.

// Conditional Statements: In your validateCredentials function, you have a conditional statement (if...else) that is used to determine the validity of the credentials. Functional programming usually encourages pattern matching or the use of monads for such cases.