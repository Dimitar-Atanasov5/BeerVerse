import { beforeEach, expect, jest, test } from '@jest/globals';
import { HttpError } from '../../helpers.js'
import { mockUser, mockBcrypt, registerUserService } from "./unitSetup.js";

beforeEach(() => {
    jest.clearAllMocks();
});
describe("RegisterUser service tests", () => {
    test("[KAN-21] User registration with valid data", async () => {
        const body = {
            username: "DimitarDimov",
            password: "Pass1Pass1",
            confirmPassword: "Pass1Pass1",
            firstName: "Ivan",
            lastName: "Ivanov",
            age: "25",
            email: "ivan1@gmail.com"
        };

        mockUser.create.mockResolvedValueOnce({ _id: "1", username: body.username });

        await expect(registerUserService(body)).resolves.toMatchObject({
            status: 201,
            message: "Successful registration",
            user: {
                id: "1",
                username: body.username
            }
        });
    });
    // Desicion table metric.
    test.each([
        [
            { username: "", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["Username is required"]
        ],
        [
            { username: "Vanko1", password: "", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["Password is required"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["Please confirm password"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "ivan123", firstName: "", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["First name is required"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "", age: "25", email: "ivanov11@gmail.com" },
            ["Last name is required"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "", email: "ivanov11@gmail.com" },
            ["Age is required"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "" },
            ["E-mail is required"]
        ],
        [
            { username: "", password: "", confirmPassword: "", firstName: "", lastName: "", age: "", email: "" },
            [
                "Username is required",
                "Password is required",
                "Please confirm password",
                "First name is required",
                "Last name is required",
                "Age is required",
                "E-mail is required"
            ]
        ]
    ])("[KAN-22] Registration fails when required fields are missing", async (body, expectedErrors) => {
        await expect(registerUserService(body)).rejects.toMatchObject({
            status: 400,
            errors: expect.arrayContaining(expectedErrors)
        });
    });
    test.each([
        [
            { username: "Ivan 1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["Fields must not contain spaces (except first and last name)"]
        ],
        [
            { username: "Ivan1", password: "ivan 123", confirmPassword: "ivan 123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["Fields must not contain spaces (except first and last name)"]
        ],
        [
            { username: "Ivan1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "2 5", email: "ivanov11@gmail.com" },
            ["Fields must not contain spaces (except first and last name)"]
        ],
        [
            { username: "Ivan1", password: "ivan 123", confirmPassword: "ivan 123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov 11@gmail.com" },
            ["Fields must not contain spaces (except first and last name)"]
        ]

    ])("[KAN-23] Registration fails when registration inputs contain internal spaces", async (body, expectedErrors) => {
        await expect(registerUserService(body)).rejects.toMatchObject({
            status: 400,
            errors: expect.arrayContaining(expectedErrors)
        });
    });
    // Boundary value analysis metric for age validation
    test.each([
        { ageInput: "17", expectedErrors: ["Age must be between 18 and 99"] },
        { ageInput: "18", expectedErrors: null },
        { ageInput: "99", expectedErrors: null },
        { ageInput: "100", expectedErrors: ["Age must be between 18 and 99"] },
    ])("[KAN-24] Registration age boundary validation", async ({ ageInput, expectedErrors }) => {
        const body = {
            username: "Dimitar77",
            password: "Parola789",
            confirmPassword: "Parola789",
            firstName: "Dimo",
            lastName: "Gerasimov",
            email: "dgerasimov123@gmail.com",
            age: ageInput
        };

        if (expectedErrors) {
            await expect(registerUserService(body)).rejects.toMatchObject({
                status: 400,
                errors: expect.arrayContaining(expectedErrors)
            });
        } else {
            mockUser.create.mockResolvedValueOnce({ _id: "1", username: body.username });
            await expect(registerUserService(body)).resolves.toMatchObject({
                status: 201,
                message: "Successful registration",
                user: {
                    id: "1",
                    username: body.username
                }
            });
        };
    });
    test.each([
        [
            { username: "Ivan123@", password: "Test123", confirmPassword: "Test123", firstName: "Ivan11!", lastName: "P$$etrov", age: "24aa", email: "ivan1@gmailcom" },
            ["First name must contain only letters",
                "Last name must contain only letters",
                "Age must be a number",
                "Invalid e-mail"
            ],
        ]
    ])("[KAN-25] Registration fails for invalid input formats", async (body, expectedErrors) => {
        await expect(registerUserService(body)).rejects.toMatchObject({
            status: 400,
            errors: expect.arrayContaining(expectedErrors)
        });
    });
    test.each([
        { passInput: "Pass1", expectedErrors: ["Password must be between 6 and 12 characters"] },
        { passInput: "Pass12", expectedErrors: null },
        { passInput: "Pass12345678", expectedErrors: null },
        { passInput: "Pass123456789", expectedErrors: ["Password must be between 6 and 12 characters"] }
    ])("[KAN-26] Registration password boundary validation", async ({ passInput, expectedErrors }) => {
        const body = {
            username: "DimitarA1",
            password: passInput,
            confirmPassword: passInput,
            firstName: "Dimo",
            lastName: "Popov",
            email: "Popov12@gmail.com",
            age: "46"
        };

        if (expectedErrors) {
            await expect(registerUserService(body)).rejects.toMatchObject({
                status: 400,
                errors: expect.arrayContaining(expectedErrors)
            });
        } else {
            mockUser.create.mockResolvedValueOnce({ _id: "1", username: body.username });

            await expect(registerUserService(body)).resolves.toMatchObject({
                status: 201,
                message: "Successful registration",
                user: {
                    id: "1",
                    username: body.username
                }
            });
        };
    });
    test("[KAN-27] Registration fails when email already exists", async () => {
        const body = {
            username: "DimitarDimov",
            password: "Pass1Pass1",
            confirmPassword: "Pass1Pass1",
            firstName: "Ivan",
            lastName: "Ivanov",
            age: "25",
            email: "ivan1@gmail.com"
        };

        mockUser.findOne.mockResolvedValueOnce({ _id: "1", email: body.email });

        await expect(registerUserService(body)).rejects.toMatchObject({
            status: 409,
            message: "User already exists"
        });
    });
    test("[KAN-28] Registration returns an error response on server failure", async () => {
        const body = {
            username: "Dimitar22",
            password: "Pass1234",
            confirmPassword: "Pass1234",
            firstName: "Dimitar",
            lastName: "Dimitrov",
            age: "22",
            email: "dimitrov1@gmail.com"
        };

        mockBcrypt.hash.mockRejectedValueOnce(new Error("bcrypt hash failed"))

        await expect(registerUserService(body)).rejects.toMatchObject({
            status: 500,
            message: "Server error"
        });
    });
});





