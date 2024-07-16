import fs from "fs";
import path from "path";
import { Collection, Events } from "discord.js";
import { BaseInteractionComponent, DominionModule, ContextMenuCommandComponent, EventComponent, MessageCommandComponent, MessageComponentInteractionComponent, ModuleOnLoadComponent, ModuleOnUnloadComponent, ScheduleComponent, SlashCommandComponent } from "./Module";
import * as Schedule from "node-schedule";
import { EventHandlerCollection } from "./EventHandler";
function readdirSyncRecursive(Directory) {
    const Files = [];
    const commandPath = path.resolve(process.cwd(), Directory);
    fs.readdirSync(commandPath).forEach(File => {
        const Absolute = path.join(commandPath, File);
        if (fs.statSync(Absolute).isDirectory())
            return readdirSyncRecursive(Absolute);
        else
            return Files.push(Absolute);
    });
    if (Files.length == 0)
        throw new Error("No files found in " + Directory);
    else
        return Files;
}
async function registerInteractions(client, ApplicationAndContextMenuCommands) {
    var _a, _b;
    if (client.user) {
        const GlobalCommandsToRegister = ApplicationAndContextMenuCommands.filter(component => !component.guildId).map((DominionModuleComponentBaseInteraction) => DominionModuleComponentBaseInteraction.builder.toJSON());
        const GuildCommandsToRegister = new Collection();
        ApplicationAndContextMenuCommands.filter(component => component.guildId != undefined).forEach((DominionModuleComponentBaseInteraction) => {
            var _a;
            if (!GuildCommandsToRegister.has(DominionModuleComponentBaseInteraction.guildId)) {
                GuildCommandsToRegister.set(DominionModuleComponentBaseInteraction.guildId, []);
            }
            (_a = GuildCommandsToRegister.get(DominionModuleComponentBaseInteraction.guildId)) === null || _a === void 0 ? void 0 : _a.push(DominionModuleComponentBaseInteraction.builder.toJSON());
        });
        try {
            console.log(`Started refreshing ${GlobalCommandsToRegister.length} global application (/) command${GlobalCommandsToRegister.length > 1 ? 's' : ''}, and Guild commands in ${GuildCommandsToRegister.size} guild${GuildCommandsToRegister.size > 1 ? 's' : ''}.`);
            // Register all commands as guild commands in the test guild if Debug is enabled. Else, register all commands as global
            let commandData = new Collection;
            for (const [guild, value] of GuildCommandsToRegister) {
                const data = await ((_a = client.application) === null || _a === void 0 ? void 0 : _a.commands.set(value, guild));
                if (data && data.size > 0)
                    commandData = commandData.concat(data);
            }
            const data = await ((_b = client.application) === null || _b === void 0 ? void 0 : _b.commands.set(GlobalCommandsToRegister));
            if (data)
                commandData = commandData.concat(data);
            console.log(commandData);
            console.log(`Successfully reloaded ${commandData === null || commandData === void 0 ? void 0 : commandData.size} application (/) commands.`);
            return commandData;
        }
        catch (error) {
            const errorMessage = "Discord error: Could not register commands";
            if (error instanceof Error && (error === null || error === void 0 ? void 0 : error.toString().indexOf("503 Service Unavailable"))) {
                throw new Error(errorMessage);
            }
            else
                throw error;
        }
    }
}
async function resolveRegisterable(registerable) {
    if ((registerable instanceof String || typeof registerable == "string") || (Array.isArray(registerable) && registerable[0] && (typeof registerable[0] == "string" || registerable instanceof String))) {
        let possibleModules;
        if ((Array.isArray(registerable)))
            possibleModules = registerable;
        else
            possibleModules = readdirSyncRecursive(registerable);
        //once we have all possible modules, filter them for only what is acutally a module. This allows us to export different things for tests
        const modules = await Promise.all(possibleModules.filter(file => file.endsWith('.js'))
            .map(async (moduleFile) => {
            //we have to append this random bit of URL in order to bypass the import cache. For the record, this is stupid.
            return import(`${moduleFile}?update=${Date.now()}`);
        }));
        const filteredModules = [];
        for (const m of modules) {
            for (const key in m) {
                if (Object.prototype.hasOwnProperty.call(m, key)) {
                    if (m[key] instanceof DominionModule) {
                        filteredModules.push(m[key]);
                    }
                }
            }
        }
        //).filter((possibleModule) => possibleModule instanceof DominionModule);
        return filteredModules;
    }
    else if (Array.isArray(registerable)) {
        if (registerable.length < 1) {
            throw new Error("Cannot resolve empty array of Modules to registerable the Module");
        }
        else if (!(registerable[0] instanceof DominionModule)) {
            throw new Error("Cannot resolve unknown object type to registerable Module");
        }
        else
            return registerable;
    }
    else if (registerable instanceof DominionModule) {
        return [registerable];
    }
    else {
        throw new Error("Cannot resolve unknown object type to registerable object");
    }
    throw new Error("Unreachable state reached. How did you do this?");
}
export class ModuleManager extends Collection {
    constructor(DominionClient) {
        super();
        this.applicationCommands = new Collection();
        this.events = new EventHandlerCollection();
        this.messageCommands = new Collection();
        this.scheduledJobs = new Collection();
        this.ModuleManagerInitialized = false;
        this.register = async (registerable) => { return await this.registerPrivate(registerable); };
        this.client = DominionClient;
    }
    async registerPrivate(registerable, storedValues) {
        var _a, _b, _c, _d;
        let modules;
        if (!registerable) {
            modules = await resolveRegisterable(this.client.modulePath);
        }
        else {
            if (registerable instanceof DominionModule || (Array.isArray(registerable) && registerable[0] instanceof DominionModule)) {
                if (Array.isArray(registerable)) {
                    const reg = registerable.map(r => r instanceof DominionModule ? r.file : r);
                    if (reg)
                        registerable = reg;
                }
                else {
                    const reg = registerable.file;
                    if (reg)
                        registerable = reg;
                }
            }
            modules = await resolveRegisterable(registerable);
        }
        //take care of onInit functions, and register commands to discord
        for (const module of modules) {
            module.client = this.client;
            if (this.has(module.name))
                throw new Error("Module name " + module.name + " Must be unique!");
            this.set(module.name, module);
            for (const component of module.components) {
                if (component.enabled) {
                    component.module = module;
                    if (component instanceof BaseInteractionComponent) {
                        if (this.client.config.DEBUG) {
                            component.guildId = this.client.config.adminServer;
                        }
                        //ensure no collisions
                        if (this.applicationCommands.has(component.name)) {
                            let i = 0;
                            while (this.applicationCommands.has(`${component.name}${i}`)) {
                                i++;
                            }
                            this.applicationCommands.set(`${component.name}${i}`, component);
                        }
                        else
                            this.applicationCommands.set(component.name, component);
                    }
                    else if (component instanceof ModuleOnLoadComponent) {
                        component.exec(storedValues === null || storedValues === void 0 ? void 0 : storedValues.get(component.module.name));
                    }
                    else if (component instanceof EventComponent) {
                        if (component instanceof MessageCommandComponent) {
                            if (this.messageCommands.has(component.name)) {
                                throw new Error("You cannot have two message commands named " + component.name);
                            }
                            this.events.add(this.client, component);
                            this.events.add(this.client, component, Events.MessageUpdate);
                            this.messageCommands.set(component.name, component);
                        }
                        else if (!(component instanceof MessageComponentInteractionComponent)) {
                            this.events.add(this.client, component);
                        }
                    }
                    else if (component instanceof ScheduleComponent) {
                        component.job = Schedule.scheduleJob(((_a = component.module) === null || _a === void 0 ? void 0 : _a.name) || ((_b = component.module) === null || _b === void 0 ? void 0 : _b.file) || "unknown", component.chronSchedule, component.exec);
                        let i = 0;
                        while (this.scheduledJobs.has(`${(_c = component.module) === null || _c === void 0 ? void 0 : _c.name}Scheduled${i}`)) {
                            i++;
                        }
                        this.scheduledJobs.set(`${(_d = component.module) === null || _d === void 0 ? void 0 : _d.name}Scheduled${i}`, component);
                    }
                }
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await registerInteractions(this.client, this.applicationCommands.map((value, _key) => value));
        console.log("\nSuccessfully Registered " + this.events.size + " Events:");
        console.dir(this.events);
        console.log("\nSuccessfully Registered " + this.messageCommands.size + " Message Commands");
        console.dir(this.messageCommands.map((messageCommand) => {
            return {
                name: messageCommand.name,
                description: messageCommand.description,
                category: messageCommand.category,
                enabled: messageCommand.enabled,
                permissions: messageCommand.permissions,
                process: messageCommand.process
            };
        }));
        if (!this.ModuleManagerInitialized) {
            //set up interaction special handler, but only do so once each launch
            this.client.on(Events.InteractionCreate, (interaction) => {
                //Handle receiving command interactions
                //find any matching interactions
                (() => {
                    let match;
                    this.find(module => {
                        return module.components.filter(c => c.enabled).find((c) => {
                            if (((interaction.isChatInputCommand() && c instanceof SlashCommandComponent)
                                || (interaction.isContextMenuCommand() && c instanceof ContextMenuCommandComponent))
                                && interaction.commandName == c.name) {
                                match = c;
                                return true;
                            }
                            else if (interaction.isMessageComponent() && c instanceof MessageComponentInteractionComponent && c.customId(interaction["customId"])) {
                                match = c;
                                return true;
                            }
                            else
                                return false;
                        });
                    });
                    if (match !== undefined && match instanceof SlashCommandComponent || match instanceof ContextMenuCommandComponent || match instanceof MessageComponentInteractionComponent) {
                        match.exec(interaction);
                    }
                    else {
                        if (interaction.isRepliable())
                            interaction.reply("I don't know how to handle that!");
                        else
                            throw new Error("I don't know how to handle that!");
                    }
                })();
            });
            this.ModuleManagerInitialized = true;
        }
        return this;
    }
    async unregister(registerable) {
        var _a;
        let modules;
        const stored = new Collection();
        if (!registerable) {
            modules = Array.from(this.values());
        }
        else {
            modules = await resolveRegisterable(registerable);
        }
        //take care of onInit functions, and register commands to discord
        for (const module of modules) {
            const unregisterComponent = module.components.find(c => c instanceof ModuleOnUnloadComponent);
            if (unregisterComponent) {
                const result = unregisterComponent.exec(null);
                stored.set(module.name, result);
            }
            this.delete(module.name);
            for (const component of module.components) {
                if (component.enabled) {
                    if (component instanceof BaseInteractionComponent) {
                        this.applicationCommands.delete(component.name);
                    }
                    else if (component instanceof EventComponent) {
                        if (component instanceof MessageCommandComponent) {
                            this.messageCommands.delete(component.name);
                            this.events.remove(component, Events.MessageCreate);
                            this.events.remove(component, Events.MessageUpdate);
                        }
                        else if (!(component instanceof MessageComponentInteractionComponent)) {
                            this.events.remove(component);
                        }
                    }
                    else if (component instanceof ScheduleComponent) {
                        const job = (_a = this.scheduledJobs.find(j => j == component)) === null || _a === void 0 ? void 0 : _a.job;
                        if (job) {
                            job.cancel();
                        }
                    }
                }
            }
            this.scheduledJobs = this.scheduledJobs.filter(comp => { var _a; return ((_a = comp.module) === null || _a === void 0 ? void 0 : _a.name) != module.name; });
        }
        //Since the commands have been removed from this.applicationCommands, we should be able to just re-register all the commands with a set.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await registerInteractions(this.client, this.applicationCommands.map((v, k) => v));
        return stored;
    }
    async reload(registerable) {
        //toDo
        const stored = await this.unregister(registerable);
        return await (this.registerPrivate(registerable, stored));
    }
}
