import mongoose from 'mongoose';
import { Finance } from '../models/Finance.js';
import { getDefaultState } from '../defaultData.js';

const USER_ID = 'default_user';

// Helper: Ensure a record exists in MongoDB
async function getOrCreateFinance() {
    let doc = await Finance.findOne({ userId: USER_ID });
    if (!doc) {
        const defaultData = getDefaultState();
        doc = await Finance.create(defaultData);
    }
    return doc;
}

// Check if Mongo is connected
function isMongoConnected() {
    return mongoose.connection.readyState === 1;
}


//GET
const financeDefault = async (req, res) => {
    if (!isMongoConnected()) {
        return res.status(503).json({ error: 'MongoDB Atlas is not connected', offline: true });
    }

    try {
        const doc = await getOrCreateFinance();
        res.json(doc);
    } catch (error) {
        console.error('Error fetching finance document:', error);
        res.status(500).json({ error: 'Failed to fetch financial data' });
    }
}

// POST
const financeTransaction = async (req, res) => {
    if (!isMongoConnected()) {
        return res.status(503).json({ error: 'MongoDB Atlas is not connected', offline: true });
    }

    try {
        const { transaction } = req.body;
        if (!transaction || !transaction.amount || transaction.amount <= 0) {
            return res.status(400).json({ error: 'Invalid transaction payload' });
        }

        const doc = await getOrCreateFinance();
        const amount = Number(transaction.amount);

        // Apply balance and goal changes
        if (transaction.type === 'expense') {
            if (transaction.account === 'SBI') {
                doc.sbiBalance = Math.max(0, doc.sbiBalance - amount);
            } else if (transaction.goalId) {
                doc.goals = doc.goals.map((g) =>
                    g.id === transaction.goalId ? { ...g.toObject(), saved: Math.max(0, g.saved - amount) } : g
                );
            }
        } else if (transaction.type === 'goal_withdrawal') {
            doc.goals = doc.goals.map((g) =>
                g.id === transaction.goalId ? { ...g.toObject(), saved: Math.max(0, g.saved - amount) } : g
            );
        } else if (transaction.type === 'income') {
            doc.sbiBalance = doc.sbiBalance + amount;
        } else if (transaction.type === 'goal_deposit') {
            doc.goals = doc.goals.map((g) =>
                g.id === transaction.goalId ? { ...g.toObject(), saved: g.saved + amount } : g
            );
            if (transaction.deductFromSbi) {
                doc.sbiBalance = Math.max(0, doc.sbiBalance - amount);
            }
        }

        // Prepend new transaction
        doc.transactions.unshift(transaction);
        await doc.save();

        res.status(201).json(doc);
    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).json({ error: 'Failed to record transaction' });
    }
}

// DELETE
const financeTransactionDelete = async (req, res) => {
    if (!isMongoConnected()) {
        return res.status(503).json({ error: 'MongoDB Atlas is not connected', offline: true });
    }

    try {
        const { id } = req.params;
        const doc = await getOrCreateFinance();

        const targetTx = doc.transactions.find((t) => t.id === id);
        if (!targetTx) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const amt = Number(targetTx.amount || 0);

        if (targetTx.type === 'expense') {
            if (targetTx.account === 'SBI') {
                doc.sbiBalance = doc.sbiBalance + amt;
            } else if (targetTx.goalId) {
                doc.goals = doc.goals.map((g) =>
                    g.id === targetTx.goalId ? { ...g.toObject(), saved: g.saved + amt } : g
                );
            }
        } else if (targetTx.type === 'goal_withdrawal') {
            doc.goals = doc.goals.map((g) =>
                g.id === targetTx.goalId ? { ...g.toObject(), saved: g.saved + amt } : g
            );
        } else if (targetTx.type === 'income') {
            doc.sbiBalance = Math.max(0, doc.sbiBalance - amt);
        } else if (targetTx.type === 'goal_deposit') {
            doc.goals = doc.goals.map((g) =>
                g.id === targetTx.goalId ? { ...g.toObject(), saved: Math.max(0, g.saved - amt) } : g
            );
            if (targetTx.deductFromSbi) {
                doc.sbiBalance = doc.sbiBalance + amt;
            }
        }

        doc.transactions = doc.transactions.filter((t) => t.id !== id);
        await doc.save();

        res.json(doc);
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
}

// PUT
const sbiBal = async (req, res) => {
    if (!isMongoConnected()) {
        return res.status(503).json({ error: 'MongoDB Atlas is not connected', offline: true });
    }

    try {
        const { sbiBalance } = req.body;
        const doc = await getOrCreateFinance();
        doc.sbiBalance = Math.max(0, Number(sbiBalance) || 0);
        await doc.save();
        res.json(doc);
    } catch (error) {
        console.error('Error updating SBI balance:', error);
        res.status(500).json({ error: 'Failed to update balance' });
    }
}

// PUT
const goals = async (req, res) => {
    if (!isMongoConnected()) {
        return res.status(503).json({ error: 'MongoDB Atlas is not connected', offline: true });
    }

    try {
        const { goals } = req.body;
        if (!Array.isArray(goals)) {
            return res.status(400).json({ error: 'Goals must be an array' });
        }

        const doc = await getOrCreateFinance();
        doc.goals = goals;
        await doc.save();
        res.json(doc);
    } catch (error) {
        console.error('Error updating goals:', error);
        res.status(500).json({ error: 'Failed to update goals' });
    }
}

// PUT
const salaryRoutine = async (req, res) => {
    if (!isMongoConnected()) {
        return res.status(503).json({ error: 'MongoDB Atlas is not connected', offline: true });
    }

    try {
        const { month, checklist, routineData } = req.body;
        const doc = await getOrCreateFinance();

        if (routineData) {
            // Full routine execution
            doc.sbiBalance = Number(routineData.sbiBalance);
            doc.goals = routineData.goals;
            doc.transactions = routineData.transactions;
            if (!doc.salaryRoutineByMonth) doc.salaryRoutineByMonth = new Map();
            doc.salaryRoutineByMonth.set(month, routineData.checklist);
        } else if (checklist) {
            // Single checklist toggle
            if (!doc.salaryRoutineByMonth) doc.salaryRoutineByMonth = new Map();
            doc.salaryRoutineByMonth.set(month, checklist);
        }

        await doc.save();
        res.json(doc);
    } catch (error) {
        console.error('Error updating salary routine:', error);
        res.status(500).json({ error: 'Failed to update salary routine' });
    }
}

// POST
const sync = async (req, res) => {
    if (!isMongoConnected()) {
        return res.status(503).json({ error: 'MongoDB Atlas is not connected', offline: true });
    }

    try {
        const state = req.body;
        if (!state || typeof state.sbiBalance !== 'number' || !Array.isArray(state.goals)) {
            return res.status(400).json({ error: 'Invalid state structure' });
        }

        const updated = await Finance.findOneAndUpdate(
            { userId: USER_ID },
            {
                profile: state.profile,
                sbiBalance: state.sbiBalance,
                goals: state.goals,
                transactions: state.transactions || [],
                salaryRoutineByMonth: state.salaryRoutineByMonth || {},
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json(updated);
    } catch (error) {
        console.error('Error syncing finance state:', error);
        res.status(500).json({ error: 'Failed to sync finance state' });
    }
}

// POST
const reset = async (req, res) => {
    if (!isMongoConnected()) {
        return res.status(503).json({ error: 'MongoDB Atlas is not connected', offline: true });
    }

    try {
        const defaultData = getDefaultState();
        const doc = await Finance.findOneAndUpdate(
            { userId: USER_ID },
            defaultData,
            { upsert: true, new: true }
        );
        res.json(doc);
    } catch (error) {
        console.error('Error resetting finance data:', error);
        res.status(500).json({ error: 'Failed to reset data' });
    }
}

export { financeDefault, financeTransaction, financeTransactionDelete, sbiBal, goals, salaryRoutine, sync, reset }; 