import { SlashCommandBuilder, ContextMenuCommandBuilder, Interaction, Events, Message, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, AutocompleteInteraction, Snowflake } from "discord.js";
import { customIdFunction, IBaseComponent, IBaseComponentOptions, IBaseExecFunction, IBaseInteractionComponent, IBaseInteractionComponentOption, IBaseProcessFunction, IDominionModule, IDominionModuleOptions, IScheduleComponent, IContextMenuCommandComponent, IContextMenuCommandComponentOptions, IEventComponent, IEventComponentOptions, IEventProcessFunction, IInteractionPermissionsFunction, IInteractionProcessFunction, IMessageCommandComponent, IMessageCommandComponentOptions, IMessageCommandPermissionsFunction, IMessageCommandProcessFunction, IMessageComponentInteractionComponent, IMessageComponentInteractionComponentOptions, IModuleOnLoadComponent, ISlashCommandComponent, ISlashCommandComponentOptions, IScheduleComponentOptions, ISlashCommandInteractionProcessFunction } from "../Types/Module";
import { DominionClient } from "./DominionClient.js";
import path from "path"
import * as Schedule from 'node-schedule';

import { fileURLToPath } from "url";
import { EventArgument1, EventArgument2, EventArgument3 } from "../Types/EventHandler.js";

function smiteLog(triggeringUserId: Snowflake, ModuleName: string, ComponentType: string, ComponentName: string) {
    const string = `${ModuleName} ${ComponentType} ${ComponentName} did not run because ${triggeringUserId} was hit by a divine smite`;
    console.log(string);
    return string;
}



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
export class DominionModule implements IDominionModule {
    /**
     * The name of the module. Used for logging and debugging, and for tracking registered modules
     * @name DominionModule#name
     */
    public readonly name: string;
    public readonly components: Array<IBaseComponent>;
    public readonly client?: DominionClient;
    public readonly file?: string

    constructor(ModuleOptions: IDominionModuleOptions) {
        const __filename = fileURLToPath(import.meta.url);
        const fileName = path.basename(__filename);
        if (ModuleOptions.client instanceof DominionClient) {
            this.client = ModuleOptions.client;
        }
        this.file = __filename
        this.name = ModuleOptions.name || fileName;
        this.components = ModuleOptions.components.map(component => {
            component.module = this
            return component;
        }
        )
    }
}

/* ------------------------------------------------------------------------------------------------------
 * ----------------- Component Classes ---------------------------------------------------------------
 */

//------------------- Base Component ------------------------------
// All components are derived from this
/**
 * @classdesc The base class for all components
 */
export class BaseComponent implements IBaseComponent {
    readonly enabled: boolean;
    readonly bypassSmite: boolean;
    readonly process: IBaseProcessFunction;
    module?: IDominionModule;
    guildId?: Snowflake | Array<Snowflake>;
    exec: IBaseExecFunction;
    feature?: string;

    constructor(BaseComponentOptions: IBaseComponentOptions) {
        this.feature = BaseComponentOptions.feature;
        this.bypassSmite = BaseComponentOptions.bypassSmite || false;
        this.enabled = BaseComponentOptions.enabled;
        this.process = BaseComponentOptions.process;
        this.guildId = BaseComponentOptions.guildId;
        if (BaseComponentOptions.module)
            this.module = BaseComponentOptions.module;
        this.exec = this.process

    }
}


//--------------------------------------------------------------------------
//------------------- Base Interact Component ------------------------------
// The base for all other Interaction Components

export class BaseInteractionComponent extends BaseComponent implements IBaseInteractionComponent {
    readonly name: string; //derived from the builder
    description: string; //derived from the builder if not directly defined
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder //Contains our name and description, and is the builder for our interaction;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction // a function that receives an interaction and returns if the function is allowed to be executed
    guildId?: Snowflake | Array<Snowflake>;

    constructor(BaseInteractionComponentOptions: IBaseInteractionComponentOption) {
        super(BaseInteractionComponentOptions)
        this.name = BaseInteractionComponentOptions.builder.name;
        //description is implemented in child classes, we only implement here as a fallback
        this.description = "";
        this.builder = BaseInteractionComponentOptions.builder;
        this.category = BaseInteractionComponentOptions.category || this.module?.file || "General";
        this.guildId = BaseInteractionComponentOptions.guildId;
        this.permissions = BaseInteractionComponentOptions.permissions;
        this.exec = async (interaction: Interaction) => {
            if (!interaction.isCommand() || interaction.commandName != this.name) return;
            if (this.guildId && !interaction.commandGuildId || interaction.commandGuildId != this.guildId) return;
            if (!this.enabled || !(await this.permissions(interaction))) {
                if (interaction.isRepliable()) interaction.reply({ content: "I'm sorry, but you aren't allowed to do that.", ephemeral: true });
                console.log("I'm sorry," + this.name + "is restricted behind a permissions lock");
                return "I'm sorry, This feature is restricted behind a permissions lock"
            }
            else if (!this.bypassSmite && this.module?.client instanceof DominionClient && this.module?.client.config.smiteArray.includes(interaction.user.id)) {
                if (interaction.isRepliable()) {
                    interaction.reply({ content: "This feature is unavailable to you.", ephemeral: true });
                    return smiteLog(interaction.user.id, this.module.name, "Interaction", this.name)
                } else return "Nothing to be done"
            } else if (this.module?.client instanceof DominionClient)
                return this.process(interaction);
            else throw new Error("Invalid Client");

        }
    }

}

//--------------------------------------------------------------------------
//------------------- Slash Command Component ------------------------------
// Slash command Component
export class SlashCommandComponent extends BaseInteractionComponent implements ISlashCommandComponent {
    readonly builder: SlashCommandBuilder  //Contains our name and description, and is the builder for our interaction;
    readonly process: ISlashCommandInteractionProcessFunction;
    constructor(SlashCommandComponentOptions: ISlashCommandComponentOptions) {
        super(SlashCommandComponentOptions)
        this.description = SlashCommandComponentOptions.description || SlashCommandComponentOptions.builder.description || "";
        this.builder = SlashCommandComponentOptions.builder;
        this.process = SlashCommandComponentOptions.process;
    }
}

//--------------------------------------------------------------------------
//------------------- Context Menu Command Component ------------------------------
// The base for all other Interaction Components


export class ContextMenuCommandComponent extends BaseInteractionComponent implements IContextMenuCommandComponent {
    readonly builder: ContextMenuCommandBuilder //Contains our name and description
    readonly description: string

    constructor(ContextMenuCommandComponentOptions: IContextMenuCommandComponentOptions) {
        super(ContextMenuCommandComponentOptions)
        this.description = ContextMenuCommandComponentOptions.description || "";
        this.builder = ContextMenuCommandComponentOptions.builder;
    }
}

//--------------------------------------------------------------------------
//event handler


export class EventComponent extends BaseComponent implements IEventComponent {
    bypassSmite: boolean;
    trigger: Events | string
    process: IEventProcessFunction
    constructor(EventComponentOptions: IEventComponentOptions) {
        super(EventComponentOptions)
        this.trigger = EventComponentOptions.trigger;
        this.bypassSmite = EventComponentOptions.bypassSmite || false;
        this.process = EventComponentOptions.process;
        this.guildId = EventComponentOptions.guildId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        this.exec = (arg1: EventArgument1, arg2: EventArgument2, arg3: EventArgument3) => {
            const args = [arg1, arg2, arg3] as [EventArgument1, EventArgument2, EventArgument3];
            const argFinder = Array.isArray(args) ? args : [args];
            for (const arg of argFinder) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof arg === 'object' && ((arg as any)?.member?.id || (arg as any)?.user?.id || (arg as any).author?.id || (arg as any)?.id)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const id = (arg as any)?.member?.id || (arg as any)?.user?.id || (arg as any).author?.id || (arg as any)?.id;
                    if (this.module?.client instanceof DominionClient && this.module?.client.config.smiteArray.includes(id)) {
                        console.warn("Smite System Blocked Event Triggered by " + id);
                        return "Smite System Blocked Event Triggered by " + id;
                    }


                }
            }
        }
    }

}

//-------------------------------------------------------------------------
// Message Component interaction

export class MessageComponentInteractionComponent extends EventComponent implements IMessageComponentInteractionComponent {
    customId: customIdFunction;
    process: IInteractionProcessFunction;
    permissions: IInteractionPermissionsFunction;
    trigger = Events.InteractionCreate;
    constructor(MessageComponentInteractionComponentOptions: IMessageComponentInteractionComponentOptions) {
        MessageComponentInteractionComponentOptions.trigger = Events.InteractionCreate;
        super(MessageComponentInteractionComponentOptions)
        this.permissions = MessageComponentInteractionComponentOptions.permissions || (() => true);
        this.trigger = Events.InteractionCreate;
        this.process = MessageComponentInteractionComponentOptions.process
        this.customId = (string: string) => {
            if (typeof MessageComponentInteractionComponentOptions.customId == "function") {
                return MessageComponentInteractionComponentOptions.customId(string)
            } else {
                return string == MessageComponentInteractionComponentOptions.customId;
            }
        }
        this.exec = async (interaction: Interaction) => {
            if (!(this.module?.client instanceof DominionClient)) throw new Error("Invalid Client");
            if (!(interaction instanceof ChatInputCommandInteraction ||
                interaction instanceof MessageContextMenuCommandInteraction ||
                interaction instanceof UserContextMenuCommandInteraction ||
                interaction instanceof AutocompleteInteraction
            )) {
                if (!this.customId(interaction.customId)) return;
                const id = interaction?.member?.user.id || interaction?.user?.id;
                if (id) {
                    if (this.module?.client instanceof DominionClient && this.module?.client.config.smiteArray.includes(id)) {
                        interaction.reply({ ephemeral: true, content: "I'm sorry, I can't do that for you. (Response code SM173)" })
                        return "Smite System Blocked Event Triggered by " + id;
                    }
                    if (!(await this.permissions(interaction))) {
                        interaction.reply({ content: "You are not authorized to do that", ephemeral: true })
                        return "User " + id + " was not authorized to trigger event " + this.trigger;
                    }
                }
                return this.process(interaction)
            }

        }
    }
}

//--------------------------------------------------------------------------
//------------------------ Schedule Components ----------------------------


export class ScheduleComponent extends BaseComponent implements IScheduleComponent {
    readonly chronSchedule: string //the number of seconds to wait between refresh intervals
    job?: Schedule.Job;
    exec: Schedule.JobCallback;
    constructor(ScheduleComponentOptions: IScheduleComponentOptions) {
        super(ScheduleComponentOptions)
        this.chronSchedule = ScheduleComponentOptions.chronSchedule
        this.exec = (date: Date) => {
            if (this.module?.client instanceof DominionClient)
                return this.process(date)
            else throw new Error("Invalid Client");
        }


    }
}

//-------------------------------------------------------------------------
//---------------- Module Loading and unloading components ----------------

export class ModuleOnLoadComponent extends BaseComponent implements IModuleOnLoadComponent {

}

export class ModuleOnUnloadComponent extends BaseComponent {

}

//-------------------------------------------------------------------------
//------------------ Message Command --------------------------------------
export class MessageCommandComponent extends EventComponent implements IMessageCommandComponent {
    readonly name: string;
    readonly description: string;
    readonly category: string;
    trigger: Events.MessageCreate;
    readonly permissions: IMessageCommandPermissionsFunction // a function that receives an interaction and returns if the function is allowed to be executed
    process: IMessageCommandProcessFunction;
    bypassSmite = false;
    enabled = true;
    exec: IBaseExecFunction;
    constructor(MessageCommandOptions: IMessageCommandComponentOptions) {
        MessageCommandOptions.trigger = Events.MessageCreate;
        super(MessageCommandOptions)
        this.bypassSmite = MessageCommandOptions.bypassSmite || false;
        this.enabled = MessageCommandOptions.enabled || true;
        this.trigger = Events.MessageCreate;
        this.name = MessageCommandOptions.name;
        this.description = MessageCommandOptions.description;
        this.category = MessageCommandOptions.category || path.basename(__filename);
        this.permissions = MessageCommandOptions.permissions
        this.process = MessageCommandOptions.process
        this.exec = async (message: Message) => {
            if (!this.enabled) return "disabled";
            if (this.module?.client && this.module?.client instanceof DominionClient) {
                if (!this.bypassSmite && this.module.client.config.smiteArray.includes(message.author.id)) {
                    return smiteLog(message.author.id, this.module.name, this.trigger, this.name);
                }
                const parsed = this.module.client.parser(message, this.module.client);
                if (parsed && parsed.command == this.name) {
                    if (this.module?.client instanceof DominionClient)
                        return await this.process(message, parsed.suffix)
                    else throw new Error("Invalid Client");
                }
                else return "Not a command";
            }
            else throw new Error("No Client found. Make sure your Client.modules.register() is after Client.login()");
        }
    }


}