import { jest } from "@jest/globals";

//MOCK USER MODEL
export const mockUser = {
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({
    _id: "123",
    username: "mockUser",
  }),
};

jest.unstable_mockModule("../../models/user.js", () => ({
  default: mockUser
}));

//MOCK BCRYPT
export const mockBcrypt = { 
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn().mockResolvedValue(true),
};

jest.unstable_mockModule("bcrypt", () => ({
  default: mockBcrypt
}));

//MOCK BEER MODEL
export const mockBeer = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

jest.unstable_mockModule("../../models/beer.js", () =>({
  default: mockBeer,
}));

//IMPORT SERVICE AFTER MOCKS
export const { registerUserService } = await import("../../services/registerUserService.js");
export const beerServiceModule = await import("../../services/beerService.js");

