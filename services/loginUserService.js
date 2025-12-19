import bcrypt from 'bcrypt';
import { HttpError } from '../helpers.js'
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function loginUserService(username, password) {
    if (!username?.trim() || !password?.trim()) {
        throw new HttpError(400, "Username and password are required");
    }

    const user = await User.findOne({ username: username?.trim() });
    if (!user) {
        throw new HttpError(404, "Invalid user");
    }

    const isPasswordMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isPasswordMatch) {
        throw new HttpError(404, "Invalid password");
    }
    const token = jwt.sign(
        { id: user._id.toString(), username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return {
        status: 200,
        message: "Login successful",
        token
    };
};