import { Router } from 'express';
import { handleDecode } from '../controllers/token.controller';

const router = Router();

router.get('/', handleDecode);

export default router;
