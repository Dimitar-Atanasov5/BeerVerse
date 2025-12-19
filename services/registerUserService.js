import bcrypt from 'bcrypt';
import User from '../models/user.js'
import { HttpError } from '../helpers.js'

export async function registerUserService(data) {

    const errors = [];

    try {
        const {
            username,
            password,
            confirmPassword,
            firstName,
            lastName,
            age,
            email
        } = data;

        const usernameTrimmed = String(username || "").trim();
        const passwordTrimmed = String(password || "").trim();
        const confirmPasswordTrimmed = String(confirmPassword || "").trim();
        const firstNameTrimmed = String(firstName || "").trim();
        const lastNameTrimmed = String(lastName || "").trim();
        const ageTrimmed = String(age || "").trim();
        const emailTrimmed = String(email || "").trim();

        if (!usernameTrimmed) errors.push("Username is required");
        if (!passwordTrimmed) errors.push("Password is required");
        if (!confirmPasswordTrimmed) errors.push("Please confirm password");
        if (!firstNameTrimmed) errors.push("First name is required");
        if (!lastNameTrimmed) errors.push("Last name is required");
        if (!ageTrimmed) errors.push("Age is required");
        if (!emailTrimmed) errors.push("E-mail is required");

        const hasInternalSpaces = (str) => /\s/.test(str);
        if (
            hasInternalSpaces(usernameTrimmed) ||
            hasInternalSpaces(passwordTrimmed) ||
            hasInternalSpaces(confirmPasswordTrimmed) ||
            hasInternalSpaces(ageTrimmed) ||
            hasInternalSpaces(emailTrimmed)
        ) {
            errors.push("Fields must not contain spaces (except first and last name)");
        }

        const nameRegex = /^[A-Za-zА-Яа-я]+$/;
        const ageRegex = /^\d+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegex.test(firstNameTrimmed)) {
            errors.push("First name must contain only letters");
        }

        if (!nameRegex.test(lastNameTrimmed)) {
            errors.push("Last name must contain only letters");
        }

        if (!ageRegex.test(ageTrimmed)) {
            errors.push("Age must be a number");
        }

        if (!emailRegex.test(emailTrimmed)) {
            errors.push("Invalid e-mail");
        }

        if (usernameTrimmed.length < 6 || usernameTrimmed.length > 12) {
            errors.push("Username must be between 6 and 12 characters");
        }

        if (passwordTrimmed.length < 6 || passwordTrimmed.length > 12) {
            errors.push("Password must be between 6 and 12 characters");
        }
        if (passwordTrimmed !== confirmPasswordTrimmed) {
            errors.push("Password do not match");
        }
        if (!ageRegex.test(ageTrimmed)) {
            errors.push("Age must be a number");
        } else {
            const ageNumber = Number(ageTrimmed);
            if (ageNumber < 18 || ageNumber > 99) {
                errors.push("Age must be between 18 and 99");
            }
        }

        if (errors.length > 0) {
            throw new HttpError(400, errors);
        }

        const existingUser = await User.findOne({
            $or: [
                { username: usernameTrimmed },
                { email: emailTrimmed }
            ]
        });

        if (existingUser) {
            throw new HttpError(409, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(passwordTrimmed, 8);

        const user = await User.create({
            username: usernameTrimmed,
            password: hashedPassword,
            firstName: firstNameTrimmed,
            lastName: lastNameTrimmed,
            age: Number(ageTrimmed),
            email: emailTrimmed
        });

        return {
            status: 201,
            message: "Successful registration",
            user: {
                id: user._id.toString(),
                username: user.username
            }
        };

    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        };
        throw new HttpError(500, "Server error");
    };
};
