export const PATH = 'operation'

export enum OperationType {
    addition = "addition",
    subtraction = "subtraction",
    multiplication = "multiplication",
    division = "division",
    squareRoot = "square_root",
    power = "power",
    randomString = "random_string",
}

export interface Operation {
    id: string;
    type: OperationType,
    cost: number,
}

export interface OperationRequest {
    operationId: string;
    operand1?: number;
    operand2?: number;
}