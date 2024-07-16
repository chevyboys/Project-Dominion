import { IDominionConfig, IDominionConfigOptions, IWebhookConfig } from "../Types/Config.js";
import { Snowflake } from "discord.js";




export class DominionConfig implements IDominionConfig {
    adminIds: Array<Snowflake>; //an array of discord user snowflakes for bot administration staff
    database: object; //the database login information
    prefix: string; //a prefix to recognize text commands
    repo?: URL | string; //a URL to the github repo for the bot
    token: string; //the token to login with
    webhooks?: Array<IWebhookConfig>; //An array of debugging webhooks
    adminServer: Snowflake
    DEBUG: boolean //weather or not to enable Debugging mode and instant guild command registration
    smiteArray: Array<Snowflake>
    constructor(options: IDominionConfigOptions) {
        this.adminIds = options.adminIds;
        this.database = options.database;
        this.prefix = options.prefix || "!";
        this.repo = options.repo;
        this.token = options.token;
        this.webhooks = options.webhooks;
        this.adminServer = options.adminServer;
        this.DEBUG = options.DEBUG || false;
        this.smiteArray = options.smiteArray || [];
    }
}