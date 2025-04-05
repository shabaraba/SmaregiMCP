"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
var os = require("os");
/**
 * Handles OAuth2 authentication with Smaregi API
 */
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.sessions = new Map();
        // Set the path for sessions file
        this.sessionsFilePath = path.join(os.homedir(), '.smaregi-mcp-sessions.json');
        // Load existing sessions
        this.loadSessions();
    }
    /**
     * Load sessions from disk
     */
    AuthService.prototype.loadSessions = function () {
        try {
            if (fs.existsSync(this.sessionsFilePath)) {
                var data = fs.readFileSync(this.sessionsFilePath, 'utf-8');
                var sessions = JSON.parse(data);
                for (var _i = 0, _a = Object.entries(sessions); _i < _a.length; _i++) {
                    var _b = _a[_i], id = _b[0], session = _b[1];
                    this.sessions.set(id, session);
                }
                console.error("[INFO] Loaded ".concat(this.sessions.size, " sessions from ").concat(this.sessionsFilePath));
            }
        }
        catch (error) {
            console.error("[ERROR] Failed to load sessions: ".concat(error));
        }
    };
    /**
     * Save sessions to disk
     */
    AuthService.prototype.saveSessions = function () {
        try {
            var sessions_1 = {};
            this.sessions.forEach(function (session, id) {
                sessions_1[id] = session;
            });
            fs.writeFileSync(this.sessionsFilePath, JSON.stringify(sessions_1, null, 2), 'utf-8');
        }
        catch (error) {
            console.error("[ERROR] Failed to save sessions: ".concat(error));
        }
    };
    /**
     * Generate a random string
     */
    AuthService.prototype.generateRandomString = function (length) {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    };
    /**
     * Generate authorization URL
     */
    AuthService.prototype.getAuthorizationUrl = function (scopes) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, verifier, challenge, session, authUrl;
            return __generator(this, function (_a) {
                sessionId = this.generateRandomString(16);
                verifier = this.generateRandomString(64);
                challenge = crypto
                    .createHash('sha256')
                    .update(verifier)
                    .digest('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=/g, '');
                session = {
                    id: sessionId,
                    scopes: scopes,
                    createdAt: new Date().toISOString(),
                    redirectUri: 'https://localhost:3000/callback',
                    verifier: verifier,
                    isAuthenticated: false
                };
                this.sessions.set(sessionId, session);
                this.saveSessions();
                authUrl = "https://smaregi.auth.example.com/authorize?client_id=mock_client_id&response_type=code&state=".concat(sessionId);
                return [2 /*return*/, {
                        url: authUrl,
                        sessionId: sessionId
                    }];
            });
        });
    };
    /**
     * Check authentication status
     */
    AuthService.prototype.checkAuthStatus = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                session = this.sessions.get(sessionId);
                if (!session) {
                    return [2 /*return*/, {
                            isAuthenticated: false,
                            sessionId: sessionId
                        }];
                }
                return [2 /*return*/, {
                        isAuthenticated: session.isAuthenticated,
                        sessionId: sessionId
                    }];
            });
        });
    };
    /**
     * Get access token for a session
     */
    AuthService.prototype.getAccessToken = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                session = this.sessions.get(sessionId);
                if (!session || !session.isAuthenticated) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, session.accessToken || null];
            });
        });
    };
    /**
     * Handle OAuth callback with code and state
     */
    AuthService.prototype.handleCallback = function (code, state) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, session;
            return __generator(this, function (_a) {
                sessionId = state;
                session = this.sessions.get(sessionId);
                if (!session) {
                    throw new Error('セッションが見つかりません。認証をやり直してください。');
                }
                // In a real implementation, we would exchange the code for tokens here
                // For mock implementation, just consider the authentication successful
                session.isAuthenticated = true;
                session.accessToken = "mock_access_token_".concat(this.generateRandomString(16));
                session.refreshToken = "mock_refresh_token_".concat(this.generateRandomString(16));
                session.expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // Expire in 1 hour
                this.sessions.set(sessionId, session);
                this.saveSessions();
                return [2 /*return*/, sessionId];
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
