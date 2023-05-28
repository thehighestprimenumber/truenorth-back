import {PATH as userPath, User} from "./shared/User";
import {getDocument} from "./firestoreDB";

export async function getUserBalance(userId: string) {
    return (<User>(await getDocument(userPath, userId))).balance;
}
