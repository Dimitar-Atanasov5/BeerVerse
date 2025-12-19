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
        req.body = {};

        registerUserService.mockResolvedValueOnce({
            status: 201,
            message: "Successful registration",
            user: {
                id: "1",
                username: "User11"
            }
        });

        await registerUserController(req, res);

        expect(registerUserService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Successful registration",
            user: {
                id: "1",
                username: "User11"
            }
        });
    });
    test("Responds with 400 and validation errors", async () => {
        const req = mockRequest()
        const res = mockResponse();
        req.body = {}

        registerUserService.mockRejectedValueOnce(
            new HttpError(400, ["Age must be a number"])
        );

        await registerUserController(req, res);

        expect(registerUserService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["Age must be a number"]
        });
    });
    test("Responds with 500 when service throws unexpected error", async () => {
        const req = mockRequest();        
        const res = mockResponse();
        req.body = {};

        registerUserService.mockRejectedValueOnce(new HttpError(500, "DB down"));

        await registerUserController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "DB down"
        });
    });
    test("Responds with 409 when user already exists", async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {};

        registerUserService.mockRejectedValueOnce(new HttpError(409, "Username already exists"));

        await registerUserController(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            error: "Username already exists"
        });
    });
});
describe("Login controller unit tests", () => {
    test("Should return 200 with valid username and password", async () => {
        const req = mockRequest()
        req.body = {};

        const res = mockResponse()

        loginUserService.mockResolvedValueOnce({
            status: 200,
            message: "Login successful"
        });
        await loginUserController(req, res);

        expect(loginUserService).toHaveBeenCalledWith(req.body.username, req.body.password);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Login successful"
        });
    });
    test("Should handle error thrown by loginUserService", async () => {
        const req = mockRequest();
        req.body = {};
        const res = mockResponse();

        loginUserService.mockRejectedValueOnce({ message: "Invalid password", status: 404 });

        await loginUserController(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid password" });
    });
});
