import { Collection } from "discord.js";
function removeFromArray(Array, item) {
    const index = Array.indexOf(item);
    if (index !== -1) {
        Array.splice(index, 1);
    }
}
//this will handle everything except interactionCreate Events, since those have their own special way of being found
export class EventHandlerCollection extends Collection {
    constructor(options) {
        super(options);
    }
    add(Client, Component, EventOverride) {
        var _a;
        if (Component.enabled) {
            const trigger = EventOverride || Component.trigger;
            if (!this.has(trigger)) {
                this.set(trigger, []);
                Client.on(trigger, (arg1, arg2) => {
                    var _a;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    (_a = this.get(trigger)) === null || _a === void 0 ? void 0 : _a.forEach(([name, comp]) => {
                        comp.exec(arg1, arg2);
                    });
                });
            }
            if (Component.module)
                (_a = this.get(trigger)) === null || _a === void 0 ? void 0 : _a.push([(Component.module.name), Component]);
            else
                throw new Error("Cannot register event without it being attached to a module");
        }
    }
    remove(Component, EventOverride) {
        const trigger = EventOverride || Component.trigger;
        if (!this.has(trigger)) {
            return;
        }
        if (Component.module) {
            const EventArray = this.get(trigger);
            if (EventArray)
                removeFromArray(EventArray, EventArray.find(([name, comp]) => { var _a; return name == ((_a = Component.module) === null || _a === void 0 ? void 0 : _a.name) && comp == Component; }));
        }
        else
            throw new Error("Cannot remove event without it being attached to a module");
    }
}
