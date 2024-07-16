import { Events, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, AutocompleteInteraction } from "discord.js";
import { DominionClient } from "./DominionClient";
import path from "path";
import { fileURLToPath } from "url";
function smiteLog(triggeringUserId, ModuleName, ComponentType, ComponentName) {
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
 *  import { DominionModule } from "chironbot"
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
export class DominionModule {
    /**
     * The name of the module. Used for logging and debugging, and for tracking registered modules
     * @name DominionModule#name
     */
    name;
    components;
    client;
    file;
    constructor(ModuleOptions) {
        const __filename = fileURLToPath(import.meta.url);
        const fileName = path.basename(__filename);
        if (ModuleOptions.client instanceof DominionClient) {
            this.client = ModuleOptions.client;
        }
        this.file = __filename;
        this.name = ModuleOptions.name || fileName;
        this.components = ModuleOptions.components.map(component => {
            component.module = this;
            return component;
        });
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
export class BaseComponent {
    enabled;
    bypassSmite;
    process;
    module;
    guildId;
    exec;
    feature;
    constructor(BaseComponentOptions) {
        this.feature = BaseComponentOptions.feature;
        this.bypassSmite = BaseComponentOptions.bypassSmite || false;
        this.enabled = BaseComponentOptions.enabled;
        this.process = BaseComponentOptions.process;
        this.guildId = BaseComponentOptions.guildId;
        if (BaseComponentOptions.module)
            this.module = BaseComponentOptions.module;
        this.exec = this.process;
    }
}
//--------------------------------------------------------------------------
//------------------- Base Interact Component ------------------------------
// The base for all other Interaction Components
export class BaseInteractionComponent extends BaseComponent {
    name; //derived from the builder
    description; //derived from the builder if not directly defined
    builder; //Contains our name and description, and is the builder for our interaction;
    category;
    permissions; // a function that receives an interaction and returns if the function is allowed to be executed
    guildId;
    constructor(BaseInteractionComponentOptions) {
        super(BaseInteractionComponentOptions);
        this.name = BaseInteractionComponentOptions.builder.name;
        //description is implimented in child classes, we only impliment here as a fallback
        this.description = "";
        this.builder = BaseInteractionComponentOptions.builder;
        this.category = BaseInteractionComponentOptions.category || this.module?.file || "General";
        this.guildId = BaseInteractionComponentOptions.guildId;
        this.permissions = BaseInteractionComponentOptions.permissions;
        this.exec = async (interaction) => {
            if (!interaction.isCommand() || interaction.commandName != this.name)
                return;
            if (this.guildId && !interaction.commandGuildId || interaction.commandGuildId != this.guildId)
                return;
            if (!this.enabled || !(await this.permissions(interaction))) {
                if (interaction.isRepliable())
                    interaction.reply({ content: "I'm sorry, but you aren't allowed to do that.", ephemeral: true });
                console.log("I'm sorry," + this.name + "is restricted behind a permissions lock");
                return "I'm sorry, This feature is restricted behind a permissions lock";
            }
            else if (!this.bypassSmite && this.module?.client instanceof DominionClient && this.module?.client.config.smiteArray.includes(interaction.user.id)) {
                if (interaction.isRepliable()) {
                    interaction.reply({ content: "This feature is unavailable to you.", ephemeral: true });
                    return smiteLog(interaction.user.id, this.module.name, "Interaction", this.name);
                }
                else
                    return "Nothing to be done";
            }
            else if (this.module?.client instanceof DominionClient)
                return this.process(interaction);
            else
                throw new Error("Invalid Client");
        };
    }
}
//--------------------------------------------------------------------------
//------------------- Slash Command Component ------------------------------
// Slash command Component
export class SlashCommandComponent extends BaseInteractionComponent {
    builder; //Contains our name and description, and is the builder for our interaction;
    constructor(SlashCommandComponentOptions) {
        super(SlashCommandComponentOptions);
        this.description = SlashCommandComponentOptions.description || SlashCommandComponentOptions.builder.description || "";
        this.builder = SlashCommandComponentOptions.builder;
    }
}
//--------------------------------------------------------------------------
//------------------- Context Menu Command Component ------------------------------
// The base for all other Interaction Components
export class ContextMenuCommandComponent extends BaseInteractionComponent {
    builder; //Contains our name and description
    description;
    constructor(ContextMenuCommandComponentOptions) {
        super(ContextMenuCommandComponentOptions);
        this.description = ContextMenuCommandComponentOptions.description || "";
        this.builder = ContextMenuCommandComponentOptions.builder;
    }
}
//--------------------------------------------------------------------------
//event handler
export class EventComponent extends BaseComponent {
    bypassSmite;
    trigger;
    process;
    constructor(EventComponentOptions) {
        super(EventComponentOptions);
        this.trigger = EventComponentOptions.trigger;
        this.bypassSmite = EventComponentOptions.bypassSmite || false;
        this.process = EventComponentOptions.process;
        this.guildId = EventComponentOptions.guildId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.exec = (arg1, arg2, arg3) => {
            const args = [arg1, arg2, arg3];
            const argFinder = Array.isArray(args) ? args : [args];
            for (const arg of argFinder) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof arg === 'object' && (arg?.member?.id || arg?.user?.id || arg.author?.id || arg?.id)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const id = arg?.member?.id || arg?.user?.id || arg.author?.id || arg?.id;
                    if (this.module?.client instanceof DominionClient && this.module?.client.config.smiteArray.includes(id)) {
                        console.warn("Smite System Blocked Event Triggered by " + id);
                        return "Smite System Blocked Event Triggered by " + id;
                    }
                }
            }
        };
    }
}
//-------------------------------------------------------------------------
// Message Component interaction
export class MessageComponentInteractionComponent extends EventComponent {
    customId;
    process;
    permissions;
    trigger = Events.InteractionCreate;
    constructor(MessageComponentInteractionComponentOptions) {
        super(MessageComponentInteractionComponentOptions);
        this.permissions = MessageComponentInteractionComponentOptions.permissions || (() => true);
        this.trigger = Events.InteractionCreate;
        this.process = MessageComponentInteractionComponentOptions.process;
        this.customId = (string) => {
            if (typeof MessageComponentInteractionComponentOptions.customId == "function") {
                return MessageComponentInteractionComponentOptions.customId(string);
            }
            else {
                return string == MessageComponentInteractionComponentOptions.customId;
            }
        };
        this.exec = async (interaction) => {
            if (!(this.module?.client instanceof DominionClient))
                throw new Error("Invalid Client");
            if (!(interaction instanceof ChatInputCommandInteraction ||
                interaction instanceof MessageContextMenuCommandInteraction ||
                interaction instanceof UserContextMenuCommandInteraction ||
                interaction instanceof AutocompleteInteraction)) {
                if (!this.customId(interaction.customId))
                    return;
                const id = interaction?.member?.user.id || interaction?.user?.id;
                if (id) {
                    if (this.module?.client instanceof DominionClient && this.module?.client.config.smiteArray.includes(id)) {
                        interaction.reply({ ephemeral: true, content: "I'm sorry, I can't do that for you. (Response code SM173)" });
                        return "Smite System Blocked Event Triggered by " + id;
                    }
                    if (!(await this.permissions(interaction))) {
                        interaction.reply({ content: "You are not authorized to do that", ephemeral: true });
                        return "User " + id + " was not authorized to trigger event " + this.trigger;
                    }
                }
                return this.process(interaction);
            }
        };
    }
}
//--------------------------------------------------------------------------
//------------------------ Schedule Components ----------------------------
export class ScheduleComponent extends BaseComponent {
    chronSchedule; //the number of seconds to wait between refresh intervals
    job;
    exec;
    constructor(ScheduleComponentOptions) {
        super(ScheduleComponentOptions);
        this.chronSchedule = ScheduleComponentOptions.chronSchedule;
        this.exec = (date) => {
            if (this.module?.client instanceof DominionClient)
                return this.process(date);
            else
                throw new Error("Invalid Client");
        };
    }
}
//-------------------------------------------------------------------------
//---------------- Module Loading and unloading components ----------------
export class ModuleOnLoadComponent extends BaseComponent {
}
export class ModuleOnUnloadComponent extends BaseComponent {
}
//-------------------------------------------------------------------------
//------------------ Message Command --------------------------------------
export class MessageCommandComponent extends EventComponent {
    name;
    description;
    category;
    trigger;
    permissions; // a function that receives an interaction and returns if the function is allowed to be executed
    process;
    bypassSmite = false;
    enabled = true;
    exec;
    constructor(MessageCommandOptions) {
        super(MessageCommandOptions);
        this.bypassSmite = MessageCommandOptions.bypassSmite || false;
        this.enabled = MessageCommandOptions.enabled || true;
        this.trigger = Events.MessageCreate;
        this.name = MessageCommandOptions.name;
        this.description = MessageCommandOptions.description;
        this.category = MessageCommandOptions.category || path.basename(__filename);
        this.permissions = MessageCommandOptions.permissions;
        this.process = MessageCommandOptions.process;
        this.exec = async (message) => {
            if (!this.enabled)
                return "disabled";
            if (this.module?.client && this.module?.client instanceof DominionClient) {
                if (!this.bypassSmite && this.module.client.config.smiteArray.includes(message.author.id)) {
                    return smiteLog(message.author.id, this.module.name, this.trigger, this.name);
                }
                const parsed = this.module.client.parser(message, this.module.client);
                if (parsed && parsed.command == this.name) {
                    if (this.module?.client instanceof DominionClient)
                        return await this.process(message, parsed.suffix);
                    else
                        throw new Error("Invalid Client");
                }
                else
                    return "Not a command";
            }
            else
                throw new Error("No Client found. Make sure your Client.modules.register() is after Client.login()");
        };
    }
}
