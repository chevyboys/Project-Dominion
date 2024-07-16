import { Client } from "discord.js";
import { ModuleManager } from "./ModuleManager";
import { DefaultErrorHandler, DefaultParseMessage } from "../Objects/ClientDefaults";
import * as schedule from "node-schedule";
async function gracefulShutdown(client) {
    await client.modules.unregister();
    return await schedule.gracefulShutdown();
}
export class DominionClient extends Client {
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
     *  permissions: () => {return true}
     * }
     * });
     */
    constructor(DominionClientOptions) {
        super(DominionClientOptions);
        this.config = DominionClientOptions.config;
        this.color = DominionClientOptions.color;
        this.modulePath = DominionClientOptions.modulePath;
        this.errorHandler = DominionClientOptions.errorHandler || DefaultErrorHandler;
        this.parser = DominionClientOptions.parser || DefaultParseMessage;
        this.modules = new ModuleManager(this);
        this.permissions = DominionClientOptions.permissions || (() => { return true; });
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
