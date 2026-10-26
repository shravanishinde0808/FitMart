
const express = require("express");
const request = require("supertest");
const bodyParser = require("../middleware/bodyParser");

describe("Request body size limit", () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(bodyParser);

        app.post("/test", (req, res) => {
            res.status(200).json({ received: true });
        });

        app.use((err, req, res, next) => {
            if (err.type === "entity.too.large" || err.status === 413) {
                return res.status(413).json({ error: "Payload too large" });
            }

            res.status(500).json({ error: "Something went wrong" });
        });
    });

    test("accepts a small JSON payload", async () => {
        const res = await request(app)
            .post("/test")
            .send({ message: "hello" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ received: true });
    });

    test("accepts a payload larger than the old 10kb limit", async () => {
        const res = await request(app)
            .post("/test")
            .send({ message: "x".repeat(20 * 1024) });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ received: true });
    });

    test("rejects an oversized JSON payload", async () => {
        const res = await request(app)
            .post("/test")
            .send({ message: "x".repeat(1100 * 1024) });

        expect(res.status).toBe(413);
        expect(res.body).toEqual({ error: "Payload too large" });
    });

    test("rejects an oversized URL-encoded payload", async () => {
        const res = await request(app)
            .post("/test")
            .type("form")
            .send({ message: "x".repeat(1100 * 1024) });

        expect(res.status).toBe(413);
        expect(res.body).toEqual({ error: "Payload too large" });
    });
});
