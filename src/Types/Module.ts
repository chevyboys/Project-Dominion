/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client, CommandInteraction, ContextMenuCommandBuilder, Events, Interaction, Message, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, Snowflake } from "discord.js";
import * as Schedule from "node-schedule";
import { EventArgument1, EventArgument2, EventArgument3 } from "./EventHandler";

export interface IDominionModuleOptions {
    readonly name?: string
    readonly file?: string
    components: Array<IBaseComponent>
    client?: Client
}

export interface IDominionModule {
    readonly name: string
    file?: string
    components: Array<IBaseComponent>
    client?: Client
}

/* ------------------------------------------------------------------------------------------------------
 * ----------------- Component Interfaces ---------------------------------------------------------------
 */

//------------------- Base Component ------------------------------
// All components are derived from this

export interface IBaseComponentOptions {
    readonly enabled: boolean
    readonly process: IBaseProcessFunction
    readonly guildId?: Snowflake | Array<Snowflake>;
    readonly bypassSmite?: boolean;
    module?: IDominionModule
    feature?: string;
}

export interface IBaseComponent {
    readonly bypassSmite: boolean;
    readonly enabled: boolean;
    readonly process: IBaseProcessFunction;
    readonly guildId?: Snowflake | Array<Snowflake>;
    readonly feature?: string;
    module?: IDominionModule;
    exec: IBaseExecFunction; //added by the component manager
}

export interface IBaseProcessFunction {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (input: any | EventArgument1, input2?: any | EventArgument2, extraForEvents?: EventArgument3): any
}

export interface IBaseExecFunction extends IBaseProcessFunction {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (input: any | EventArgument1, InvokerId?: Snowflake | EventArgument2, extraForEvents?: EventArgument3 | null): any
}

//--------------------------------------------------------------------------
//------------------- Base Interact Component ------------------------------
// The base for all other Interaction Components

export interface IBaseInteractionComponentOption extends IBaseComponentOptions {
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder    //Contains our name and description, and is the builder for our interaction
    readonly description?: string
    readonly category: string
    readonly guildId?: Snowflake | Array<Snowflake>; //only set if you want to restrict the component's process function to a single guild
    readonly permissions: IInteractionPermissionsFunction //A function that receives an interaction object, and returns if the interaction user can do it
    readonly process: IInteractionProcessFunction;
}

export interface IBaseInteractionComponent extends IBaseComponent {
    readonly name: string; //derived from the builder
    readonly description: string; //derived from the builder if not directly defined
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction // a function that receives an interaction and returns if the function is allowed to be executed
    readonly guildId?: Snowflake | Array<Snowflake>; //only set if it's a guild application command
    process: IInteractionProcessFunction;
}

export interface IInteractionPermissionsFunction {
    (interaction: Interaction): boolean | Promise<boolean>
}

export interface IInteractionProcessFunction extends IEventProcessFunction {
    (interaction: Interaction): any
}

//--------------------------------------------------------------------------
//------------------- Slash Command Component ------------------------------
// Slash command Component
export interface ISlashCommandComponentOptions extends IBaseInteractionComponentOption {
    readonly builder: SlashCommandBuilder  //Contains our name and description

}

export interface ISlashCommandComponent extends IBaseInteractionComponent {
    readonly builder: SlashCommandBuilder;
    readonly process: ISlashCommandInteractionProcessFunction;
}

export interface ISlashCommandInteractionProcessFunction extends IInteractionProcessFunction {
    (interaction: CommandInteraction): any
}

//--------------------------------------------------------------------------
//------------------- Context Menu Command Component ------------------------------
// The base for all other Interaction Components
export interface IContextMenuCommandComponentOptions extends IBaseInteractionComponentOption {
    readonly builder: ContextMenuCommandBuilder //Contains our name and description
    readonly description: string
}


export interface IContextMenuCommandComponent extends IBaseInteractionComponent {
    readonly builder: ContextMenuCommandBuilder //Contains our name and description
    readonly description: string
}

//--------------------------------------------------------------------------
//event handler
export interface IEventComponentOptions extends IBaseComponentOptions {
    readonly trigger: Events | string
    process: IEventProcessFunction | IMessageCommandProcessFunction
}

export interface IEventComponent extends IBaseComponent {
    readonly trigger: Events | string
    process: IEventProcessFunction | IMessageCommandProcessFunction
}



export interface IEventProcessFunction {
    (args: [EventArgument1, EventArgument2, EventArgument3]): any
}


//--------------------------------------------------------------------------
// ------------------------- message component interaction -----------------

export interface IMessageComponentInteractionComponentOptions extends IEventComponentOptions {
    customId: string | customIdFunction;
    permissions: IInteractionPermissionsFunction;
    process: IInteractionProcessFunction
}

export interface IMessageComponentInteractionComponent extends IEventComponent {
    customId: string | customIdFunction;
    permissions: IInteractionPermissionsFunction;
    process: IInteractionProcessFunction;
}

export interface customIdFunction {
    (interactionCustomId: string): boolean;
}

//--------------------------------------------------------------------------
//------------------------ Schedule Components ----------------------------
export interface IScheduleComponentOptions extends IBaseComponentOptions {
    readonly chronSchedule: string //the number of seconds to wait between refresh intervals
    readonly process: IScheduleProcessFunction
}

export interface IScheduleComponent extends IBaseComponent {
    job?: Schedule.Job; //build by constructor
    process: IScheduleProcessFunction
    readonly chronSchedule: string //the number of seconds to wait between refresh intervals
}

export interface IScheduleProcessFunction extends IBaseProcessFunction {
    (fireDate: Date): object | void
    //the Date is the date the event is supposed to fire.
}

//-------------------------------------------------------------------------
//---------------- Module Loading and unloading components ----------------
export type IModuleOnLoadComponentOptions = IBaseComponentOptions

export type IModuleOnUnloadComponentOptions = IBaseComponentOptions

export type IModuleOnLoadComponent = IBaseComponent

export type IModuleOnUnloadComponent = IBaseComponent

//-------------------------------------------------------------------------
// ------------------ Message Command Handler ---------------------------
export interface IMessageCommandComponentOptions extends IEventComponentOptions {
    trigger: string | Events;
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly permissions: IMessageCommandPermissionsFunction // a function that receives an message and returns if the function is allowed to be executed
    process: IMessageCommandProcessFunction;

}

export interface IMessageCommandComponent extends IEventComponent {
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly permissions: IMessageCommandPermissionsFunction // a function that receives an message and returns if the function is allowed to be executed
    process: IMessageCommandProcessFunction;
}

export interface IMessageCommandProcessFunction extends IBaseProcessFunction {
    (msg: Message, suffix: string): any;
}
export interface IMessageCommandPermissionsFunction {
    (msg: Message): any;
}