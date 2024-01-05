const server = require("../../../../utils/server")("test");

describe("Internal Route Test", () => {
    it("gets hello world successfully", async () => {
        const res = await server.get("/v1.0/hello/panel");
        expect(res.status).toBe(200);
        expect(res.body.message).toEqual("hello world");
    });
});
