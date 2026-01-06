import { beforeEach, jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../mockFunctions.js';
import { HttpError } from '../../helpers.js';

let registerUserService, loginUserService;
let registerUserController, loginUserController

beforeAll(async () => {
    jest.unstable_mockModule('../../services/registerUserService.js', () => ({
        registerUserService: jest.fn()
    }));

    jest.unstable_mockModule('../../services/loginUserService.js', () => ({
        loginUserService: jest.fn()
    }));

    ({ registerUserService } = await import('../../services/registerUserService.js'));
    ({ loginUserService } = await import('../../services/loginUserService.js'));

    ({ registerUserController, loginUserController } = await import('../../controllers/authControllers.js'))
});
beforeEach(() => {
    jest.clearAllMocks()
});
describe("Register controller unit test", () => {
    test("Responds with 201 and user data on successful registration", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            username: "DimitarDimov",
            password: "Pass1Pass1",
            confirmPassword: "Pass1Pass1",
            firstName: "Ivan",
            lastName: "Ivanov",
            age: "25",
            email: "dimov1@gmail.com"
        };

        registerUserService.mockResolvedValueOnce({
            status: 201,
            message: "Successful registration",
            user: {
                id: "1",
                username: "DimitarDimov"
            }
        });

        await registerUserController(req, res);

        expect(registerUserService).toHaveBeenCalledTimes(1);
        expect(registerUserService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Successful registration",
            user: {
                id: "1",
                username: "DimitarDimov"
            }
        });
    });
    test("Responds with 400 and validation errors", async () => {
        const req = mockRequest()
        const res = mockResponse();
        req.body = {
            username: "DimitarDimov",
            password: "Pass1Pass1",
            confirmPassword: "Pass1Pass1",
            firstName: "Ivan",
            lastName: "Ivanov",
            age: "25aaa",
            email: "dimov1@gmail.com"
        };

        registerUserService.mockRejectedValueOnce(
            new HttpError(400, ["Age must be a number"])
        );

        await registerUserController(req, res);

        expect(registerUserService).toHaveBeenCalledTimes(1);
        expect(registerUserService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["Age must be a number"]
        });
    });
    test("Responds with 500 when service throws Error", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {};

        registerUserService.mockRejectedValueOnce(new Error("DB down"));

        await registerUserController(req, res);

        expect(registerUserService).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Server error"
        });
    });
    test("Responds with 409 when user already exists", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = { username: "ExistingUser", password: "Password1" };

        registerUserService.mockRejectedValueOnce(new HttpError(409, "Username already exists"));

        await registerUserController(req, res);

        expect(registerUserService).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            error: "Username already exists"
        });
    });
});
describe("Login controller unit tests", () => {
    test("Responds with 200 with valid username and password", async () => {
        const req = mockRequest();
        const res = mockResponse();

        req.body = { username: "Dimitar1", password: "Pass123" };

        loginUserService.mockResolvedValueOnce({
            status: 200,
            message: "Login successful"
        });
        await loginUserController(req, res);

        expect(loginUserService).toHaveBeenCalledTimes(1);
        expect(loginUserService).toHaveBeenCalledWith(req.body.username, req.body.password);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Login successful"
        });
    });
    test("Should handle error thrown by loginUserService for invalid password", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = { username: "User123", password: "wrongPass" };

        loginUserService.mockRejectedValueOnce(new HttpError(404, "Invalid password"));

        await loginUserController(req, res);

        expect(loginUserService).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid password" });
    });
    test("Responds with 500 when loginUserService throws Error", async () => {
        const req = mockRequest();
        const res = mockResponse();

        req.body = { username: "Dimo123", password: "Pass123" };

        loginUserService.mockRejectedValueOnce(new Error("DB down"));

        await loginUserController(req, res);

        expect(loginUserService).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
});
