import { IDominionModule } from "../Types/Module";
import { IModuleManager, IModuleManagerRegisterable } from "../Types/ModuleManager";
import { IDominionClient } from "../Types/Client";
import { Collection } from "discord.js";
import { BaseInteractionComponent, MessageCommandComponent, ScheduleComponent } from "./Module";
import { EventHandlerCollection } from "./EventHandler";
export declare class ModuleManager extends Collection<string, IDominionModule> implements IModuleManager {
    client: IDominionClient;
    applicationCommands: Collection<string, BaseInteractionComponent>;
    events: EventHandlerCollection;
    messageCommands: Collection<string, MessageCommandComponent>;
    scheduledJobs: Collection<string, ScheduleComponent>;
    private ModuleManagerInitialized;
    constructor(DominionClient: IDominionClient);
    register: (registerable?: IModuleManagerRegisterable) => Promise<IModuleManager>;
    private registerPrivate;
    unregister(registerable?: IModuleManagerRegisterable): Promise<Collection<string, object>>;
    reload(registerable?: IModuleManagerRegisterable): Promise<IModuleManager>;
}
