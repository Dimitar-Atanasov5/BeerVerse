import { registerUserService } from '../services/registerUserService.js';
import { loginUserService } from '../services/loginUserService.js';
import { HttpError } from '../helpers.js';

export async function registerUserController(req, res) {
    try {
        const result = await registerUserService(req.body);
        return res.status(result.status).json({
            message: result.message,
            user: result.user,
        });
    } catch (err) {
        if (err instanceof HttpError) {
            return res.status(err.status).json({
                error: err.errors ?? err.message,
            });
        }
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function loginUserController(req, res) {
    try {
        const { username, password } = req.body;
        const result = await loginUserService(username, password);

        return res.status(result.status).json({
            message: result.message,
            token: result.token,
        });
    } catch (err) {
        if (err instanceof HttpError) {
            return res.status(err.status).json({ error: err.message });
        }
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
