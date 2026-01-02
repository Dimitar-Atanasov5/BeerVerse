import { beforeEach, describe, jest } from '@jest/globals';
import { mockBeer, beerServiceModule } from './unitSetup.js';

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
            ibu: 45
        };

        const docBeer = {
            ...validData,
            toObject: jest.fn().mockReturnValue(validData),
        };

        mockBeer.create.mockResolvedValueOnce(docBeer);

        await expect(beerServiceModule.createBeer(validData)).resolves.toEqual(validData);
    });
    test("Тhrows validation error when name is missing", async () => {
        const invalidData = {
            name: "",
            style: "Stout",
            country: "England",
            abv: 4,
            ibu: 65
        };

        await expect(beerServiceModule.createBeer(invalidData)).rejects.toMatchObject({
            status: 400,
            message: "Missing required fields: name"
        });
    });
    test("Throws validation error when ibu is not a number", async () => {
        const data = {
            name: "Zagorka",
            style: "Lager",
            country: "Bulgaria",
            abv: 4,
            ibu: "ten"
        };

        await expect(beerServiceModule.createBeer(data)).rejects.toMatchObject({
            status: 400,
            message: "IBU must be a number"
        });
    });
});
