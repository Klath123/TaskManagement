import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDb, getFieldValue } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Get all tasks for user
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { status, sortBy = 'dueDate', order = 'asc' } = req.query;
    const userId = req.user.uid;

    let query = db.collection('tasks').where('userId', '==', userId);

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.orderBy(sortBy, order).get();
    const tasks = [];

    snapshot.forEach(doc => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dueDate: doc.data().dueDate
      });
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create new task
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('dueDate').isISO8601(),
  body('status').optional().isIn(['pending', 'completed'])
], async (req, res) => {
  try {
    const db = getDb();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate, status = 'pending' } = req.body;
    const userId = req.user.uid;

    const taskData = {
      title,
      description: description || '',
      dueDate,
      status,
      userId,
        createdAt: getFieldValue().serverTimestamp(),
  updatedAt: getFieldValue().serverTimestamp()
    };

    const docRef = await db.collection('tasks').add(taskData);
    const newDoc = await docRef.get();

    res.status(201).json({
      id: docRef.id,
      ...newDoc.data(),
      createdAt: newDoc.data().createdAt?.toDate(),
      updatedAt: newDoc.data().updatedAt?.toDate()
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('dueDate').optional().isISO8601(),
  body('status').optional().isIn(['pending', 'completed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user.uid;
    const updates = req.body;

    const taskRef = db.collection('tasks').doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (taskDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateData = {
      ...updates,
     updatedAt: getFieldValue().serverTimestamp()
    };

    await taskRef.update(updateData);
    const updatedDoc = await taskRef.get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data().createdAt?.toDate(),
      updatedAt: updatedDoc.data().updatedAt?.toDate()
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const userId = req.user.uid;

    const taskRef = db.collection('tasks').doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (taskDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await taskRef.delete();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Toggle task status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const db = getDb();
    const taskRef = db.collection('tasks').doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (taskDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const currentStatus = taskDoc.data().status;
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    await taskRef.update({
      status: newStatus,
      updatedAt: getFieldValue().serverTimestamp()
    });

    const updatedDoc = await taskRef.get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data().createdAt?.toDate(),
      updatedAt: updatedDoc.data().updatedAt?.toDate()
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ error: 'Failed to toggle task status' });
  }
});

export default router;