import express from 'express';
import { body, validationResult } from 'express-validator';
import { getAuth, getDb, getFieldValue } from '../config/firebase.js';

const router = express.Router();

// Register user
// router.post('/register', [
//   body('email').isEmail(),
//   body('password').isLength({ min: 6 })
// ], async (req, res) => {
//   try {
//     const db = getDb();
//     const auth = getAuth();
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password, displayName } = req.body;

//     const userRecord = await auth.createUser({
//       email,
//       password,
//       displayName
//     });

//     // Create user document in Firestore
//     await db.collection('users').doc(userRecord.uid).set({
//       email,
//       displayName: displayName || email.split('@')[0],
//       plan: 'none',
//        createdAt: getFieldValue().serverTimestamp(),
//   updatedAt: getFieldValue().serverTimestamp()
//     });

//     res.status(201).json({
//       message: 'User created successfully',
//       uid: userRecord.uid
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(400).json({ error: error.message });
//   }
// });

// Get user profile
router.get('/profile/:uid', async (req, res) => {
  try {
    const db = getDb();
    const { uid } = req.params;
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router;