import { beforeAll, beforeEach, jest } from '@jest/globals';
import { mockUser, mockBcrypt } from './unitSetup.js';


const mockJwT = {
    sign: jest.fn().mockReturnValue(null)
};

jest.unstable_mockModule("jsonwebtoken", () => ({
    default: mockJwT
}));

const { loginUserService } = await import("../../services/loginUserService.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Login service tests", () => {
    test("[KAN-34] User login with valid data", async () => {
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
    test("[KAN-35] Login fails with invalid credentials", async () => {
        const invalidUserName = "Miro123";
        const invalidPassword = "Parola123";

        mockUser.findOne.mockResolvedValueOnce(null);

        await expect(loginUserService(invalidUserName, invalidPassword)).rejects.toMatchObject({
            status: 401,
            message: "Invalid username or password"
        });

        expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });
    test("[KAN-36] Login fails with valid username and invalid password", async () => {
        const validUsername = "Validuser1";
        const invalidPassword = "InvalidPass";

        mockUser.findOne.mockResolvedValueOnce({ _id: "1", username: validUsername, password: "hashed" });
        mockBcrypt.compare.mockResolvedValueOnce(false);

        await expect(loginUserService(validUsername, invalidPassword)).rejects.toMatchObject({
            status: 401,
            message: "Invalid username or password"
        });

        expect(mockBcrypt.compare).toHaveBeenCalledTimes(1);
    });
    test("[KAN-37] Login fails with missing username input", async () => {
        const emptyUsername = ""
        const somePass = "Pass1"

        await expect(loginUserService(emptyUsername, somePass)).rejects.toMatchObject({
            status: 400,
            message: "Username and password are required"
        });
    });
    test("[KAN-38] Login fails with missing password input", async () => {
        const username = "Someuser1"
        const emptyPass = ""

        await expect(loginUserService(username, emptyPass)).rejects.toMatchObject({
            status: 400,
            message: "Username and password are required"
        });
    });
});
