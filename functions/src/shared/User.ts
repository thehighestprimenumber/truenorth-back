export const PATH = "user";

export enum UserStatus {
    ACTIVE = "active", INACTIVE = "inactive"
}

export interface User {
    email: string;
    uid: string;
    status: UserStatus;
    balance: number;
}

