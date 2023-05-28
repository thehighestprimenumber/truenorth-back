import {FieldValue} from "firebase-admin/firestore";

export const PATH = "record";

export interface Record {
    userId: string,
    operationId: string,
    amount: number
    userBalance: number,
    operationResponse: string | number,
    date: Date,
    isActive: boolean
}


export type RecordDTO = Omit<Record, "date"> & {
    date: FieldValue
}

