import { Router } from 'express';
import { handleDecode } from '../services/token.services';

const router = Router();

router.get('/', handleDecode);

export default router;
