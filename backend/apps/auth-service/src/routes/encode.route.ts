import { Router } from 'express';
import { handleEncode } from '../services/token.services';

const router = Router();

router.post('/', handleEncode);

export default router;
