import express from 'express';
import JWTMiddleware from '../middlewares/jwt-middleware.ts';

const router = express.Router()

router.get('/:id/outcomes',JWTMiddleware, )
router.post('/:id/outcomes',JWTMiddleware, )
router.delete('/:id/outcomes/:outcomeId',JWTMiddleware, )

export default router