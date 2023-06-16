import {OperationType} from "../shared/Operation";
import * as functions from "firebase-functions";
import {getRandomStringFromAPI} from "../thirdParties/random";

const isNumber = (a: unknown) => typeof a === "number";
const bothAreNumbers = (a: unknown, b: unknown) => {
    const isValid = isNumber(a) && isNumber(b);
    return {isValid, errorMessage: "you must provide two numbers for this operation"};
};
const singleNumber = (a: unknown, b: unknown) => {
    const {isValid: twoNumbers} = bothAreNumbers(a, b);
    const atLeastOneNumber = isNumber(a) || isNumber(b);
    const isValid = atLeastOneNumber && !twoNumbers;
    return {isValid, errorMessage: "you must provide a single number for this operation"};
};
const noNumber = (a: unknown, b: unknown) => {
    const isValid = !(a || b);
    return {isValid, errorMessage: "this function accepts no parameters. please clear the number fields and try again"};
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
    [OperationType.division]: {validation: bothAreNumbers, calculation: (a: number, b: number) => a / b},
    [OperationType.multiplication]: {validation: bothAreNumbers, calculation: (a: number, b: number) => a * b},
    [OperationType.power]: {validation: bothAreNumbers, calculation: (a: number, b: number) => a ** b},
    [OperationType.squareRoot]: {validation: singleNumber, calculation: (a: number) => Math.sqrt(a)},
    [OperationType.randomString]: {validation: noNumber, calculation: () => getRandomString()},
};

export default operationDefinitions;
