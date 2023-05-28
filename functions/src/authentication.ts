import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/common/providers/https";
import {db} from "./firestoreDB";
import {UserStatus, PATH as userPath} from "./shared/User";
import {validateUserIsLoggedIn} from "./validators";


// eslint-disable-next-line max-len
export const createUserInDB = functions.https.onCall(async (data: { email: string }, context: CallableContext) => {
    const {email} = data;
    validateUserIsLoggedIn(context);
    const ref = db.collection(userPath).doc(<string>context?.auth?.uid);
    await ref.set({email, balance: 10, status: UserStatus.ACTIVE});
});
