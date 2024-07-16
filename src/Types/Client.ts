import { Interaction, Message } from "discord.js";
import { HexColorString, Client, ClientOptions } from "discord.js";
import { IModuleManager } from "./ModuleManager";
import { IDominionConfig } from "./Config";

export interface IDominionClientOptions extends ClientOptions {
    config: IDominionConfig
    color: HexColorString; //the color the bot should default to
    modulePath: string | Array<string>,
    /**
     * the function that will be called when an error occurs. If not provied, a default will be used
     * it is recommended to not use async functions as error event handlers. See the Node.js docs  for details.
     * https://nodejs.org/api/events.html#capture-rejections-of-promises
     */
    errorHandler?: IErrorHandlerFunction
    parser?: DominionParseFunction
}

export interface IDominionClient extends Client {
    config: IDominionConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    /**
     * the function that will be called when an error occurs. If not provied, a default will be used
     * it is recommended to not use async functions as error event handlers. See the Node.js docs  for details.
     * https://nodejs.org/api/events.html#capture-rejections-of-promises
     */
    errorHandler?: IErrorHandlerFunction
    modules: IModuleManager
    parser: DominionParseFunction
}

/**
     * the function that will be called when an error occurs. If not provied, a default will be used
     * it is recommended to not use async functions as error event handlers. See the Node.js docs  for details.
     * https://nodejs.org/api/events.html#capture-rejections-of-promises
     */
export interface IErrorHandlerFunction {
    (error: Error, msg: Message | Interaction | string): unknown
}

export interface DominionParsedContent {
    command: string,
    suffix: string,
}

export interface DominionParseFunction {
    (msg: Message, client: IDominionClient): DominionParsedContent | null
}
