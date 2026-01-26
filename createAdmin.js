import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.js";

const MONGO_URI = "mongodb://localhost:27017/BeerVerse-DB"; 

await mongoose.connect(MONGO_URI);

const existingAdmin = await User.findOne({ role: "admin" });
if (existingAdmin) {
    console.log("Admin already exists");
    process.exit();
}

const hashedPassword = await bcrypt.hash("Admin123", 8);

await User.create({
    username: "adminuser",
    password: hashedPassword,
    firstName: "Admin",
    lastName: "User",
    age: 30,
    email: "admin@beerverse.com",
    role: "admin",
});

console.log("Admin user created successfully");
process.exit();