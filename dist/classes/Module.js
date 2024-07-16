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
    constructor(BaseInteractionComponentOptions) {
        var _a;
        super(BaseInteractionComponentOptions);
        this.name = BaseInteractionComponentOptions.builder.name;
        //description is implimented in child classes, we only impliment here as a fallback
        this.description = "";
        this.builder = BaseInteractionComponentOptions.builder;
        this.category = BaseInteractionComponentOptions.category || ((_a = this.module) === null || _a === void 0 ? void 0 : _a.file) || "General";
        this.guildId = BaseInteractionComponentOptions.guildId;
        this.permissions = BaseInteractionComponentOptions.permissions;
        this.exec = async (interaction) => {
            var _a, _b, _c;
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
            else if (!this.bypassSmite && ((_a = this.module) === null || _a === void 0 ? void 0 : _a.client) instanceof DominionClient && ((_b = this.module) === null || _b === void 0 ? void 0 : _b.client.config.smiteArray.includes(interaction.user.id))) {
                if (interaction.isRepliable()) {
                    interaction.reply({ content: "This feature is unavailable to you.", ephemeral: true });
                    return smiteLog(interaction.user.id, this.module.name, "Interaction", this.name);
                }
                else
                    return "Nothing to be done";
            }
            else if (((_c = this.module) === null || _c === void 0 ? void 0 : _c.client) instanceof DominionClient)
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
    constructor(ContextMenuCommandComponentOptions) {
        super(ContextMenuCommandComponentOptions);
        this.description = ContextMenuCommandComponentOptions.description || "";
        this.builder = ContextMenuCommandComponentOptions.builder;
    }
}
//--------------------------------------------------------------------------
//event handler
export class EventComponent extends BaseComponent {
    constructor(EventComponentOptions) {
        super(EventComponentOptions);
        this.trigger = EventComponentOptions.trigger;
        this.bypassSmite = EventComponentOptions.bypassSmite || false;
        this.process = EventComponentOptions.process;
        this.guildId = EventComponentOptions.guildId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.exec = (arg1, arg2, arg3) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            const args = [arg1, arg2, arg3];
            const argFinder = Array.isArray(args) ? args : [args];
            for (const arg of argFinder) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof arg === 'object' && (((_b = (_a = arg) === null || _a === void 0 ? void 0 : _a.member) === null || _b === void 0 ? void 0 : _b.id) || ((_d = (_c = arg) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id) || ((_e = arg.author) === null || _e === void 0 ? void 0 : _e.id) || ((_f = arg) === null || _f === void 0 ? void 0 : _f.id))) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const id = ((_h = (_g = arg) === null || _g === void 0 ? void 0 : _g.member) === null || _h === void 0 ? void 0 : _h.id) || ((_k = (_j = arg) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.id) || ((_l = arg.author) === null || _l === void 0 ? void 0 : _l.id) || ((_m = arg) === null || _m === void 0 ? void 0 : _m.id);
                    if (((_o = this.module) === null || _o === void 0 ? void 0 : _o.client) instanceof DominionClient && ((_p = this.module) === null || _p === void 0 ? void 0 : _p.client.config.smiteArray.includes(id))) {
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
    constructor(MessageComponentInteractionComponentOptions) {
        super(MessageComponentInteractionComponentOptions);
        this.trigger = Events.InteractionCreate;
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
            var _a, _b, _c, _d, _e;
            if (!(((_a = this.module) === null || _a === void 0 ? void 0 : _a.client) instanceof DominionClient))
                throw new Error("Invalid Client");
            if (!(interaction instanceof ChatInputCommandInteraction ||
                interaction instanceof MessageContextMenuCommandInteraction ||
                interaction instanceof UserContextMenuCommandInteraction ||
                interaction instanceof AutocompleteInteraction)) {
                if (!this.customId(interaction.customId))
                    return;
                const id = ((_b = interaction === null || interaction === void 0 ? void 0 : interaction.member) === null || _b === void 0 ? void 0 : _b.user.id) || ((_c = interaction === null || interaction === void 0 ? void 0 : interaction.user) === null || _c === void 0 ? void 0 : _c.id);
                if (id) {
                    if (((_d = this.module) === null || _d === void 0 ? void 0 : _d.client) instanceof DominionClient && ((_e = this.module) === null || _e === void 0 ? void 0 : _e.client.config.smiteArray.includes(id))) {
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
    constructor(ScheduleComponentOptions) {
        super(ScheduleComponentOptions);
        this.chronSchedule = ScheduleComponentOptions.chronSchedule;
        this.exec = (date) => {
            var _a;
            if (((_a = this.module) === null || _a === void 0 ? void 0 : _a.client) instanceof DominionClient)
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
    constructor(MessageCommandOptions) {
        super(MessageCommandOptions);
        this.bypassSmite = false;
        this.enabled = true;
        this.bypassSmite = MessageCommandOptions.bypassSmite || false;
        this.enabled = MessageCommandOptions.enabled || true;
        this.trigger = Events.MessageCreate;
        this.name = MessageCommandOptions.name;
        this.description = MessageCommandOptions.description;
        this.category = MessageCommandOptions.category || path.basename(__filename);
        this.permissions = MessageCommandOptions.permissions;
        this.process = MessageCommandOptions.process;
        this.exec = async (message) => {
            var _a, _b, _c;
            if (!this.enabled)
                return "disabled";
            if (((_a = this.module) === null || _a === void 0 ? void 0 : _a.client) && ((_b = this.module) === null || _b === void 0 ? void 0 : _b.client) instanceof DominionClient) {
                if (!this.bypassSmite && this.module.client.config.smiteArray.includes(message.author.id)) {
                    return smiteLog(message.author.id, this.module.name, this.trigger, this.name);
                }
                const parsed = this.module.client.parser(message, this.module.client);
                if (parsed && parsed.command == this.name) {
                    if (((_c = this.module) === null || _c === void 0 ? void 0 : _c.client) instanceof DominionClient)
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
