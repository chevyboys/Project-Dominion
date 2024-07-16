## Dominion - Discord bot framework

Dominion is a Discord bot framework, utilizing the `discord.js` library.
The npm version "project-dominion" is the "Stable" version of the framework. For the alpha channel, install "chevyboys/dominion"
For a basic example bot, take a look at https://github.com/chevyboys/Corrigation

### Change Log

We're still in Alpha, so changes are frequent. See the github for more details.

### Installation

`npm install --save project-dominion discord.js node-schedule && npm i --save-dev @types/node-schedule`

---

## The Dominion Client

Within your base file, import { `DominionConfig`, `DominionClient` } from `project-dominion`(or `Dominion` if you are using the beta branch) and create a new instance of `DominionClient`:

```
import { `DominionConfig`, `DominionClient` } from `project-dominion`
import { configOptions } from "YOUR_CONFIG_TYPESCRIPT_FILE"

const config = new DominionConfig(configOptions)
const client = new DominionClient(options);

client.login();
```

The DominionClient will create the Discord Client, listen for events, and process commands. Any gateway intents must be provided in the intents member of your client options.
Some Suggested default options:

```
const client = new DominionClient({
    config: config,
    color: "#FFFFFF",
    modulePath: "dist/modules",
    partials: [Partials.User, Partials.Message, Partials.Reaction],
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    smiteArray: []
});
```

### The `options` Object extends Discord.ClientOptions

The `options` object includes:

- `color`: The default color the bot should use. Any hex color should work

- `config`: A configuration object containing per instance data. See below

- `modulePath` (string): A directory, relative to the base file, containing any command modules you wish to load. This will only load modules that are DominionModules, are exported under the name "Module", or "Command", but it will search recursively through all folder in the base folder to find more modules.

- `errorHandler`: An optional function accepting `error` and `message` as its arguments. This will replace the default error handling function.

- `parser` (async function): An asynchronous function accepting `message` as its argument, returning an object with `command` and `suffix` properties. This will replace the default parsing function. (Useful in case different servers use different prefixes, for example.)

- `Discord Client options`: Any discord client options

### The `config` Object

Minimum required properties in `config` include:

- `adminIds` (array): An array of discord snowflakes corresponding to people who should be able to administrate the bot
- `database` (object): An object containing your database model, if any. If none, setting this to an empty object is fine
- `token` (string): the token your bot will need to login.
  CAUTION: This is VERY sensitive. Treat it with the same care you would treat your own discord password. Anyone with this can login as your bot and do anything they want with it.
- `adminServer`: The place slash commands should be registered as guild commands in debug mode (for instant registration and testing)

Additional optional properties include:

- `DEBUG` (boolean): Weather or not to switch to debugging mode, which will register guild commands to your admin server instead of global commands (global commands can take a few hours to appear for clients, guild commands are instantaneous). defaults to false.
- `prefix` (string): A default prefix for text commands. Defaults to `!`. Pinging the bot will work in place of a prefix

- `token` (string): Your bot's Discord token to log in. If provided in the `config` object, it does not need to be passed when `client.login()` is called. If omitted, it _must_ be passed with `client.login(token)` when logging in.

- `repo` (string|url): the repository where you can find your bot. Defaults to none

- `webhooks` (array): an array of webhook url's that you want to have access to in your various modules. (best practice is to put most webhooks in some form of database, but this is here if you need it.)

- `smiteArray` (Array of Snowflakes): An array of discord user snowflakes that the bot will attempt to ignore for all interactions and events. Good for punishing people who abuse the bot, or letting someone opt out of all bot features

### DominionClient Properties

Properties of the DominionClient class:

- `config` (object): The config object passed to the client upon initialization.

- `modules` (extends Collection):

  A Collection of all known modules, keyed by module name.

  - `client` (DominionClient): The client.
  - `applicationCommands` A Collection of all registered slash and context menu Commands, keyed by command name (with numerical identifiers added in case of collisions). Commands that are not enabled are not included
  - `events`: A collection of event component arrays. Each array is keyed to the event that triggers it. The bot then only needs to register one handler per event type, rather than many. Message Commands are stored in both the MessageUpdate and MessageCreate arrays in this collection. Events does NOT include interaction handlers (They have separate registration requirements). Events that are not enabled are not included.
  - `messageCommands`: A collection of message commands, keyed by message command name. Message Commands that are disabled are not included
  - `scheduledJobs`: A collection of enabled jobs scheduled, keyed by a string in the following pattern "[Job Module Name]Scheduled[Job Id]". Job Ids are determined at run time and are not static
  - `register(IModuleManagerRegisterable)` (function): Registers all modules. It needs an Array of Modules, A module, or a relative directory in a string. If the argument is left empty, it defaults to the client module path
  - `unregister(IModuleManagerRegisterable)` (function): unregister a given module, or unregister all modules if no arguments are provided. Returns the results of any ModuleOnUnloadComponent components in a collection keyed by the module name.
  - `reload(IModuleManagerRegisterable)` (function): unregister, then re-registers each module, taking the output of each ModuleOnUnloadComponent component, and passing it into the corresponding ModuleOnLoadComponent Component. NOTE: Because import() caching is stupid, only your module files themselves will be updated, everything else will use a cached version created at start up. There's not a good way around this, so just be mindful of it as you update

### DominionClient Methods

Methods of the DominionClient class:

- `errorHandler(error, message)`: Error handling function.

- `parse(message)`: Parse a message into its command name and suffix. Returns an object containing `command` (string) and `suffix` (string).

---

## Command File Structure

The basic file structure:

```
import { DominionModule, MessageCommandComponent, SlashCommandComponent } from "project-dominion";
import { SlashCommandBuilder, Message } from "discord.js";


export const Module = new DominionModule({
    name: "hello world",
    components: [
        new SlashCommandComponent({
            builder: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
            enabled: true,
            category: "main",
            permissions: (interaction) => { return true },
            process: (interaction) => {
                interaction.isRepliable() ? interaction.reply("Pong!") : console.error("could not reply");
            }
        }),
        new MessageCommandComponent({
            name: "hello",
            description: "replies with 'world'",
            category: "main",
            enabled: true,
            permissions: (msg) => true,
            process: (msg: Message, suffix: string) => {
                msg.reply("world! " + suffix)
                return "";
            }
        }),
    ]

})
```

In between, you can add one or more commands and event handlers, as well as schedule and unload components.

`Module` properties include:

- `name`: The friendly name of the Module, which must be unique. If not provided, it will default to the file name of the file the module is based in.

- `client`: The Dominion client which loaded the command module.

- `components`: (Array) an array of Components the module owns

- `file`: (string) The name of the file this module is based in

### Components

The `new [ComponentClass]()` method defines a new bot Component.

### `Slash Commands`

```
new SlashCommandComponent({
    builder: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    enabled: true,
    category: "main",
    guildId?: "" //Optional, if added, this will only be registered to a specific guild
    permissions: (interaction) => { return true },
    process: (interaction) => {
        interaction.isRepliable() ? interaction.reply("Pong!") : console.error("could not reply");
    }
})
```

`builder`: A Discord Slash Command Builder with at least the name and description
`enabled`: (boolean) weather or not the command should be processed or registered (disabling it will unregister it with discord)
`category`: (string) the command category, for your use
`guildId`: (Snowflake) the id of the guild to register this to. The command will be global if this is left out
`permissions`: (Function) a function that receives an interaction, and returns true if the interaction has permission to be executed, or false if not.
`process`: (Function) a function that takes in an interaction.

### Text Commands

```
new MessageCommandComponent({
    name: "hello",
    description: "replies with 'world'",
    category: "main",
    enabled: true,
    permissions: (msg) => true,
    process: (msg, suffix) => {
        msg.reply("world! " + suffix);
        return "";
    }
});

```

- `name` (string): Required. A string for the name of the command.
- `process` (function): Required. The function to run when the command is invoked. This accepts (message, suffix); a `Discord.Message` object and a `suffix` string of the remainder of the command supplied by the user.
- `category` (string): A category name, for convenience in organizing commands.
- `description` (string): A short string for a brief overview of the command.
- `enabled` (boolean): Whether the command is able to run. Defaults to `true`.
- `permissions` (function): A function used to determine whether the user has permission to run the command. Accepts a `Discord.Message` object.

### Events

```
new EventComponent({
    trigger: Events.MessageReactionAdd,
    enabled: true,
    process: async (MessageReaction: MessageReaction, user: User) => {
        await MessageReaction.react();
    }
})

```

- `trigger` (Discord Client Events Enum Instance): The Event that triggers this.
- `enabled` (boolean): If this trigger should be enabled.
- `process` (The function to run when the trigger is invoked. It receives whatever the discord client gives on that event).

### Context Menu Interactions

```
new ContextMenuCommandComponent(
    {
        builder: new ContextMenuCommandBuilder().setName("Hello World").setType(ApplicationCommandType.Message),
        description: "Replies 'Hello World!' to any message it is used on",
        category: "general",
        enabled: true,
        guildId: null
        permissions: (interaction) => { return true },
        process(interaction) {
            if (interaction instanceof MessageContextMenuCommandInteraction) {
                interaction.reply("Hello World!")
            }
        }
    }
)

```

- `builder`: A Discord Context Menu Builder.
- `description`: a string for you to describe it by.
- `category` (string): A category name, for convenience in organizing commands.
- `enabled`: (boolean) weather or not the command should be processed or registered (disabling it will unregister it with discord)
- `permissions` (function): A function used to determine whether the user has permission to run the command. Accepts a `Discord.Interaction` object.
- `process` (function): A function that is run when the Context Menu Command of the appropriate name is called.
- `guildId`: (Snowflake) the id of the guild to register this to. The command will be global if this is left out.

### Message Component Interactions

```
import { MessageComponentInteractionComponent, SlashCommandComponent } from "Dominion";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, SlashCommandBuilder } from "discord.js";
export const HelloWorldMessageComponentInteraction = new MessageComponentInteractionComponent({
    customId: (id) => id == "exampleid",
    enabled: true,
    permissions: (interaction) => true;
    process(interaction) {
        if (interaction instanceof ButtonInteraction) {
            interaction.reply({ content: "You pushed me!", ephemeral: true });
        }
    }
});
```

- `customId`: A function that receives a customId string, and returns true if this is the correct processing file for it. Note: it's easy to accidentally include something you don't want to, so be careful and as restrictive as possible
- `enabled`: (boolean) weather or not the command should be processed; (If set to false, previously built buttons using the same customId as this function may stop working!)
- `process` (function): A function that is run when the Context Menu Command of the appropriate name is called.
- `permissions` (function): A function used to determine whether the user has permission to run the command. Accepts a `Discord.Interaction` object.

### Schedule Component

This component refers to a task that follows Chron scheduling. (see https://www.npmjs.com/package/node-schedule)
It can run every few minutes, or once every few months. You can specify specific dates or otherwise do crazy fun things with it.

```
new ScheduleComponent({
    chronSchedule: '0 * * * * *',
    /*
        *    *    *    *    *    *
        ┬    ┬    ┬    ┬    ┬    ┬
        │    │    │    │    │    │
        │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
        │    │    │    │    └───── month (1 - 12)
        │    │    │    └────────── day of month (1 - 31)
        │    │    └─────────────── hour (0 - 23)
        │    └──────────────────── minute (0 - 59)
        └───────────────────────── second (0 - 59, OPTIONAL)
    */
    enabled: true,
    process: async (date) => {
        if (HelloWorldScheduleComponent.module?.client instanceof DominionClient) {
            //YOUR CODE HERE
            //Example code, says hi in a channel named general, or fall back to any other channel the bot can talk in every minute
            const guildId = HelloWorldScheduleComponent.module.client.config.adminServer;
            const guildObject = await HelloWorldScheduleComponent.module.client.guilds.fetch(guildId);
            const botMember = guildObject?.members.me;
            const messageableChannels = guildObject?.channels.cache.filter(c => c.type != ChannelType.GuildCategory && c.permissionsFor(botMember ? botMember : guildObject.roles.everyone).has(PermissionFlagsBits.SendMessages));
            const channel = messageableChannels.find(c => c.name.toLowerCase().indexOf('general') > -1) || messageableChannels.first();
            if (channel) {
                channel.send("Hello World!");
                console.log("Hello World!");
            }
            else {
                console.log("Hello world! (I couldn't find a channel to send that in)");
            }
            //End Example Code
        }
        else
            throw new Error("Invalid Client");
    }
});
```

- `chronSchedule`: a string that can be parsed as a chron schedule
- `enabled`: If this should be run
- `process`: a function that can receive a date object

### Module On Load Component

Only one of these components is allowed per module. When the component is initially registered to the client (before slash command registration), this function will be called.
It will receive either undefined, or the return value from the module's On Unload Component (if the module was just reloaded by the moduleManager.reload() function)

```
new ModuleOnLoadComponent({
    enabled: true,
    process: (input) => {
        console.log(input || "initialized");
        //outputs "initialized" when starting up, or the result of the unload component otherwise
    }
})
```

- `enabled`: If this should be run
- `process`: a function that can receive an object from the return of an unload function

### Module On Unload Component

Only one of these components is allowed per module.
When reloading the file using moduleManager.reload(), this return value of this function will be passed to the OnLoadComponent if it exists

```
new ModuleOnUnloadComponent({
    enabled: true,
    process: () => {
        console.log("unloading");
        return "Reloaded";
    }
})
```

- `enabled`: If this should be run
- `process`: a function that can receive an object from the return of an unload function
