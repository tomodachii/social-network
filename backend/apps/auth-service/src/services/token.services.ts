import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { match, Either, right, left } from 'fp-ts/lib/Either';
import {
  TokenMaker,
  VerifyFunction,
  TokenDecoder,
  ReplyUnauthorized,
  ReplyToken,
  ReplyJwtPayload,
} from './token.type';
import { passwordValidator, PasswordValidator } from './password.services';
import { PrismaClient, AuthRecord } from '@prisma/client/auth';

const prisma = new PrismaClient();

const privateKey = 'abcd';

const tokenMaker: TokenMaker = (privateKey, signFunction) => (userId) =>
  signFunction({ userId: userId }, privateKey);

const tokenDecoder: TokenDecoder =
  (privateKey: string, verifyFunction: VerifyFunction) => (token: string) => {
    let result: Either<Error, jwt.JwtPayload>;
    verifyFunction(token, privateKey, (err, decoded: jwt.JwtPayload) => {
      if (err) {
        // console.error('JWT verification failed:', err);
        result = left(new Error('JWT verification failed: ' + err));
      } else {
        // console.log(decoded.email);
        result = right(decoded);
      }
    });
    console.log(result);
    return result;
  };

export const encoder = tokenMaker(privateKey, jwt.sign);
const decoder = tokenDecoder(privateKey, jwt.verify);

const replyUnauthorized: ReplyUnauthorized = (res) => (error) =>
  res.status(401).send('Authentication failed');

const replyToken: ReplyToken = (res) => (token) =>
  res.json({
    meta: {
      message: 'Success',
      serviceId: 'auth-service',
      status: 200,
      isSuccess: true,
      extraMeta: {},
    },
    data: {
      token: token,
    },
  });

const replyJwtPayload: ReplyJwtPayload = (res) => (payload) => {
  res.set({
    'X-UserId': payload.userId,
    'X-iat': payload.iat,
  });
  res.send();
};

const validateCredentials = (
  user: AuthRecord,
  password: string,
): Either<Error, string> => {
  // const isValid: boolean = authenticate(email, password)
  // use monad!
  const hashedPassword = user.password;
  const salt = user.salt;
  const isValid = passwordValidator(password, salt, hashedPassword);
  // const isValid: boolean = email === "email" && password === "password" ? true : false;
  return isValid ? right(encoder(user.id)) : left(new Error('bad credentials'));
};

const validateAuthorizationHeader = (
  authorizationHeader: string
): Either<Error, jwt.JwtPayload> => {
  // Check if the Authorization header is missing
  if (!authorizationHeader) {
    return left(new Error('Authorization header missing'));
  }

  // Check if the Authorization header starts with 'Bearer '
  if (!authorizationHeader.startsWith('Bearer ')) {
    return left(new Error('Bearer token missing'));
  }

  const token = authorizationHeader.split(' ')[1]; // Extract the token part from the Authorization header
  return decoder(token);
};

export const handleEncode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  // query db -> hashedPassword, salt
  const user = await prisma.authRecord.findUnique({
    where: {
      email,
    },
  });
  match(
    replyUnauthorized(res),
    replyToken(res)
  )(validateCredentials(user, password));
};

export const handleDecode = (req: Request, res: Response): void => {
  try {
    const authorizationHeader = req.header('Authorization');

    match(
      replyUnauthorized(res),
      replyJwtPayload(res)
    )(validateAuthorizationHeader(authorizationHeader));
  } catch (error) {
    // Handle other errors, if any
    console.error('An error occurred:', error);
    res.status(500).send('Internal server error');
  }
};

// Side Effects: The replyUnauthorized and replyToken functions have side effects. They directly modify the response object (res) within the function.

// Conditional Statements: In your validateCredentials function, you have a conditional statement (if...else) that is used to determine the validity of the credentials. Functional programming usually encourages pattern matching or the use of monads for such cases.
