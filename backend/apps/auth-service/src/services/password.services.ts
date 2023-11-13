import crypto from 'crypto';

type RandomBytesFunction = (size: number) => Buffer;
type GenerateSaltMaker = (randomBytesFunction: RandomBytesFunction) => (size: number) => string;
const generateSaltMaker: GenerateSaltMaker = (randomBytesFunction) => (size) => randomBytesFunction(size).toString("hex");
export const generateSalt = generateSaltMaker(crypto.randomBytes);
// this violates fp rules but the whole idea of random kinda violates the rules already
export const generateSalt16 = () => generateSalt(16);
// 16
// console.log(genrateSalt(16));
// console.log(typeof genrateSalt(16));

type ScryptSyncFunction = (password: crypto.BinaryLike, salt: crypto.BinaryLike, keylen: number, options?: crypto.ScryptOptions) => Buffer;
type HashMaker = (scryptSyncFunction: ScryptSyncFunction) => (password: string, salt: string) => string;
const hashMaker: HashMaker = (scryptSyncFunction) => (password, salt) => scryptSyncFunction(password, salt, 64).toString("hex");
export const hash = hashMaker(crypto.scryptSync);

type HashFunction = (password: string, salt: string) => string;
type PasswordValidatorMaker = (hashFunction: HashFunction) => (password: string, salt: string, hashedPassword: string) => boolean;
const passwordValidatorMaker: PasswordValidatorMaker = (hashFunction) => (password, salt, hashedPassword) => hashFunction(password, salt) === hashedPassword;
export type PasswordValidator = (password: string, salt: string, hashedPassword: string) => boolean;
export const passwordValidator = passwordValidatorMaker(hash);