import firebaseapp from "./";
import { getFirestore, collection } from 'firebase/firestore';

export const db = getFirestore(firebaseapp);

//reference to collection
export const chatColRef = collection(db, 'chats');

// references to messages
export const messagesColRef = collection(db, 'chat_messages');