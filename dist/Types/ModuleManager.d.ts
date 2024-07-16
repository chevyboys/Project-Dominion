import { Client, Collection } from "discord.js";
import { IEventHandlerCollection } from "./EventHandler.js";
import { IBaseInteractionComponent, IDominionModule, IMessageCommandComponent, IScheduleComponent } from "./Module.js";
export interface IModuleManager extends Collection<string, IDominionModule> {
    client: Client;
    applicationCommands: Collection<string, IBaseInteractionComponent>;
    events: IEventHandlerCollection;
    messageCommands: Collection<string, IMessageCommandComponent>;
    scheduledJobs: Collection<string, IScheduleComponent>;
    register: IModuleManagerRegisterFunction;
    unregister: IModuleManagerRegisterFunction;
    reload: IModuleManagerRegisterFunction;
}
export interface IModuleManagerRegisterFunction {
    (registerable?: IModuleManagerRegisterable): Promise<Collection<string, object>>;
}
export type IModuleManagerRegisterable = Array<IDominionModule> | IDominionModule | string | Array<string> | null;
