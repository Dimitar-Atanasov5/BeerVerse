import { beforeAll, beforeEach, jest } from '@jest/globals';
import { mockUser, mockBcrypt } from './unitSetup.js';

const mockJwT = {
    sign: jest.fn().mockReturnValue("fake jwt token")
};

jest.unstable_mockModule("jsonwebtoken", () => ({
    default: mockJwT
}));

const { loginUserService } = await import("../../services/loginUserService.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Login service tests", () => {
    test("Should login user successfully with valid credentials", async () => {
        const validUsername = "ValidInput1";
        const validPassword = "ValidPass1";

        mockUser.findOne.mockResolvedValueOnce({ _id: "1", username: validUsername, password: "hashed" });
        mockBcrypt.compare.mockResolvedValueOnce(true);
        mockJwT.sign.mockReturnValueOnce("mocked token");

        await expect(loginUserService(validUsername, validPassword)).resolves.toMatchObject({
            status: 200,
            message: "Login successful",
            token: "mocked token"
        });
    });
    test("Should return 404 with non existing user", async () => {
        const invalidUserName = "Miro123";
        const invalidPassword = "Parola123";

        mockUser.findOne.mockResolvedValueOnce(null);

        await expect(loginUserService(invalidUserName, invalidPassword)).rejects.toMatchObject({
            status: 404,
            message: "Invalid user"
        });
    });
    test("Should return 404 with valid username and wrong password", async () => {
        const validUsername = "Validuser1";
        const invalidPassword = "InvalidPass";

        mockUser.findOne.mockResolvedValueOnce({ _id: "1", username: validUsername, password: "hashed" });
        mockBcrypt.compare.mockResolvedValueOnce(false);

        await expect(loginUserService(validUsername, invalidPassword)).rejects.toMatchObject({
            status: 404,
            message: "Invalid password"
        });
    });
    test("Should throw 400 for missing username input", async () => {
        const emptyUsername = ""
        const somePass = "Pass1"

        await expect(loginUserService(emptyUsername, somePass)).rejects.toMatchObject({
            status: 400,
            message: "Username and password are required"
        });
    });
    test("Should throw 400 for missing password input", async () => {
        const username = "Someuser1"
        const emptyPass = ""

        await expect(loginUserService(username, emptyPass)).rejects.toMatchObject({
            status: 400,
            message: "Username and password are required"
        });
    });
});
