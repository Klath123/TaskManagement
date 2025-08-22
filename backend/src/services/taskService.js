import { db } from "../config/firebase.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const taskRef = collection(db, "tasks");

export const getUserTasks = async (uid) => {
  const q = query(taskRef, where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const createTask = async (uid, task) => {
  return await addDoc(taskRef, { ...task, uid, status: "Pending", createdAt: new Date() });
};

export const updateTask = async (id, updates) => {
  return await updateDoc(doc(db, "tasks", id), updates);
};

export const deleteTask = async (id) => {
  return await deleteDoc(doc(db, "tasks", id));
};
