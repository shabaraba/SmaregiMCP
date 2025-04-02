import createClient from "openapi-fetch";
import {type paths} from "../generated/schema";

const client = createClient<paths>(
  {
    baseUrl: "http://localhost",
    headers: {

    }
  }
)
client.GET("/products/{id}", {
  params: {
    path: {
      "id": 1,
    },
    query: {
    }
  }
})
