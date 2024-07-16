import { Snowflake } from "discord.js";


export interface IDominionConfigOptions {
    adminIds: Array<Snowflake>; //an array of discord user snowflakes for bot administration staff
    database: object; //the database login information
    prefix?: string; //a prefix to recognize text commands
    repo?: URL | string; //a URL to the github repo for the bot
    token: string; //the token to login with
    webhooks?: Array<IWebhookConfig>; //An array of debugging webhooks
    adminServer: Snowflake
    DEBUG?: boolean //weather or not to enable Debugging mode and instant guild command registration
    smiteArray?: Array<Snowflake> //an array of people to deny permissions to in all cases
}
export interface IWebhookConfig {
    name: string;
    url: URL | string;
}

export interface IDominionConfig {
    adminIds: Array<Snowflake>; //an array of discord user snowflakes for bot administration staff
    database: object; //the database login information
    DEBUG: boolean //weather or not to enable Debugging mode and instant guild command registration
    prefix?: string; //a prefix to recognize text commands
    repo?: URL | string; //a URL to the github repo for the bot
    token: string; //the token to login with
    webhooks?: Array<IWebhookConfig>; //An array of debugging webhooks
    adminServer: Snowflake
    smiteArray: Array<Snowflake> //an array of people to deny permissions to in all cases
}