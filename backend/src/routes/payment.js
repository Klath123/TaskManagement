import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {instance} from '../index.js';
import { getDb, getFieldValue } from '../config/firebase.js';
import crypto from 'crypto';
const router = express.Router();

router.use(authenticateToken);

router.post('/process',async (req, res)=>{
    try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: Number(amount * 100), // amount in paise
      currency: 'INR',
      payment_capture: 1
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
})

router.get('/getKey',async (req, res)=>{
   res.status(200).json({key: process.env.RAZORPAY_KEY_ID});
})

router.post('/verification',async (req, res)=>{
  try{
    const userId = req.user.uid;
   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
   const body = razorpay_order_id + '|' + razorpay_payment_id;
   const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                    .update(body.toString())
                                    .digest('hex');
     if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
    }

    // Step 2: Update user plan in Firestore
    const db = getDb();
    const userRef = db.collection('users').doc(userId);

    await userRef.update({
      plan: {
        price: plan.price,
        duration: plan.duration,
        status: 'active',
        startDate: getFieldValue().serverTimestamp()
      }
    });

    // Step 3: Return success response
    res.status(200).json({
      status: 'success',
      reference: razorpay_payment_id
    });
}
catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
    
})

export default router;