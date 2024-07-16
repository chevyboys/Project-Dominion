"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DominionClient = void 0;
const discord_js_1 = require("discord.js");
const ModuleManager_1 = require("./ModuleManager");
const ClientDefaults_1 = require("../Objects/ClientDefaults");
const schedule = __importStar(require("node-schedule"));
async function gracefulShutdown(client) {
    await client.modules.unregister();
    return await schedule.gracefulShutdown();
}
class DominionClient extends discord_js_1.Client {
    /**
     *
     * @param DominionClientOptions The options for the client
     * @example
     * const client = new DominionClient({
     * modulePath: "dist/modules"
     * color: "#FF0000",
     * config: {
     *  prefix: "!",
     *  token: "abc123",
     *  adminIds: ["1234567890"],
     *  database: {},
     *  repo: "https://github.com/chevyboys/chiron",
     *  webhooks: [{name: "test", url: "https://discord.com/api/webhooks/1234567890/abc123"}],
     *  adminServer: "1234567890",
     *  DEBUG: false,
     *  smiteArray: ["1234567890", "abc123"]
     * }
     * });
     */
    constructor(DominionClientOptions) {
        super(DominionClientOptions);
        this.config = DominionClientOptions.config;
        this.color = DominionClientOptions.color;
        this.modulePath = DominionClientOptions.modulePath;
        this.errorHandler = DominionClientOptions.errorHandler || ClientDefaults_1.DefaultErrorHandler;
        this.parser = DominionClientOptions.parser || ClientDefaults_1.DefaultParseMessage;
        this.modules = new ModuleManager_1.ModuleManager(this);
        process.on('SIGTERM', async () => {
            await gracefulShutdown(this);
            process.exit(0);
        });
        process.on("beforeExit", async () => {
            await gracefulShutdown(this);
            process.exit(0);
        });
        process.on('SIGINT', async () => {
            await gracefulShutdown(this);
            process.exit(0);
        });
    }
}
exports.DominionClient = DominionClient;
