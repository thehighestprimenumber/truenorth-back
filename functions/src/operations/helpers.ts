import {db} from "../firestoreDB";
import {PATH as userPath} from "../shared/User";
import {Operation, PATH as operationPath} from "../shared/Operation";
import {PATH as recordPath, RecordDTO} from "../shared/Record";
import {FieldValue} from "firebase-admin/firestore";
import * as functions from "firebase-functions";

export async function updateUserBalance(userId: string, balance: number, cost: number, transaction: FirebaseFirestore.Transaction) {
    const userRef = db.doc(`${userPath}/${userId}`);
    const newBalance = balance - cost;
    await transaction.update(userRef, {balance: newBalance});
    return newBalance;
}

export async function insertRecord(record: RecordDTO, transaction: FirebaseFirestore.Transaction) {
    record.date = FieldValue.serverTimestamp();
    const recordRef = db.collection(recordPath);
    await transaction.create(recordRef.doc(), record);
    return record.operationResponse;
}

export async function getOperationDocument(transaction: FirebaseFirestore.Transaction, operationId: string) {
    try {
        const operationDocumentSnapshot = await transaction.get(db.doc(`${operationPath}/${operationId}`));
        return operationDocumentSnapshot.data() as Operation;
    } catch (e) {
        throw new functions.https.HttpsError("invalid-argument", `Operation #${operationId} not found`);
    }
}
