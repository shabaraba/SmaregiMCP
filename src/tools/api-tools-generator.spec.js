"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_tools_generator_js_1 = require("./api-tools-generator.js");
describe('ApiToolsGenerator', function () {
    var service;
    // テスト用の統合モックデータ
    var mockApiData = {
        paths: {
            '/products': {
                get: {
                    summary: '商品一覧を取得',
                    parameters: [
                        {
                            name: 'limit',
                            in: 'query',
                            description: '取得する件数',
                            required: false,
                            type: 'integer'
                        },
                        {
                            name: 'sort',
                            in: 'query',
                            description: 'ソート順',
                            required: false,
                            type: 'string'
                        }
                    ]
                },
                post: {
                    summary: '商品を登録',
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    properties: {
                                        product_name: {
                                            type: 'string',
                                            description: '商品名'
                                        },
                                        price: {
                                            type: 'integer',
                                            description: '価格'
                                        }
                                    },
                                    required: ['product_name']
                                }
                            }
                        }
                    }
                }
            },
            '/products/{productId}': {
                get: {
                    summary: '商品詳細を取得',
                    parameters: [
                        {
                            name: 'productId',
                            in: 'path',
                            description: '商品ID',
                            required: true,
                            type: 'string'
                        }
                    ]
                },
                put: {
                    summary: '商品を更新',
                    parameters: [
                        {
                            name: 'productId',
                            in: 'path',
                            description: '商品ID',
                            required: true,
                            type: 'string'
                        }
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    properties: {
                                        product_name: {
                                            type: 'string',
                                            description: '商品名'
                                        },
                                        price: {
                                            type: 'integer',
                                            description: '価格'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                delete: {
                    summary: '商品を削除',
                    parameters: [
                        {
                            name: 'productId',
                            in: 'path',
                            description: '商品ID',
                            required: true,
                            type: 'string'
                        }
                    ]
                }
            },
            '/categories': {
                get: {
                    summary: '部門一覧取得',
                    parameters: [
                        {
                            name: 'fields',
                            in: 'query',
                            description: '検索パラメータ（カンマ区切りで指定可）',
                            required: false,
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        {
                            name: 'category_code',
                            in: 'query',
                            description: '部門コード',
                            required: false,
                            type: 'string'
                        }
                    ]
                }
            }
        }
    };
    beforeEach(function () {
        service = new api_tools_generator_js_1.ApiToolsGenerator();
        // モックデータを設定
        service.setMockApiDefinition(mockApiData);
    });
    it('should be defined', function () {
        expect(service).toBeDefined();
    });
    // ツール名生成のテスト
    describe('generateToolName', function () {
        it('should generate list name for GET collection', function () {
            expect(service.generateToolName('/products', 'GET')).toBe('listProducts');
        });
        it('should generate get name for GET single resource', function () {
            expect(service.generateToolName('/products/{productId}', 'GET')).toBe('getProduct');
        });
        it('should generate create name for POST', function () {
            expect(service.generateToolName('/products', 'POST')).toBe('createProducts');
        });
        it('should generate update name for PUT', function () {
            expect(service.generateToolName('/products/{productId}', 'PUT')).toBe('updateProductById');
        });
        it('should generate delete name for DELETE', function () {
            expect(service.generateToolName('/products/{productId}', 'DELETE')).toBe('deleteProductById');
        });
        it('should use operationId when provided', function () {
            expect(service.generateToolName('/products', 'GET', 'listAllProducts')).toBe('listAllProducts');
        });
        it('should handle complex paths', function () {
            expect(service.generateToolName('/stores/{storeId}/products', 'GET')).toBe('listProducts');
        });
    });
    // ツール生成のテスト
    describe('generateTools', function () {
        var tools;
        beforeEach(function () {
            // generateToolsメソッドの呼び出し
            tools = service.generateTools();
        });
        it('should generate tools from OpenAPI definitions', function () {
            // 少なくとも1つ以上のツールが生成されることを確認
            expect(tools.length).toBeGreaterThan(0);
        });
        it('should have correctly structured tool objects', function () {
            // 最初のツールを検証
            var tool = tools[0];
            expect(tool).toHaveProperty('name');
            expect(tool).toHaveProperty('description');
            expect(tool).toHaveProperty('parameters');
            expect(tool).toHaveProperty('path');
            expect(tool).toHaveProperty('method');
        });
        it('should include GET tools for categories endpoint', function () {
            // カテゴリ一覧取得のツールが含まれることを確認
            var categoriesGetTool = tools.find(function (tool) { return tool.path === '/categories' && tool.method === 'GET'; });
            expect(categoriesGetTool).toBeDefined();
            expect(categoriesGetTool === null || categoriesGetTool === void 0 ? void 0 : categoriesGetTool.name).toBe('listCategories');
        });
        it('should detect query parameters correctly', function () {
            // クエリパラメータを持つツールを検索
            var toolWithQueryParams = tools.find(function (tool) { return tool.parameters.some(function (param) { return param.type === 'query'; }); });
            expect(toolWithQueryParams).toBeDefined();
            // クエリパラメータの構造を確認
            var queryParam = toolWithQueryParams === null || toolWithQueryParams === void 0 ? void 0 : toolWithQueryParams.parameters.find(function (param) { return param.type === 'query'; });
            expect(queryParam).toHaveProperty('name');
            expect(queryParam).toHaveProperty('description');
            expect(queryParam).toHaveProperty('required');
            expect(queryParam).toHaveProperty('schema');
        });
        it('should detect path parameters correctly', function () {
            // モックデータには /products/{productId} のパスが含まれているため、
            // パスパラメータを持つツールは必ず存在するはず
            var toolWithPathParams = tools.find(function (tool) { return tool.parameters.some(function (param) { return param.type === 'path'; }); });
            // パスパラメータを持つツールが存在することを確認
            expect(toolWithPathParams).toBeDefined();
            expect(toolWithPathParams.path).toContain('{');
            // パスパラメータの構造を確認
            var pathParam = toolWithPathParams.parameters.find(function (param) { return param.type === 'path'; });
            expect(pathParam).toBeDefined();
            expect(pathParam).toHaveProperty('name');
            expect(pathParam).toHaveProperty('description');
            expect(pathParam).toHaveProperty('required');
            expect(pathParam).toHaveProperty('schema');
            // パスパラメータの名前と必須フラグを検証
            expect(pathParam.name).toBe('productId');
            expect(pathParam.required).toBe(true);
        });
        it('should include POST tools with body parameters', function () {
            // モックデータには POST /products が含まれているため、
            // POSTメソッドのツールは必ず存在するはず
            var postTool = tools.find(function (tool) { return tool.method === 'POST'; });
            // POSTツールが存在することを確認
            expect(postTool).toBeDefined();
            expect(postTool.path).toBe('/products');
            // ボディパラメータが含まれていることを確認
            var bodyParams = postTool.parameters.filter(function (param) { return param.type === 'body'; });
            expect(bodyParams.length).toBeGreaterThan(0);
            // product_name パラメータが存在し、必須であることを確認
            var productNameParam = bodyParams.find(function (param) { return param.name === 'product_name'; });
            expect(productNameParam).toBeDefined();
            expect(productNameParam.required).toBe(true);
        });
    });
});
