import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { match, Either, right, left } from "fp-ts/lib/Either"


export type SignFunction = (payload: string | Buffer | object, secretOrPrivateKey: jwt.Secret) => string;

export type TokenMaker = (privateKey: string, signFunction: SignFunction) => (email: string) => string;

export type VerifyFunction = (
  token: string,
  secretOrPublicKey: jwt.Secret | jwt.GetPublicKeyOrSecret,
  callback?: jwt.VerifyCallback<jwt.JwtPayload>,
) => void;

export type TokenDecoder = (privateKey: string, verifyFunction: Function) => (token: string) => Either<Error, jwt.JwtPayload>;

export type ReplyUnauthorized = (res: Response) => (error: Error) => void;

export type ReplyToken = (res: Response) => (token: string) => void;

export type ReplyJwtPayload = (res: Response) => (payload: jwt.JwtPayload) => void;
