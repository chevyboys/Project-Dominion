import { SlashCommandBuilder, ContextMenuCommandBuilder, Events, Snowflake } from "discord.js";
import { customIdFunction, IBaseComponent, IBaseComponentOptions, IBaseExecFunction, IBaseInteractionComponent, IBaseInteractionComponentOption, IBaseProcessFunction, IDominionModule, IDominionModuleOptions, IScheduleComponent, IContextMenuCommandComponent, IContextMenuCommandComponentOptions, IEventComponent, IEventComponentOptions, IEventProcessFunction, IInteractionPermissionsFunction, IInteractionProcessFunction, IMessageCommandComponent, IMessageCommandComponentOptions, IMessageCommandPermissionsFunction, IMessageCommandProcessFunction, IMessageComponentInteractionComponent, IMessageComponentInteractionComponentOptions, IModuleOnLoadComponent, ISlashCommandComponent, ISlashCommandComponentOptions, IScheduleComponentOptions, ISlashCommandInteractionProcessFunction } from "../Types/Module";
import { DominionClient } from "./DominionClient";
import * as Schedule from 'node-schedule';
/**
 * @classdesc The base class for all modules`
 * @class DominionModule
 * @implements {IDominionModule}
 * @param {IDominionModuleOptions} ModuleOptions - The options for the module
 * @param {string} ModuleOptions.name - The name of the module. It *MUST* be unique.
 * @param {Array<IBaseComponent>} ModuleOptions.components - The components of the module
 * @param {DominionClient} [ModuleOptions.client] - The client of the module
 * @param {string} [ModuleOptions.file] - The file the module is located in
 * @example
 *  import { DominionModule } from "project-dominion"
 *  export default const module = new DominionModule({
 *    name: "Example Module",
 *    components: [
 *       new SlashCommandComponent({
 *          builder: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
 *          enabled: true,
 *          process: (interaction) => {
 *             interaction.isRepliable() ? interaction.reply("Pong!") : console.error("could not reply");
 *         }
 *    })
 * ]
 * })
 *
 *
 */
export declare class DominionModule implements IDominionModule {
    /**
     * The name of the module. Used for logging and debugging, and for tracking registered modules
     * @name DominionModule#name
     */
    readonly name: string;
    readonly components: Array<IBaseComponent>;
    readonly client?: DominionClient;
    readonly file?: string;
    constructor(ModuleOptions: IDominionModuleOptions);
}
/**
 * @classdesc The base class for all components
 */
export declare class BaseComponent implements IBaseComponent {
    readonly enabled: boolean;
    readonly bypassSmite: boolean;
    readonly process: IBaseProcessFunction;
    module?: IDominionModule;
    guildId?: Snowflake | Array<Snowflake>;
    exec: IBaseExecFunction;
    feature?: string;
    constructor(BaseComponentOptions: IBaseComponentOptions);
}
export declare class BaseInteractionComponent extends BaseComponent implements IBaseInteractionComponent {
    readonly name: string;
    description: string;
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction;
    guildId?: Snowflake | Array<Snowflake>;
    constructor(BaseInteractionComponentOptions: IBaseInteractionComponentOption);
}
export declare class SlashCommandComponent extends BaseInteractionComponent implements ISlashCommandComponent {
    readonly builder: SlashCommandBuilder;
    readonly process: ISlashCommandInteractionProcessFunction;
    constructor(SlashCommandComponentOptions: ISlashCommandComponentOptions);
}
export declare class ContextMenuCommandComponent extends BaseInteractionComponent implements IContextMenuCommandComponent {
    readonly builder: ContextMenuCommandBuilder;
    readonly description: string;
    constructor(ContextMenuCommandComponentOptions: IContextMenuCommandComponentOptions);
}
export declare class EventComponent extends BaseComponent implements IEventComponent {
    bypassSmite: boolean;
    trigger: Events | string;
    process: IEventProcessFunction;
    constructor(EventComponentOptions: IEventComponentOptions);
}
export declare class MessageComponentInteractionComponent extends EventComponent implements IMessageComponentInteractionComponent {
    customId: customIdFunction;
    process: IInteractionProcessFunction;
    permissions: IInteractionPermissionsFunction;
    trigger: Events;
    constructor(MessageComponentInteractionComponentOptions: IMessageComponentInteractionComponentOptions);
}
export declare class ScheduleComponent extends BaseComponent implements IScheduleComponent {
    readonly chronSchedule: string;
    job?: Schedule.Job;
    exec: Schedule.JobCallback;
    constructor(ScheduleComponentOptions: IScheduleComponentOptions);
}
export declare class ModuleOnLoadComponent extends BaseComponent implements IModuleOnLoadComponent {
}
export declare class ModuleOnUnloadComponent extends BaseComponent {
}
export declare class MessageCommandComponent extends EventComponent implements IMessageCommandComponent {
    readonly name: string;
    readonly description: string;
    readonly category: string;
    trigger: Events.MessageCreate;
    readonly permissions: IMessageCommandPermissionsFunction;
    process: IMessageCommandProcessFunction;
    bypassSmite: boolean;
    enabled: boolean;
    exec: IBaseExecFunction;
    constructor(MessageCommandOptions: IMessageCommandComponentOptions);
}
