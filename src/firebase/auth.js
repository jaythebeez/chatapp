import firebaseapp from "./";
import {  getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    setPersistence, 
    browserLocalPersistence, 
    signOut  } from 'firebase/auth';

export const auth = getAuth(firebaseapp)

export const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}

export const login  = (email, password ) =>{
    return setPersistence(auth, browserLocalPersistence)
    .then(()=>{
        return signInWithEmailAndPassword(auth, email, password);
    })
    .catch(err=> err)
}
export const logout = () => {
    return signOut(auth).then(() => {
        return null
    }).catch((error) => {
        // An error happened.
        return null
    });
}
