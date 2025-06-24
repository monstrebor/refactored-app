/**
 * @jest-environment node
 */
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dbConnect from "../../middleware/db-connect";

describe("dbConnect", () => {
    let connection: MongoMemoryServer;

    afterEach(async () => {
        jest.clearAllMocks();
        if (connection?.stop) {
            await connection.stop();
        }
        await mongoose.disconnect();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("calls MongoMemoryServer.create()", async () => {
        const spy = jest.spyOn(MongoMemoryServer, "create");
        connection = await dbConnect();
        expect(spy).toHaveBeenCalled();
    });

    test("calls mongoose.disconnect()", async () => {
        const spy = jest.spyOn(mongoose, "disconnect");
        connection = await dbConnect();
        await mongoose.disconnect(); // required to trigger the spy
        expect(spy).toHaveBeenCalled();
    });

    test("calls mongoose.connect()", async () => {
        const spy = jest.spyOn(mongoose, "connect");
        connection = await dbConnect();
        expect(spy).toHaveBeenCalledWith(
            expect.stringMatching(/^mongodb:\/\/.*$/),
            { dbName: "Weather" }
        );
    });
});
