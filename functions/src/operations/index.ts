import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/common/providers/https";
import {db} from "../firestoreDB";
import {RecordDTO} from "../shared/Record";
import {OperationRequest, OperationType} from "../shared/Operation";
import {validateOperationBalance} from "../validators";
import {getOperationDocument, insertRecord, updateUserBalance} from "./helpers";
import operationDefinitions from "./operationDefinitions";


export async function doOperation(type: OperationType, operand1: unknown, operand2: unknown) {
    const operation = operationDefinitions[type];
    const {isValid, errorMessage} = operation.validation(operand1, operand2);
    if (!isValid) {
        return {isValid, errorMessage};
    }
    const result = await operation.calculation(operand1 as number, operand2 as number);
    return {isValid, result};
}

export async function performOperationInTransaction(data: OperationRequest, context: CallableContext, transaction: FirebaseFirestore.Transaction) {
    function prepareRecord() {
        const record: Partial<RecordDTO> = {
            userId, operationId, amount: operationDocument.cost, isActive: true,
        };
        if (isValid) {
            record.operationResponse = result;
            record.userBalance = newBalance;
        } else {
            record.operationResponse = errorMessage;
            record.userBalance = balance;
            record.amount = 0;
        }
        return <RecordDTO>record;
    }

    const {operand1, operand2, operationId} = data;
    const operationDocument = await getOperationDocument(transaction, operationId);
    const {userId, balance} = await validateOperationBalance(context, operationDocument);
    const {isValid, errorMessage, result} = await doOperation(operationDocument.type, operand1, operand2);
    let newBalance: number;
    if (isValid) {
        newBalance = await updateUserBalance(userId, balance, operationDocument.cost, transaction);
    } else {
        newBalance = balance;
    }


    const record = prepareRecord();

    return insertRecord(record, transaction);
}

export async function doPerformOperation(data: OperationRequest, context: CallableContext) {
    return await db.runTransaction(async (transaction) => {
        return performOperationInTransaction(data, context, transaction);
    });
}

export const performOperation = functions.https.onCall(async (data: OperationRequest, context: CallableContext) => {
    return doPerformOperation(data, context);
});
