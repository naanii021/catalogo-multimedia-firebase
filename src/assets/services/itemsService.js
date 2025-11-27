import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase.js';
import { createItem } from '../models.js';

const ITEMS_COLLECTION = 'items';

// Obtener todos los ítems
export const getItems = async () => {
  try {
    const q = query(collection(db, ITEMS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id });
    });
    return items;
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

// Obtener un ítem por ID
export const getItemById = async (id) => {
  try {
    const docRef = doc(db, ITEMS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {  ...docSnap.data(), id: docSnap.id };
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error('Error getting item:', error);
    throw error;
  }
};

// Crear un nuevo ítem
export const createItemDoc = async (itemData) => {
  try {
    const item = createItem(itemData.type, itemData);
    const docRef = await addDoc(collection(db, ITEMS_COLLECTION), item);
    return {...item, id: docRef.id };
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

// Actualizar un ítem
export const updateItem = async (id, itemData) => {
  try {
    const docRef = doc(db, ITEMS_COLLECTION, id);
    const updatedData = {
      ...itemData,
      updatedAt: new Date()
    };
    await updateDoc(docRef, updatedData);
    return { ...updatedData, id };
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

// Eliminar un ítem
export const deleteItem = async (id) => {
  try {
    await deleteDoc(doc(db, ITEMS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};