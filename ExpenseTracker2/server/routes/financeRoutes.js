import express from 'express';
import { financeDefault, financeTransaction, financeTransactionDelete, sbiBal, goals, salaryRoutine, sync, reset } from '../controllers/financeControllers.js';

const router = express.Router();


// GET /api/finance - Retrieve user's full financial state
router.get('/', financeDefault);

// POST /api/finance/transaction - Add transaction and update balance/goals atomically
router.post('/transaction', financeTransaction);

// DELETE /api/finance/transaction/:id - Delete transaction and reverse balance/goals
router.delete('/transaction/:id', financeTransactionDelete);

// PUT /api/finance/sbi-balance - Update SBI balance
router.put('/sbi-balance', sbiBal);

// PUT /api/finance/goals - Update goals
router.put('/goals', goals);

// PUT /api/finance/salary-routine - Update checklist or execute routine
router.put('/salary-routine', salaryRoutine);

// POST /api/finance/sync - Full state sync or JSON backup restore
router.post('/sync', sync);

// POST /api/finance/reset - Reset to default state
router.post('/reset', reset);

export default router;
