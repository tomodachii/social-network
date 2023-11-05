import { Router } from 'express';
import { handleEncode } from '../controllers/token.controller';

const router = Router();

router.post('/', handleEncode);

export default router;
