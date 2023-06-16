import {OperationRequest, OperationType} from "../shared/Operation";
import * as operations from "./index";
import * as helpers from "./helpers";
import * as validators from "../validators";
import * as validatorHelpers from "../validatorHelpers";
import {doOperation} from "./index";

const {describe, expect, it, beforeAll} = require("@jest/globals");
const {jest: requiredJest} = require("@jest/globals");

describe("operations", () => {
    describe("performOperationInTransaction", () => {
        const userId = "userId";
        let insertRecordSpy: any;
        const operation = {
            cost: 1, type: OperationType.addition,
        };
        beforeAll(async () => {
            requiredJest.spyOn(helpers, "getOperationDocument").mockImplementation(() => {
                return operation;
            });
            requiredJest.spyOn(validatorHelpers, "getUserBalance").mockImplementation(() => 5);
            // @ts-ignore
            requiredJest.spyOn(helpers, "updateUserBalance").mockImplementation((userId, balance, cost) => {
                return balance - cost;
            });
            // @ts-ignore
            insertRecordSpy = requiredJest.spyOn(helpers, "insertRecord").mockImplementation((record) => record);
        });


        it("works correctly when there is enough balance", async () => {
            const data: OperationRequest = {
                operationId: OperationType.addition, operand1: 1, operand2: 2,
            };
            const context = {auth: {uid: "userId"}};
            const transaction = {};
            // @ts-ignore
            const result = await operations.performOperationInTransaction(data, context, transaction);
            expect(result).toEqual({
                amount: 1, isActive: true, operationId: "addition", operationResponse: 3, userBalance: 4, userId,
            });
            expect(insertRecordSpy).toBeCalledWith({
                userId,
                operationId: operation.type,
                amount: operation.cost,
                isActive: true,
                operationResponse: 3,
                userBalance: 4,
            }, transaction);
        });
        it("throws error when there is not enough balance", async () => {
            requiredJest.spyOn(validatorHelpers, "getUserBalance").mockImplementation(() => 0);

            const context = {auth: {uid: "userId"}};

            // @ts-ignore
            const result = validators.validateOperationBalance(context, {cost: 10});
            await expect(async () => await result).rejects.toThrowErrorMatchingInlineSnapshot("\"You do not have enough balance to run this operation\"");
        });
    });

    // TODO I would normally add tests for each of the defined functions
    describe("doOperation", () => {
        it("works correctly - power", async () => {
            expect(await doOperation(OperationType.power, 2, 3)).toEqual({isValid: true, result: 8});
        });

        it("works correctly - randomString", async () => {
            const {isValid, result} = await doOperation(OperationType.randomString);
            expect(isValid).toBeTruthy();
            expect(typeof result).toBe("string");
            const DEFAULT_RANDOM_STRING_LENGTH = 11;
            expect((result as string).length).toBe(DEFAULT_RANDOM_STRING_LENGTH);
        });

        it("works correctly - squareRoot", async () => {
            expect(await doOperation(OperationType.squareRoot, 4)).toEqual({isValid: true, result: 2});
        });

        it("validates correctly", async () => {
            expect(await doOperation(OperationType.power, 2, null)).toEqual({
                isValid: false, errorMessage: "you must provide two numbers for this operation",
            });
        });
    });
});
