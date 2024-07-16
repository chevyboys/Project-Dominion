import { Collection, Events } from "discord.js";
import { IEventHandlerCollection } from "../Types/EventHandler";
import { IEventComponent } from "../Types/Module";
import { DominionClient } from "./DominionClient";
export declare class EventHandlerCollection extends Collection<Events, Array<[string, IEventComponent]>> implements IEventHandlerCollection {
    constructor(options?: null | Array<[Events, Array<[string, IEventComponent]>]>);
    add(Client: DominionClient, Component: IEventComponent, EventOverride?: Events): void;
    remove(Component: IEventComponent, EventOverride?: Events): void;
}
