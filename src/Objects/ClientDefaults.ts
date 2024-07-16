import { DMChannel, GuildChannel, Message } from "discord.js";
import { DominionParseFunction, IDominionClient, IErrorHandlerFunction } from "../Types/Client.js";


export const DefaultErrorHandler: IErrorHandlerFunction = function (error, msg) {
    console.error(Date());
    if (msg instanceof Message) {
        const channelName = !(msg.channel instanceof GuildChannel) ?
            msg.channel instanceof DMChannel ?
                msg.channel.recipient :
                "Unknown Private Thread Channel" :
            msg.channel.name;
        console.error(`${msg.author.username} in ${(msg.guild ? (`${msg.guild.name} > ${channelName}`) : "DM")}: ${msg.cleanContent}`);
    } else if (msg) {
        console.error(msg);
    }
    console.error(error);
}



export const DefaultParseMessage: DominionParseFunction = (msg: Message, client: IDominionClient) => {
    //This function was provided by @gaiwecoor from Augurbot, and was updated by chevyboys
    const content = msg.content;
    const setPrefix = client.config.prefix || "!";
    if (msg.author.bot) return null;
    for (const prefix of [setPrefix, `<@${msg.client.user.id}>`, `<@!${msg.client.user.id}>`, `<@${msg.client.user.id}>`, `<@!${msg.client.user.id}>`]) {
        if (!content.startsWith(prefix)) continue;
        const trimmed = content.substr(prefix.length).trim();
        const endOfFirstWord = Math.min(...[trimmed.indexOf(" "), trimmed.indexOf("\n")].filter(index => index > -1))
        const command = trimmed.substring(0, endOfFirstWord).trim();
        const suffix = trimmed.substring(endOfFirstWord).trim();
        if (command) {
            return {
                command: command.toLowerCase(),
                suffix: suffix
            };
        }
    }
    return null;
}