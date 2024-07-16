import { IBaseComponent, IBaseInteractionComponent, IDominionModule } from "../Types/Module.js";
import { IModuleManager, IModuleManagerRegisterable } from "../Types/ModuleManager.js";
import fs from "fs";
import path from "path";
import { IDominionClient } from "../Types/Client.js";
import { ApplicationCommand, Collection, Events, Interaction, RESTPostAPIChatInputApplicationCommandsJSONBody, RESTPostAPIContextMenuApplicationCommandsJSONBody, Snowflake } from "discord.js";
import { BaseInteractionComponent, DominionModule, ContextMenuCommandComponent, EventComponent, MessageCommandComponent, MessageComponentInteractionComponent, ModuleOnLoadComponent, ModuleOnUnloadComponent, ScheduleComponent, SlashCommandComponent } from "./Module.js";
import * as Schedule from "node-schedule";
import { EventHandlerCollection } from "./EventHandler.js";




function readdirSyncRecursive(Directory: string): Array<string> {
    const Files: Array<string> = [];
    const commandPath = path.resolve(process.cwd(), Directory)
    fs.readdirSync(commandPath).forEach(File => {
        const Absolute = path.join(commandPath, File);
        if (fs.statSync(Absolute).isDirectory()) return readdirSyncRecursive(Absolute);
        else return Files.push(Absolute);
    });
    if (Files.length == 0)
        throw new Error("No files found in " + Directory);
    else return Files;

}

async function registerInteractions(client: IDominionClient, ApplicationAndContextMenuCommands: Array<IBaseInteractionComponent>) {
    if (client.user) {
        const GlobalCommandsToRegister = ApplicationAndContextMenuCommands.filter(component => !component.guildId).map((DominionModuleComponentBaseInteraction) => DominionModuleComponentBaseInteraction.builder.toJSON());
        const GuildCommandsToRegister: Collection<string, Array<RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody>> = new Collection()
        ApplicationAndContextMenuCommands.filter(component => component.guildId != undefined).forEach((DominionModuleComponentBaseInteraction) => {
            if (!GuildCommandsToRegister.has(DominionModuleComponentBaseInteraction.guildId as string)) { GuildCommandsToRegister.set(DominionModuleComponentBaseInteraction.guildId as string, []) }
            GuildCommandsToRegister.get(DominionModuleComponentBaseInteraction.guildId as string)?.push(DominionModuleComponentBaseInteraction.builder.toJSON())
        }
        );

        try {
            console.log(`Started refreshing ${GlobalCommandsToRegister.length} global application (/) command${GlobalCommandsToRegister.length > 1 ? 's' : ''}, and Guild commands in ${GuildCommandsToRegister.size} guild${GuildCommandsToRegister.size > 1 ? 's' : ''}.`);
            // Register all commands as guild commands in the test guild if Debug is enabled. Else, register all commands as global
            let commandData: Collection<Snowflake, ApplicationCommand> = new Collection;

            for (const [guild, value] of GuildCommandsToRegister) {
                const data = await client.application?.commands.set(value, guild)
                if (data && data.size > 0) commandData = commandData.concat(data);
            }
            const data = await client.application?.commands.set(GlobalCommandsToRegister)
            if (data) commandData = commandData.concat(data);
            console.log(commandData)
            console.log(`Successfully reloaded ${commandData?.size} application (/) commands.`);

            return commandData;
        } catch (error) {
            const errorMessage = "Discord error: Could not register commands";
            if (error instanceof Error && error?.toString().indexOf("503 Service Unavailable")) {
                throw new Error(errorMessage);
            }
            else throw error;
        }
    }
}
async function resolveRegisterable(registerable: IModuleManagerRegisterable): Promise<Array<IDominionModule>> {
    if ((registerable instanceof String || typeof registerable == "string") || (Array.isArray(registerable) && registerable[0] && (typeof registerable[0] == "string" || registerable instanceof String))) {

        let possibleModules;
        if ((Array.isArray(registerable))) possibleModules = registerable as string[];
        else possibleModules = readdirSyncRecursive(registerable as unknown as string)
        //once we have all possible modules, filter them for only what is acutally a module. This allows us to export different things for tests
        const modules = await Promise.all(possibleModules.filter(file => file.endsWith('.js'))
            .map(async (moduleFile) => {
                //we have to append this random bit of URL in order to bypass the import cache. For the record, this is stupid.
                return import(`${moduleFile}?update=${Date.now()}`);
            }))
        const filteredModules: Array<IDominionModule> = [];
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

    } else if (Array.isArray(registerable)) {
        if (registerable.length < 1) {
            throw new Error("Cannot resolve empty array of Modules to registerable the Module");
        }
        else if (!(registerable[0] instanceof DominionModule)) {
            throw new Error("Cannot resolve unknown object type to registerable Module");
        }
        else return registerable as DominionModule[];
    } else if (registerable instanceof DominionModule) {
        return [registerable]
    }
    else {
        throw new Error("Cannot resolve unknown object type to registerable object");


    }
    throw new Error("Unreachable state reached. How did you do this?");
}

export class ModuleManager extends Collection<string, IDominionModule> implements IModuleManager {
    client: IDominionClient;
    applicationCommands: Collection<string, BaseInteractionComponent> = new Collection();
    events: EventHandlerCollection = new EventHandlerCollection();
    messageCommands: Collection<string, MessageCommandComponent> = new Collection();
    scheduledJobs: Collection<string, ScheduleComponent> = new Collection();
    private ModuleManagerInitialized = false;


    constructor(DominionClient: IDominionClient) {
        super()
        this.client = DominionClient
    }


    public register = async (registerable?: IModuleManagerRegisterable) => { return await this.registerPrivate(registerable) }
    private async registerPrivate(registerable?: IModuleManagerRegisterable, storedValues?: Collection<string, object>): Promise<IModuleManager> {
        let modules: Array<IDominionModule>;
        if (!registerable) {
            modules = await resolveRegisterable(this.client.modulePath as unknown as IModuleManagerRegisterable)
        } else {
            if (registerable instanceof DominionModule || (Array.isArray(registerable) && registerable[0] instanceof DominionModule)) {
                if (Array.isArray(registerable)) {
                    const reg = registerable.map(r => r instanceof DominionModule ? r.file : r);
                    if (reg) registerable = reg as DominionModule[] | string[];
                }
                else {
                    const reg = registerable.file;
                    if (reg) registerable = reg;
                }
            }
            modules = await resolveRegisterable(registerable)
        }

        //take care of onInit functions, and register commands to discord


        for (const module of modules) {
            module.client = this.client;
            if (this.has(module.name)) throw new Error("Module name " + module.name + " Must be unique!");
            this.set(module.name, module)
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
                                i++
                            }
                            this.applicationCommands.set(`${component.name}${i}`, component);
                        } else this.applicationCommands.set(component.name, component);


                    } else if (component instanceof ModuleOnLoadComponent) {
                        component.exec(storedValues?.get(component.module.name));
                    } else if (component instanceof EventComponent) {
                        if (component instanceof MessageCommandComponent) {
                            if (this.messageCommands.has(component.name)) {
                                throw new Error("You cannot have two message commands named " + component.name)
                            }
                            this.events.add(this.client, component)
                            this.events.add(this.client, component, Events.MessageUpdate)
                            this.messageCommands.set(component.name, component);
                        } else if (!(component instanceof MessageComponentInteractionComponent)) {
                            this.events.add(this.client, component);
                        }
                    }
                    else if (component instanceof ScheduleComponent) {
                        component.job = Schedule.scheduleJob(component.module?.name || component.module?.file || "unknown", component.chronSchedule, component.exec)
                        let i = 0;
                        while (this.scheduledJobs.has(`${component.module?.name}Scheduled${i}`)) {
                            i++;
                        }
                        this.scheduledJobs.set(`${component.module?.name}Scheduled${i}`, component);

                    }
                }


            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await registerInteractions(this.client, this.applicationCommands.map((value, _key) =>
            value
        ));
        console.log("\nSuccessfully Registered " + this.events.size + " Events:");
        console.dir(this.events)
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
        }))


        if (!this.ModuleManagerInitialized) {
            //set up interaction special handler, but only do so once each launch
            this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
                //Handle receiving command interactions

                //find any matching interactions
                (() => {
                    let match: IBaseComponent | undefined;
                    this.find(module => {
                        return module.components.filter(c => c.enabled).find((c) => {
                            if (
                                (
                                    (interaction.isChatInputCommand() && c instanceof SlashCommandComponent)
                                    || (interaction.isContextMenuCommand() && c instanceof ContextMenuCommandComponent)
                                )
                                && interaction.commandName == c.name
                            ) {
                                match = c;

                                return true;
                            } else if (interaction.isMessageComponent() && c instanceof MessageComponentInteractionComponent && c.customId(interaction["customId"])) {
                                match = c;
                                return true;
                            }
                            else return false;
                        })
                    })
                    if (match !== undefined && match instanceof SlashCommandComponent || match instanceof ContextMenuCommandComponent || match instanceof MessageComponentInteractionComponent) { match.exec(interaction); }
                    else {
                        if (interaction.isRepliable()) interaction.reply("I don't know how to handle that!")
                        else throw new Error("I don't know how to handle that!");
                    }
                })()



            })
            this.ModuleManagerInitialized = true;
        }

        return this;
    }
    async unregister(registerable?: IModuleManagerRegisterable) {
        let modules: Array<IDominionModule>;
        const stored: Collection<string, object> = new Collection()
        if (!registerable) {
            modules = Array.from(this.values())
        } else {
            modules = await resolveRegisterable(registerable)
        }

        //take care of onInit functions, and register commands to discord


        for (const module of modules) {
            const unregisterComponent = module.components.find(c => c instanceof ModuleOnUnloadComponent)
            if (unregisterComponent) {
                const result = unregisterComponent.exec(null);
                stored.set(module.name, result)
            }
            this.delete(module.name);
            for (const component of module.components) {
                if (component.enabled) {
                    if (component instanceof BaseInteractionComponent) {
                        this.applicationCommands.delete(component.name);
                    } else if (component instanceof EventComponent) {
                        if (component instanceof MessageCommandComponent) {
                            this.messageCommands.delete(component.name);
                            this.events.remove(component, Events.MessageCreate);
                            this.events.remove(component, Events.MessageUpdate);
                        } else if (!(component instanceof MessageComponentInteractionComponent)) {
                            this.events.remove(component);
                        }
                    }
                    else if (component instanceof ScheduleComponent) {
                        const job = this.scheduledJobs.find(j => j == component)?.job;
                        if (job) {
                            job.cancel();
                        }

                    }
                }


            }
            this.scheduledJobs = this.scheduledJobs.filter(comp => comp.module?.name != module.name)
        }
        //Since the commands have been removed from this.applicationCommands, we should be able to just re-register all the commands with a set.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await registerInteractions(this.client, this.applicationCommands.map((v, k) => v));

        return stored;
    }
    async reload(registerable?: IModuleManagerRegisterable): Promise<IModuleManager> {
        //toDo

        const stored = await this.unregister(registerable);
        return await (this.registerPrivate(registerable, stored));
    }

}