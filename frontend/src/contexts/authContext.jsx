import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, onSnapshot, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a new user
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (displayName) await updateProfile(user, { displayName });

      await setDoc(doc(db, 'users', user.uid), {
        email,
        displayName: displayName || email.split('@')[0],
        plan: { status: 'none' }, // default plan
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('User created successfully:', user.uid);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Refresh user data manually
  const refreshUser = async () => {
    if (!currentUser?.uid) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) setCurrentUser({ uid: currentUser.uid, ...userDoc.data() });
  };

  const login = async (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = async () => signOut(auth);

  // Listen for auth state AND Firestore document changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUser({ uid: user.uid, ...docSnap.data() });
          }
        });
        setLoading(false);

        // Cleanup Firestore listener when unmount
        return () => unsubscribeDoc();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,
    refreshUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
