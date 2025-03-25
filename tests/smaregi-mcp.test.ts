/**
 * Smaregi MCP Server Integration Tests
 */
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

// Increase timeout for tests
jest.setTimeout(30000);

describe("Smaregi MCP Server Integration Tests", () => {
  let serverProcess: ChildProcessWithoutNullStreams | null = null;

  // Start server before all tests
  beforeAll(async () => {
    serverProcess = await startMCPServer();

    // Server initialization
    const initRequest = {
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {
          sampling: {},
        },
        clientInfo: {
          name: "smaregi-test-client",
          version: "1.0.0",
        },
      },
      jsonrpc: "2.0",
      id: 0,
    };

    const initResponse = await sendRequest(serverProcess, initRequest);
    console.log("Initialize Response:", JSON.stringify(initResponse, null, 2));

    // Validate response
    expect(initResponse).toBeDefined();
    expect(initResponse.jsonrpc).toBe("2.0");
    expect(initResponse.id).toBe(0);
  });

  // Clean up server after all tests
  afterAll(() => {
    if (serverProcess) {
      console.log("Shutting down server...");
      serverProcess.kill();
    }
  });

  // Test 1: Get products
  test("should get products with default parameters", async () => {
    if (!serverProcess) {
      throw new Error("Server process is not initialized");
    }

    const productsRequest = {
      method: "tools/call",
      params: {
        name: "get_products",
        arguments: {},
      },
      jsonrpc: "2.0",
      id: 1,
    };

    const response = await sendRequest(serverProcess, productsRequest);
    console.log("Products Response:", JSON.stringify(response, null, 2));

    // Validate response
    expect(response).toBeDefined();
    expect(response.jsonrpc).toBe("2.0");
    expect(response.id).toBe(1);
    expect(response.result).toBeDefined();
    expect(response.result.isError).toBe(false);
  });

  // Test 2: Get products with filter
  test("should get products filtered by category", async () => {
    if (!serverProcess) {
      throw new Error("Server process is not initialized");
    }

    const productsRequest = {
      method: "tools/call",
      params: {
        name: "get_products",
        arguments: {
          category: "コーヒー",
        },
      },
      jsonrpc: "2.0",
      id: 2,
    };

    const response = await sendRequest(serverProcess, productsRequest);
    console.log("Filtered Products Response:", JSON.stringify(response, null, 2));

    // Validate response
    expect(response).toBeDefined();
    expect(response.jsonrpc).toBe("2.0");
    expect(response.id).toBe(2);
    expect(response.result).toBeDefined();
    expect(response.result.isError).toBe(false);
  });

  // Test 3: Get sales
  test("should get sales data", async () => {
    if (!serverProcess) {
      throw new Error("Server process is not initialized");
    }

    const salesRequest = {
      method: "tools/call",
      params: {
        name: "get_sales",
        arguments: {},
      },
      jsonrpc: "2.0",
      id: 3,
    };

    const response = await sendRequest(serverProcess, salesRequest);
    console.log("Sales Response:", JSON.stringify(response, null, 2));

    // Validate response
    expect(response).toBeDefined();
    expect(response.jsonrpc).toBe("2.0");
    expect(response.id).toBe(3);
    expect(response.result).toBeDefined();
    expect(response.result.isError).toBe(false);
  });

  // Test 4: Get stores
  test("should get store data", async () => {
    if (!serverProcess) {
      throw new Error("Server process is not initialized");
    }

    const storesRequest = {
      method: "tools/call",
      params: {
        name: "get_stores",
        arguments: {},
      },
      jsonrpc: "2.0",
      id: 4,
    };

    const response = await sendRequest(serverProcess, storesRequest);
    console.log("Stores Response:", JSON.stringify(response, null, 2));

    // Validate response
    expect(response).toBeDefined();
    expect(response.jsonrpc).toBe("2.0");
    expect(response.id).toBe(4);
    expect(response.result).toBeDefined();
    expect(response.result.isError).toBe(false);
  });

  // Test 5: Run sales analysis
  test("should run sales analysis", async () => {
    if (!serverProcess) {
      throw new Error("Server process is not initialized");
    }

    const analysisRequest = {
      method: "tools/call",
      params: {
        name: "analyze_sales",
        arguments: {
          analysisType: "top_products",
        },
      },
      jsonrpc: "2.0",
      id: 5,
    };

    const response = await sendRequest(serverProcess, analysisRequest);
    console.log("Analysis Response:", JSON.stringify(response, null, 2));

    // Validate response
    expect(response).toBeDefined();
    expect(response.jsonrpc).toBe("2.0");
    expect(response.id).toBe(5);
    expect(response.result).toBeDefined();
    expect(response.result.isError).toBe(false);
  });
});

// Start MCP server process
async function startMCPServer() {
  console.log("Starting Smaregi MCP server...");

  const serverProcess = spawn("bun", ["src/index.ts"], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  // Output stderr to console
  serverProcess.stderr.on("data", (data) => {
    console.log(`[SERVER LOG] ${data.toString().trim()}`);
  });

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return serverProcess;
}

// Send MCP request
function sendRequest(
  serverProcess: ChildProcessWithoutNullStreams,
  request: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    // Set timeout
    const timeout = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, 10000); // Longer timeout for tests

    // Send request
    const requestJson = JSON.stringify(request);
    console.log(`[SENDING] ${requestJson}`);
    serverProcess.stdin.write(requestJson + "\n");

    // Set up response listener
    const dataHandler = (data: Buffer) => {
      const response = data.toString().trim();
      console.log(`[RECEIVED] ${response}`);

      try {
        // Parse JSON response
        const parsed = JSON.parse(response);
        clearTimeout(timeout);
        serverProcess.stdout.removeListener("data", dataHandler);
        resolve(parsed);
      } catch (error) {
        console.log("[PARSE ERROR]", error);
        // Continue listening if not valid JSON
        console.log(
          "[PARSE ERROR] Not a valid JSON response, continuing to listen"
        );
      }
    };

    serverProcess.stdout.on("data", dataHandler);
  });
}
