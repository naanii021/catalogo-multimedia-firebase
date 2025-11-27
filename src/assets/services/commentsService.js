import { collection, addDoc, getDocs, doc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase.js';
import { createComment } from '../models.js';

const COMMENTS_COLLECTION = 'comments';

// Obtener comentarios de un ítem
export const getCommentsByItemId = async (itemId) => {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where('itemId', '==', itemId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Crear un nuevo comentario
export const createCommentDoc = async (commentData) => {
  try {
    const comment = createComment(commentData);
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), comment);
    return { id: docRef.id, ...comment };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Eliminar un comentario
export const deleteComment = async (id) => {
  try {
    await deleteDoc(doc(db, COMMENTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};