import {OperationType} from "../shared/Operation";
import * as functions from "firebase-functions";
import {getRandomStringFromAPI} from "../thirdParties/random";

export const ERROR_DIVISION_BY_ZERO = "division by 0 is not defined";
export const ERROR_TWO_NUMBERS_REQUIRED = "you must provide two numbers for this operation";
export const ERROR_SINGLE_NUMBER_REQUIRED = "you must provide a single number for this operation";
export const ERROR_NO_NUMBER_ACCEPTED = "this function accepts no parameters. please clear the number fields and try again";

const isNumber = (a: unknown) => typeof a === "number";

const twoNumbersAndNonZeroDivisor = (dividend: unknown, divisor: unknown) => {
    const isValid = bothAreNumbers(dividend, divisor) && divisor !== 0;
    return {isValid, errorMessage: ERROR_DIVISION_BY_ZERO};
};

const bothAreNumbers = (a: unknown, b: unknown) => {
    const isValid = isNumber(a) && isNumber(b);
    return {isValid, errorMessage: ERROR_TWO_NUMBERS_REQUIRED};
};

const singleNumber = (a: unknown, b: unknown) => {
    const {isValid: twoNumbers} = bothAreNumbers(a, b);
    const atLeastOneNumber = isNumber(a) || isNumber(b);
    const isValid = atLeastOneNumber && !twoNumbers;
    return {isValid, errorMessage: ERROR_SINGLE_NUMBER_REQUIRED};
};

const noNumber = (a: unknown, b: unknown) => {
    const isValid = !(a || b);
    return {isValid, errorMessage: ERROR_NO_NUMBER_ACCEPTED};
};

const getRandomString = async () => {
    try {
        return getRandomStringFromAPI();
    } catch (e) {
        console.error(e);
        throw new functions.https.HttpsError("internal", "An error occurred trying to get a random string");
    }
};

const operationDefinitions = {
    [OperationType.addition]: {validation: bothAreNumbers, calculation: (a: number, b: number) => a + b},
    [OperationType.subtraction]: {validation: bothAreNumbers, calculation: (a: number, b: number) => a - b},
    [OperationType.division]: {validation: twoNumbersAndNonZeroDivisor, calculation: (a: number, b: number) => a / b},
    [OperationType.multiplication]: {validation: bothAreNumbers, calculation: (a: number, b: number) => a * b},
    [OperationType.power]: {validation: bothAreNumbers, calculation: (a: number, b: number) => a ** b},
    [OperationType.squareRoot]: {validation: singleNumber, calculation: (a: number) => Math.sqrt(a)},
    [OperationType.randomString]: {validation: noNumber, calculation: () => getRandomString()},
};

export default operationDefinitions;
