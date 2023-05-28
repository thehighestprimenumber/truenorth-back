import {getFirestore} from "firebase-admin/firestore";
import {applicationDefault, initializeApp} from "firebase-admin/app";

export const getDocument = async (path: string, id: string) => {
    const ref = db.collection(path).doc(id);
    const g = await ref.get();
    return g.data();
};

initializeApp({credential: applicationDefault()});
export const db = getFirestore();
