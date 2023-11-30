import { Router } from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client/auth';
import { encoder } from '../services/token.services';
import { hash, generateSalt16 } from '../services/password.services';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  // Create new credentials and save to database
  const { id, email, password, phoneNumber } = req.body;
  const salt = generateSalt16();
  const hashedPassword = hash(password, salt);
  const auth = await prisma.authRecord.create({
    data: {
      id,
      email,
      password: hashedPassword,
      phoneNumber,
      salt: salt,
    },
  });
  res.json({
    meta: {
      message: 'Success',
      serviceId: 'auth-service',
      status: 200,
      isSuccess: true,
      extraMeta: {},
    },
    data: {
      id: id,
      token: encoder(email),
      refreshToken: encoder(email),
      expired: 123,
    },
  });
});

export default router;
