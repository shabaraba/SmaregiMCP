"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var openapi_fetch_1 = require("openapi-fetch");
var client = (0, openapi_fetch_1.default)({
    baseUrl: "http://localhost",
    headers: {}
});
client.GET("/products/{id}", {
    params: {
        path: {
            "id": 1,
        },
        query: {}
    }
});
