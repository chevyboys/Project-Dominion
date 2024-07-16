import { Collection, Events } from "discord.js";
import { IEventHandlerCollection } from "../Types/EventHandler";
import { IEventComponent } from "../Types/Module";
import { DominionClient } from "./DominionClient";

function removeFromArray(Array: Array<unknown>, item: unknown) {
    const index = Array.indexOf(item);
    if (index !== -1) {
        Array.splice(index, 1);
    }
}
//this will handle everything except interactionCreate Events, since those have their own special way of being found
export class EventHandlerCollection extends Collection<Events, Array<[string, IEventComponent]>> implements IEventHandlerCollection {
    constructor(options?: null | Array<[Events, Array<[string, IEventComponent]>]>) {
        super(options)
    }
    add(Client: DominionClient, Component: IEventComponent, EventOverride?: Events) {
        if (Component.enabled) {
            const trigger = EventOverride || Component.trigger as Events
            if (!this.has(trigger)) {
                this.set(trigger, [])
                Client.on(trigger as Events | string, (arg1, arg2) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    this.get(trigger)?.forEach(([name, comp]) => {
                        comp.exec(arg1, arg2);
                    })
                })
            }
            if (Component.module) this.get(trigger)?.push([(Component.module.name), Component]);
            else throw new Error("Cannot register event without it being attached to a module");

        }
    }
    remove(Component: IEventComponent, EventOverride?: Events) {
        const trigger = EventOverride || Component.trigger as Events
        if (!this.has(trigger)) {
            return;
        }
        if (Component.module) {
            const EventArray = this.get(trigger)
            if (EventArray) removeFromArray(EventArray, EventArray.find(([name, comp]) => name == Component.module?.name && comp == Component));
        }
        else throw new Error("Cannot remove event without it being attached to a module");
    }
}