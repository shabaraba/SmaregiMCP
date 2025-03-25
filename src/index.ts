/**
 * Smaregi MCP - Model Context Protocol (MCP) Server Implementation
 *
 * A specialized MCP server that provides access to Smaregi POS data
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Logger utility
function log(level: string, ...args: any[]) {
  console.error(`[${level.toUpperCase()}]`, ...args);
}

// Smaregi Products tool schema definition
const ProductsQuerySchema = z.object({
  limit: z
    .number()
    .optional()
    .describe("Maximum number of products to return"),
  page: z
    .number()
    .optional()
    .describe("Page number for pagination"),
  category: z
    .string()
    .optional()
    .describe("Category to filter products by"),
});

// Smaregi Sales tool schema definition
const SalesQuerySchema = z.object({
  startDate: z
    .string()
    .optional()
    .describe("Start date for sales data in YYYY-MM-DD format"),
  endDate: z
    .string()
    .optional()
    .describe("End date for sales data in YYYY-MM-DD format"),
  storeId: z
    .string()
    .optional()
    .describe("Store ID to filter sales by"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of sales records to return"),
  page: z
    .number()
    .optional()
    .describe("Page number for pagination"),
});

// Mock Smaregi data for demo purposes
// In a real implementation, this would connect to the Smaregi API
const mockSmaregiData = {
  products: [
    {
      productId: "P001",
      productCode: "ITEM001",
      productName: "オーガニックコーヒー豆 200g",
      price: 1200,
      categoryId: "C001",
      categoryName: "コーヒー",
      stockQuantity: 45,
    },
    {
      productId: "P002",
      productCode: "ITEM002",
      productName: "紅茶 Earl Grey 50g",
      price: 800,
      categoryId: "C002",
      categoryName: "紅茶",
      stockQuantity: 32,
    },
    {
      productId: "P003",
      productCode: "ITEM003",
      productName: "抹茶パウダー 30g",
      price: 1500,
      categoryId: "C003",
      categoryName: "日本茶",
      stockQuantity: 18,
    },
    {
      productId: "P004",
      productCode: "ITEM004",
      productName: "ドリッパー V60",
      price: 2500,
      categoryId: "C004",
      categoryName: "器具",
      stockQuantity: 10,
    },
    {
      productId: "P005",
      productCode: "ITEM005",
      productName: "コーヒーミル 手動",
      price: 3200,
      categoryId: "C004",
      categoryName: "器具",
      stockQuantity: 7,
    },
  ],
  sales: [
    {
      transactionId: "T001",
      date: "2023-03-01",
      storeId: "S001",
      storeName: "東京本店",
      totalAmount: 4700,
      items: [
        {
          productId: "P001",
          productName: "オーガニックコーヒー豆 200g",
          quantity: 2,
          price: 1200,
          amount: 2400,
        },
        {
          productId: "P002",
          productName: "紅茶 Earl Grey 50g",
          quantity: 1,
          price: 800,
          amount: 800,
        },
        {
          productId: "P004",
          productName: "ドリッパー V60",
          quantity: 1,
          price: 2500,
          amount: 1500,
        },
      ],
    },
    {
      transactionId: "T002",
      date: "2023-03-01",
      storeId: "S001",
      storeName: "東京本店",
      totalAmount: 3000,
      items: [
        {
          productId: "P003",
          productName: "抹茶パウダー 30g",
          quantity: 2,
          price: 1500,
          amount: 3000,
        },
      ],
    },
    {
      transactionId: "T003",
      date: "2023-03-02",
      storeId: "S002",
      storeName: "大阪支店",
      totalAmount: 5700,
      items: [
        {
          productId: "P001",
          productName: "オーガニックコーヒー豆 200g",
          quantity: 1,
          price: 1200,
          amount: 1200,
        },
        {
          productId: "P005",
          productName: "コーヒーミル 手動",
          quantity: 1,
          price: 3200,
          amount: 3200,
        },
        {
          productId: "P002",
          productName: "紅茶 Earl Grey 50g",
          quantity: 1,
          price: 800,
          amount: 800,
        },
        {
          productId: "P004",
          productName: "ドリッパー V60",
          quantity: 1,
          price: 2500,
          amount: 500, // Discount applied
        },
      ],
    },
  ],
  stores: [
    {
      storeId: "S001",
      storeName: "東京本店",
      address: "東京都渋谷区...",
      phoneNumber: "03-1234-5678",
    },
    {
      storeId: "S002",
      storeName: "大阪支店",
      address: "大阪府大阪市...",
      phoneNumber: "06-1234-5678",
    },
  ],
};

// Initialize MCP server
const server = new McpServer({
  name: "smaregi-mcp-server",
  version: "1.0.0",
  description:
    "A specialized Model Context Protocol server that provides access to Smaregi POS system data. This server offers tools to retrieve product information, sales data, and other retail analytics from Smaregi, making it possible for AI assistants to analyze and provide insights on retail operations data.",
});

// Products tool implementation
server.tool(
  "get_products",
  "Retrieves product data from the Smaregi POS system. This tool allows access to detailed information about products including IDs, names, prices, categories, and inventory levels. Use this tool when you need information about specific products, product categories, or overall product inventory in the Smaregi system.",
  ProductsQuerySchema.shape,
  async (args) => {
    try {
      // In a real implementation, this would connect to the Smaregi API
      // Here we use mock data for demonstration
      log("info", `Products tool called with args: ${JSON.stringify(args)}`);

      // Apply filters if provided
      let products = [...mockSmaregiData.products];

      if (args.category) {
        products = products.filter(p => p.categoryName.includes(args.category));
      }

      // Apply pagination
      const limit = args.limit || 10;
      const page = args.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = products.slice(startIndex, endIndex);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(paginatedProducts, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      log("error", "Products tool error:", error);

      return {
        content: [
          {
            type: "text",
            text: `An error occurred while retrieving product data: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Sales tool implementation
server.tool(
  "get_sales",
  "Retrieves sales transaction data from the Smaregi POS system. This tool provides access to sales records including transaction IDs, dates, store information, total amounts, and line items. You can filter sales data by date range, store, and apply pagination. Use this tool when you need to analyze sales trends, check specific transactions, or gather sales performance metrics.",
  SalesQuerySchema.shape,
  async (args) => {
    try {
      // In a real implementation, this would connect to the Smaregi API
      // Here we use mock data for demonstration
      log("info", `Sales tool called with args: ${JSON.stringify(args)}`);

      // Apply filters if provided
      let sales = [...mockSmaregiData.sales];

      if (args.startDate) {
        sales = sales.filter(s => s.date >= args.startDate);
      }

      if (args.endDate) {
        sales = sales.filter(s => s.date <= args.endDate);
      }

      if (args.storeId) {
        sales = sales.filter(s => s.storeId === args.storeId);
      }

      // Apply pagination
      const limit = args.limit || 10;
      const page = args.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSales = sales.slice(startIndex, endIndex);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(paginatedSales, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      log("error", "Sales tool error:", error);

      return {
        content: [
          {
            type: "text",
            text: `An error occurred while retrieving sales data: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Store tool implementation
server.tool(
  "get_stores",
  "Retrieves store information from the Smaregi POS system. This tool provides details about retail locations including store IDs, names, addresses, and contact information. Use this tool when you need to access information about specific store locations or when analyzing data across different store branches.",
  z.object({}).shape,
  async () => {
    try {
      // In a real implementation, this would connect to the Smaregi API
      // Here we use mock data for demonstration
      log("info", "Stores tool called");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(mockSmaregiData.stores, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      log("error", "Stores tool error:", error);

      return {
        content: [
          {
            type: "text",
            text: `An error occurred while retrieving store data: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Sales Analysis tool implementation
server.tool(
  "analyze_sales",
  "Analyzes sales data to provide insights and summaries. This tool processes Smaregi sales data to generate various analytics reports such as top-selling products, sales trends, category performance, and store comparisons. The tool can format results as summary text or structured data. Use this tool when you need to extract business insights from raw sales data or present performance metrics.",
  z.object({
    analysisType: z
      .enum(["top_products", "sales_by_category", "store_comparison", "daily_trend"])
      .describe("Type of analysis to perform"),
    startDate: z
      .string()
      .optional()
      .describe("Start date for analysis in YYYY-MM-DD format"),
    endDate: z
      .string()
      .optional()
      .describe("End date for analysis in YYYY-MM-DD format"),
    limit: z
      .number()
      .optional()
      .describe("Maximum number of items to include in results"),
  }).shape,
  async (args) => {
    try {
      // In a real implementation, this would perform actual analysis on Smaregi data
      // Here we use mock data and analysis for demonstration
      log("info", `Sales analysis tool called with args: ${JSON.stringify(args)}`);

      let analysisResult: any = { type: args.analysisType };
      
      switch (args.analysisType) {
        case "top_products":
          // Generate mock top products analysis
          analysisResult.results = [
            { productName: "オーガニックコーヒー豆 200g", totalQuantity: 3, totalRevenue: 3600 },
            { productName: "紅茶 Earl Grey 50g", totalQuantity: 2, totalRevenue: 1600 },
            { productName: "ドリッパー V60", totalQuantity: 2, totalRevenue: 2000 },
            { productName: "コーヒーミル 手動", totalQuantity: 1, totalRevenue: 3200 },
            { productName: "抹茶パウダー 30g", totalQuantity: 2, totalRevenue: 3000 },
          ];
          break;
          
        case "sales_by_category":
          // Generate mock category analysis
          analysisResult.results = [
            { categoryName: "コーヒー", totalSales: 3600, percentage: 22.09 },
            { categoryName: "紅茶", totalSales: 1600, percentage: 9.82 },
            { categoryName: "日本茶", totalSales: 3000, percentage: 18.40 },
            { categoryName: "器具", totalSales: 8100, percentage: 49.69 },
          ];
          break;
          
        case "store_comparison":
          // Generate mock store comparison
          analysisResult.results = [
            { storeName: "東京本店", totalTransactions: 2, totalSales: 7700, averageBasket: 3850 },
            { storeName: "大阪支店", totalTransactions: 1, totalSales: 5700, averageBasket: 5700 },
          ];
          break;
          
        case "daily_trend":
          // Generate mock daily trend
          analysisResult.results = [
            { date: "2023-03-01", totalTransactions: 2, totalSales: 7700 },
            { date: "2023-03-02", totalTransactions: 1, totalSales: 5700 },
          ];
          break;
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(analysisResult, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      log("error", "Sales analysis tool error:", error);

      return {
        content: [
          {
            type: "text",
            text: `An error occurred during sales analysis: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Server start function
async function main() {
  try {
    log("info", "Starting Smaregi MCP server...");

    // Configure transport
    const transport = new StdioServerTransport();

    // Connect server to transport
    await server.connect(transport);

    // Display startup messages
    log("info", "Smaregi MCP Server started");
    log("info", "Available tools: get_products, get_sales, get_stores, analyze_sales");
    log("info", "Listening for requests...");
  } catch (error) {
    log("error", "Failed to start Smaregi MCP Server:", error);
    process.exit(1);
  }
}

// Process termination handler
process.on("SIGINT", () => {
  log("info", "Server shutting down...");
  process.exit(0);
});

// Error handler
process.on("uncaughtException", (error) => {
  log("error", "Uncaught exception:", error);
});

// Run the server
main().catch((error) => {
  log("error", "Unexpected error:", error);
  process.exit(1);
});
