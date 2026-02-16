import { beforeEach, describe, jest, test } from '@jest/globals';
import { mockBeer, beerServiceModule } from './unitSetup.js';
import { HttpError } from '../../helpers.js';

beforeEach(() => {
    jest.clearAllMocks();
});
describe("Beer service unit tests", () => {
    test("Should create beer successfully", async () => {
        const validData = {
            name: "Test beer",
            style: "Lager",
            country: "Bulgaria",
            abv: 5,
            ibu: 45,
            createdBy: "Dimo1"
        };

        const docBeer = {
            toObject: jest.fn().mockReturnValue(validData),
        };

        mockBeer.create.mockResolvedValueOnce(docBeer);

        await expect(beerServiceModule.createBeer(validData)).resolves.toMatchObject(validData);
        expect(mockBeer.create).toHaveBeenCalledTimes(1);
        expect(mockBeer.create).toHaveBeenCalledWith(
            expect.objectContaining(validData)
        );
    });
    describe("Missing required fields validation", () => {
        test("throws validation error with all missing required fields", async () => {
            const data = {};

            await expect(beerServiceModule.createBeer(data)).rejects.toMatchObject({
                status: 400,
                message: "Missing required fields: name, style, country, abv, ibu"
            });
        });
    });
    describe("Numeric validation for ABV and IBU", () => {
        test("Throws an error when ibu is not a number", async () => {
            const data = {
                name: "Zagorka",
                style: "Lager",
                country: "Bulgaria",
                abv: "four",
                ibu: 10
            };

            await expect(beerServiceModule.createBeer(data)).rejects.toMatchObject({
                status: 400,
                message: "ABV must be a number"
            });
        });
        test("Throws an error when ibu is not a number", async () => {
            const data = {
                name: "Zagorka",
                style: "Lager",
                country: "Bulgaria",
                abv: 4,
                ibu: "fifteen"
            };
            await expect(beerServiceModule.createBeer(data)).rejects.toMatchObject({
                status: 400,
                message: "IBU must be a number"
            });
        });
    });
    describe("Boundary value analysis for ABV properties", () => {

        const baseData = {
            name: "Test beer",
            style: "Pilsner",
            country: "Bulgaria",
            ibu: 10,
            createdBy: "Dimo11"
        };

        test.each([-1, 21])("Rejects invalid ABV boundary", async (abvInput) => {
            const data = { ...baseData, abv: abvInput };

            await expect(beerServiceModule.createBeer(data)).rejects.toMatchObject({
                status: 400,
                message: "ABV must be between 0 and 20%"
            });
        });
        test.each([0, 1, 19, 20])("Accepts valid ABV boundary", async (abvInput) => {
            const data = { ...baseData, abv: abvInput };

            const docBeer = {
                toObject: jest.fn().mockReturnValueOnce(data),
            };

            mockBeer.create.mockResolvedValueOnce(docBeer);

            await expect(beerServiceModule.createBeer(data)).resolves.toMatchObject(data);
            expect(mockBeer.create).toHaveBeenCalledTimes(1);
            expect(docBeer.toObject).toHaveBeenCalledTimes(1);
        });
    });
    describe("Boundary value analysis for IBU properties", () => {
        const baseData = {
            name: "Test beer",
            style: "Pilsner",
            country: "Bulgaria",
            abv: 5,
            createdBy: "Dimo11"
        };
        test.each([-1, 101])("Rejects invalid IBU boundary", async (ibuInput) => {
            const data = { ...baseData, ibu: ibuInput };

            await expect(beerServiceModule.createBeer(data)).rejects.toMatchObject({
                status: 400,
                message: "IBU must be between 0 and 100"
            });
        });
        test.each([0, 100])("Accepts valid IBU boundary", async (ibuInput) => {
            const data = { ...baseData, ibu: ibuInput };

            const docBeer = {
                toObject: jest.fn().mockReturnValueOnce(data)
            };

            mockBeer.create.mockResolvedValueOnce(docBeer);

            await expect(beerServiceModule.createBeer(data)).resolves.toMatchObject(data);
            expect(mockBeer.create).toHaveBeenCalledTimes(1);
            expect(docBeer.toObject).toHaveBeenCalledTimes(1);
        });
    });
});




