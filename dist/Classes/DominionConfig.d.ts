import { IDominionConfig, IDominionConfigOptions, IWebhookConfig } from "../Types/Config";
import { Snowflake } from "discord.js";
export declare class DominionConfig implements IDominionConfig {
    adminIds: Array<Snowflake>;
    database: object;
    prefix: string;
    repo?: URL | string;
    token: string;
    webhooks?: Array<IWebhookConfig>;
    adminServer: Snowflake;
    DEBUG: boolean;
    smiteArray: Array<Snowflake>;
    constructor(options: IDominionConfigOptions);
}
