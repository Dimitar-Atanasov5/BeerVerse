import { jest } from '@jest/globals';
import { HttpError } from '../../helpers.js';
import * as beerService from '../../services/beerService.js';
import Beer from '../../models/beer.js';

describe("Beer Service Integration tests", () => {
    it("Should create beer successfully", async () => {
        const data = {
            name: "Test Beer",
            style: "Lager",
            country: "Bulgaria",
            abv: 4,
            ibu: 25
        };

        const result = await beerService.createBeer(data);

        expect(result.name).toBe("Test Beer");
        expect(result.style).toBe("Lager");
        expect(result.country).toBe("Bulgaria");
        expect(result.abv).toBe(4);
        expect(result.ibu).toBe(25);

        const fromDB = await Beer.findOne({ name: "Test Beer" });

        expect(fromDB).toBeDefined();
        expect(fromDB.style).toBe("Lager");
        expect(fromDB.country).toBe("Bulgaria");
        expect(fromDB.abv).toBe(4);
        expect(fromDB.ibu).toBe(25);
    });
    it("Should not create beer and throw an error 400 for missing mandatory input", async () => {
        const data = {
            name: "Test Beer",
            style: "",
            country: "Greece",
            abv: 5,
            ibu: 17
        };

        await expect(beerService.createBeer(data)).rejects.toMatchObject({
            status: 400,
            message: "Missing required fields: style"
        });

        const total = await Beer.countDocuments();
        expect (total).toBe(0);
    });
});


