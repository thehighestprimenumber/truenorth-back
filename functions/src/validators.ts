import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/common/providers/https";
import {Operation} from "./shared/Operation";
import {getUserBalance} from "./validatorHelpers";

export function validateUserIsLoggedIn(context: { auth?: { uid: string } }) {
    if (!context.auth || !context.auth.uid) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called with a logged in user");
    }
}

export const validateOperationBalance = async (context: CallableContext, operation: Operation) => {
    await validateUserIsLoggedIn(context);
    const userId = context?.auth?.uid;
    if (userId) {
        const balance = await getUserBalance(userId);
        if (balance < operation.cost) {
            throw new functions.https.HttpsError("failed-precondition", "You do not have enough balance to run this operation");
        }
        return {userId, balance};
    }
    throw new functions.https.HttpsError("unauthenticated", "Please log in to perform calculation");
};
