import { ApplicationCommandPermissionsUpdateData, Entitlement, AutoModerationActionExecution, AutoModerationRule, BaseInteraction, Client, CloseEvent, Collection, DMChannel, Events, ForumChannel, Guild, GuildAuditLogsEntry, GuildBan, GuildChannel, GuildEmoji, GuildMember, GuildScheduledEvent, GuildTextBasedChannel, Invite, Message, MessageReaction, NewsChannel, Presence, Role, Snowflake, StageChannel, StageInstance, Sticker, TextChannel, ThreadChannel, ThreadMember, Typing, User, VoiceChannel, VoiceState }
    from "discord.js";
import { IDominionClient } from "./Client";
import { IEventComponent } from "./Module"


export interface IEventHandlerCollection extends Collection<Events, Array<[string, IEventComponent]>> {
    add: IEventAddFunc
    remove: IEventRemoveFunc
}

export interface IEventAddFunc {
    (Client: IDominionClient, Component: IEventComponent, EventOverride?: Events): object | void
}

export interface IEventRemoveFunc {
    (Component: IEventComponent, EventOverride?: Events): object | void
}


type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export type EventArgument1 = PropType<EventArgumentsAlias, "arg1">
export type EventArgument2 = PropType<EventArgumentsAlias, "arg2">
export type EventArgument3 = PropType<EventArgumentsAlias, "arg3">

export type EventArgument_ApplicationCommandPermissionsUpdate = {
    event: Events.ApplicationCommandPermissionsUpdate,
    /**
     * the updated permissions
     */
    arg1: ApplicationCommandPermissionsUpdateData,
    arg2: null,
    arg3: null | undefined
}

export type EventArgument_AutoModerationActionExecution = {
    event: Events.AutoModerationActionExecution,
    /**
     * the data of the execution
     *  */
    arg1: AutoModerationActionExecution,
    arg2: null | undefined,
    arg3: null | undefined
}

export type EventArgument_AutoModerationRuleCreate =
    {
        event: Events.AutoModerationRuleCreate,
        /**
         * the rule that was created
         */
        arg1: AutoModerationRule,
        arg2: null | undefined,
        arg3: null | undefined
    }

export type EventArgument_AutoModerationRuleDelete =
    {
        event: Events.AutoModerationRuleDelete,
        /**
         * the rule that was deleted
         */
        arg1: AutoModerationRule,
        arg2: null | undefined,
        arg3: null | undefined
    }

export type EventArgument_AutoModerationRuleUpdate =
    {
        event: Events.AutoModerationRuleUpdate,
        /**
         * the old version of the rule that was updated
         */
        arg1: AutoModerationRule,
        /**
         * the new version of the rule that was updated
         */
        arg2: AutoModerationRule,
        arg3: null | undefined
    }

export type EventArgument_ChannelCreate =
    {
        event: Events.ChannelCreate,
        /**
         * the channel that was created
         */
        arg1: GuildChannel,
        arg2: null | undefined,
        arg3: null | undefined
    }
export type EventArgument_ChannelDelete = {
    event: Events.ChannelDelete,
    /**
     * the channel that was deleted
     */
    arg1: GuildChannel | DMChannel,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_ChannelPinsUpdate =
    {
        event: Events.ChannelPinsUpdate,
        /**
         * the channel that the pins were updated in
         */
        arg1: GuildTextBasedChannel | DMChannel,
        /**
         * the time at which the pins were last updated
         */
        arg2: Date,
        arg3: null | undefined
    }
export type EventArgument_ChannelUpdate =
    {
        event: Events.ChannelUpdate,
        /**
         * the old version of the channel that was updated
         */
        arg1: GuildChannel | DMChannel,
        /**
         * the new version of the channel that was updated
         */
        arg2: GuildChannel | DMChannel,
        arg3: null | undefined
    }
export type EventArgument_Debug = {
    event: Events.Debug,
    /**
     * the debug info
     */
    arg1: string,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildEmojiCreate = {
    event: Events.GuildEmojiCreate,
    /**
     * the emoji that was created
    */
    arg1: GuildEmoji,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildEmojiDelete = {
    event: Events.GuildEmojiDelete,
    /** 
     * the emoji that was deleted
    */
    arg1: GuildEmoji,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildEmojiUpdate = {
    event: Events.GuildEmojiUpdate,
    /**
     * the old version of the emoji that was updated
     */
    arg1: GuildEmoji,
    /** 
     * the new version of the emoji that was updated
    */
    arg2: GuildEmoji,
    arg3: null | undefined
}
export type EventArgument_Error = {
    event: Events.Error,
    /**
     * the error that was thrown
     * Errors thrown within this event do not have a catch handler, it is recommended to not use async functions as error event handlers. See the Node.js docs  for details
     * https://nodejs.org/api/events.html#capture-rejections-of-promises
     */
    arg1: Error,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildAuditLogEntryCreate = {
    event: Events.GuildAuditLogEntryCreate,
    /** 
     * the entry that was created
     */
    arg1: GuildAuditLogsEntry,
    /*
    * the guild that the entry was created in
    */
    arg2: Guild,
    arg3: null | undefined
}
export type EventArgument_GuildBanAdd = {
    event: Events.GuildBanAdd,
    /**
     * The ban that occurred
     */
    arg1: GuildBan,
    arg2: null | undefined,
    arg3: null | undefined,
}
export type EventArgument_GuildBanRemove = {
    event: Events.GuildBanRemove,
    /**
     * The ban that was removed
     */
    arg1: GuildBan,
    arg2: null | undefined,
    arg3: null | undefined
}

export type EventArgument_GuildCreate = {
    event: Events.GuildCreate,
    /**
     * the guild that was created
    */
    arg1: Guild,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildDelete = {
    event: Events.GuildDelete,
    /**
     * the guild that was deleted
     */
    arg1: Guild,
    arg2: null | undefined,
    arg3: null | undefined
}

export type EventArgument_GuildIntegrationsUpdate = {
    event: Events.GuildIntegrationsUpdate,
    /**
     * the guild that the integrations were updated in
    */
    arg1: Guild,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildMemberAdd = {
    event: Events.GuildMemberAdd,
    /**
     * the member that joined a guild
     */
    arg1: GuildMember,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildMemberAvailable = {
    event: Events.GuildMemberAvailable,
    /**
     * the member that became available
     */
    arg1: GuildMember,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildMemberRemove = {
    event: Events.GuildMemberRemove,
    /**
     * the member that left a guild
     */
    arg1: GuildMember,
    arg2: null | undefined,
    arg3: null | undefined

}
export type EventArgument_GuildMembersChunk = {
    event: Events.GuildMembersChunk,
    /**
     * the members in the chunk
     */
    arg1: Collection<Snowflake, GuildMember>,
    /**
     * the guild that the members were fetched in
     */
    arg2: Guild,
    /**
     * the properties for the received chunk
     */
    arg3: object
}
export type EventArgument_GuildMemberUpdate = {
    event: Events.GuildMemberUpdate,
    /**
     *  the old version of the member that was updated
    */
    arg1: GuildMember,
    /**
     * the new version of the member that was updated
     */
    arg2: GuildMember,
    arg3: null | undefined
}

export type EventArgument_GuildScheduledEventCreate = {
    event: Events.GuildScheduledEventCreate,
    /**
     * the event that was created
     */
    arg1: GuildScheduledEvent,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildScheduledEventDelete = {
    event: Events.GuildScheduledEventDelete,
    /**
     * the event that was deleted
     */
    arg1: GuildScheduledEvent,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildScheduledEventUpdate = {
    event: Events.GuildScheduledEventUpdate,
    /**
     * the old version of the event that was updated
     * */
    arg1: GuildScheduledEvent,
    /**
     * the new version of the event that was updated
     * */
    arg2: GuildScheduledEvent,
    arg3: null | undefined
}
export type EventArgument_GuildScheduledEventUserAdd = {
    event: Events.GuildScheduledEventUserAdd,
    /**
     * the event that the user was added to
     * */
    arg1: GuildScheduledEvent,
    /**
     * the user that was added to the event
     * */
    arg2: User,
    arg3: null | undefined
}

export type EventArgument_GuildScheduledEventUserRemove = {
    event: Events.GuildScheduledEventUserRemove,
    /**
     *  the event that the user was removed from
     * */
    arg1: GuildScheduledEvent,
    /**
     * the user that was removed from the event
     * */
    arg2: User,
    arg3: null | undefined
}
export type EventArgument_GuildUnavailable = {
    event: Events.GuildUnavailable,
    /**
     *  the guild that is unavailable
     * */
    arg1: Guild,
    arg2: null | undefined,
    arg3: null | undefined
}
export type EventArgument_GuildUpdate = {
    event: Events.GuildUpdate,
    /**
     * the old version of the guild that was updated
     * */
    arg1: Guild,
    /**
     * the new version of the guild that was updated
     * */
    arg2: Guild,
    arg3: null | undefined
}
export type EventArgument_InteractionCreate = {
    event: Events.InteractionCreate,
    /**
     * the interaction that was created
     * */
    arg1: BaseInteraction,
    arg2: null | undefined,
    arg3: null | undefined,
}
export type EventArgument_InviteCreate = {
    event: Events.InviteCreate,
    /**
     * the invite that was created
     * */
    arg1: Invite,
    arg2: null | undefined,
    arg3: null | undefined,
}
export type EventArgument_InviteDelete = {
    event: Events.InviteDelete,
    /**
     * the invite that was deleted
     * */
    arg1: Invite,
    arg2: null | undefined,
    arg3: null | undefined,
}
export type EventArgument_MessageCreate = {
    event: Events.MessageCreate,
    /**
     * the message that was created
     * */
    arg1: Message,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_MessageDelete = {
    event: Events.MessageDelete,
    /**
     * the message that was deleted
     * */
    arg1: Message,
    arg2: null | undefined,
    arg3: null | undefined,
}
export type EventArgument_MessageBulkDelete = {
    event: Events.MessageBulkDelete,
    /**
     * the messages that were deleted
     * */
    arg1: Collection<Snowflake, Message>,
    /**
     * the channel that the messages were deleted in
     */
    arg2: GuildTextBasedChannel,
    arg3: null | undefined,
}
export type EventArgument_MessageReactionAdd = {
    event: Events.MessageReactionAdd,
    /**
     * the reaction that was added
     * */
    arg1: MessageReaction,
    /**
     * the user that added the reaction
     */
    arg2: User,
    arg3: null | undefined,
}
export type EventArgument_MessageReactionRemove = {
    event: Events.MessageReactionRemove,
    /**
     * the reaction that was removed
     * */
    arg1: MessageReaction,
    /**
     * the user that removed the reaction
     * */
    arg2: User,
    arg3: null | undefined,
}

export type EventArgument_MessageReactionRemoveAll = {
    event: Events.MessageReactionRemoveAll,
    /**
     * the message that all reactions were removed from
     * */
    arg1: Message,
    /**
     * The cached message reactions that were removed.
     */
    arg2: Collection<Snowflake | string, MessageReaction>,
    arg3: null | undefined,
}

export type EventArgument_MessageReactionRemoveEmoji = {
    event: Events.MessageReactionRemoveEmoji,
    /**
     * the reaction that was removed
     * */
    arg1: MessageReaction,
    arg2: null | undefined,
    arg3: null | undefined,
}
export type EventArgument_MessageUpdate = {
    event: Events.MessageUpdate,
    /**
     * the old version of the message that was updated
     * */
    arg1: Message,
    /**
     * the new version of the message that was updated
     * */
    arg2: Message,
    arg3: null | undefined,
}
export type EventArgument_PresenceUpdate = {
    event: Events.PresenceUpdate,
    /**
     * the old version of the presence before the update
     * */
    arg1: Presence | null,
    /**
     * the new version of the presence after the update
     * */
    arg2: Presence,
    arg3: null | undefined,
}
export type EventArgument_ClientReady = {
    //ready
    event: Events.ClientReady,
    /**
     * the client that is ready
     * */
    arg1: Client,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_GuildRoleCreate = {
    event: Events.GuildRoleCreate,
    /**
     * the role that was created
     * */
    arg1: Role,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_GuildRoleDelete = {
    event: Events.GuildRoleDelete,
    /**
     * the role that was deleted
     * */
    arg1: Role,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_GuildRoleUpdate = {
    event: Events.GuildRoleUpdate,
    /**
     * the old version of the role that was updated
     * */
    arg1: Role,
    /**
     * the new version of the role that was updated
     * */
    arg2: Role,
    arg3: null | undefined,
}

export type EventArgument_ShardDisconnect = {
    //shard disconnect
    event: Events.ShardDisconnect,
    /**
     * the websocket close event
     * */
    arg1: CloseEvent,
    /**
     * the shard id that disconnected
     * */
    arg2: number,
    arg3: null | undefined,
}

export type EventArgument_ShardError = {
    //shard error
    event: Events.ShardError,
    /**
     * the error that was thrown
     * */
    arg1: Error,
    /**
     * the shard id that the error was thrown on
     * */
    arg2: number,
    arg3: null | undefined,
}

export type EventArgument_ShardReady = {
    //shard ready
    event: Events.ShardReady,
    /**
     * the id of the shard that is ready
     * */
    arg1: number,
    /**
     * the set of guilds that are unavailable, if any
     */
    arg2: Set<Snowflake> | undefined,
    arg3: null | undefined,
}

export type EventArgument_ShardReconnecting = {
    //shard reconnecting
    event: Events.ShardReconnecting,
    /**
     * the id of the shard that is reconnecting
     * */
    arg1: number,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_ShardResume = {
    //shard resume
    event: Events.ShardResume,
    /**
     * the id of the shard that resumed
     * */
    arg1: number,
    /**
     * the amount of replayed events
     * */
    arg2: number,
    arg3: null | undefined,
}

export type EventArgument_StageInstanceCreate = {
    //stage instance create
    event: Events.StageInstanceCreate,
    /**
     * the stage instance that was created
     * */
    arg1: StageInstance,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_StageInstanceDelete = {
    //stage instance delete
    event: Events.StageInstanceDelete,
    /**
     * the stage instance that was deleted
     * */
    arg1: StageInstance,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_StageInstanceUpdate = {
    //stage instance update
    event: Events.StageInstanceUpdate,
    /**
     * the old stage instance
     * */
    arg1: StageInstance,
    /**
     * the new stage instance
     * */
    arg2: StageInstance,
    arg3: null | undefined,
}

export type EventArgument_GuildStickerCreate = {
    //sticker create
    event: Events.GuildStickerCreate,
    /**
     * the sticker that was created
     * */
    arg1: Sticker,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_GuildStickerDelete = {
    //sticker delete
    event: Events.GuildStickerDelete,
    /**
     * the sticker that was deleted
     * */
    arg1: Sticker,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_GuildStickerUpdate = {
    //sticker update
    event: Events.GuildStickerUpdate,
    /**
     * the old sticker
     * */
    arg1: Sticker,
    /**
     * the new sticker
     * */
    arg2: Sticker,
    arg3: null | undefined,
}

export type EventArgument_ThreadCreate = {
    //thread create
    event: Events.ThreadCreate,
    /**
     * the thread that was created
     * */
    arg1: ThreadChannel,
    /**
     * whether the thread is newly created
     */
    arg2: boolean,
    arg3: null | undefined,
}

export type EventArgument_ThreadDelete = {
    //thread delete
    event: Events.ThreadDelete,
    /**
     * the thread that was deleted
     * */
    arg1: ThreadChannel,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_ThreadListSync = {
    //thread list sync
    event: Events.ThreadListSync,
    /**
     * The threads that were synced
     * */
    arg1: Collection<Snowflake, ThreadChannel>,
    /** 
     * the guild that the threads were synced in
     */
    arg2: Guild,
    arg3: null | undefined,
}

export type EventArgument_ThreadMembersUpdate = {
    //thread members update
    event: Events.ThreadMembersUpdate,
    /**
     * The members that were added
     * */
    arg1: Collection<Snowflake, ThreadMember>,
    /**
     * The members that were removed
     * */
    arg2: Collection<Snowflake, ThreadMember>,
    /**
     * the thread that the members were updated in
     * */
    arg3: ThreadChannel,
}

export type EventArgument_ThreadMemberUpdate = {
    //thread member update
    event: Events.ThreadMemberUpdate,
    /**
     * the old thread member
     * */
    arg1: ThreadMember,
    /**
     * the new thread member
     *  */
    arg2: ThreadMember,
    arg3: null | undefined,
}

export type EventArgument_ThreadUpdate = {
    //thread update
    event: Events.ThreadUpdate,
    /**
     * the old thread
     * */
    arg1: ThreadChannel,
    /**
     * the new thread
     * */
    arg2: ThreadChannel,
    arg3: null | undefined,
}

export type EventArgument_TypingStart = {
    //typing start
    event: Events.TypingStart,
    /**
     * the typing state
     * */
    arg1: Typing,
    arg2: null | undefined,
    arg3: null | undefined,
}

export type EventArgument_UserUpdate = {
    //user update
    event: Events.UserUpdate,
    /**
     * the old user
     * */
    arg1: User,
    /**
     * the new user
     * */
    arg2: User,
    arg3: null | undefined,
}

export type EventArgument_VoiceStateUpdate = {
    //voice state update
    event: Events.VoiceStateUpdate,
    /**
     * the old voice state
     * */
    arg1: VoiceState,
    /**
     * the new voice state
     * */
    arg2: VoiceState,
    arg3: null | undefined,
}

export type EventArgument_VoiceServerUpdate = {
    //voice server update
    event: Events.VoiceServerUpdate,
    /**
     * Voice connection token
     * */
    arg1: string,
    /**
     * the guild this voice server update is for
     * */
    arg2: Snowflake,
    /**
     * The voice server host
     *
     * A `null` endpoint means that the voice server allocated has gone away and is trying to be reallocated.
     * You should attempt to disconnect from the currently connected voice server, and not attempt to reconnect
     * until a new voice server is allocated
     */
    arg3: string | null,

}


export type EventArgument_Warn = {
    //warn
    event: Events.Warn,
    /**
     * the warning
     * */
    arg1: string,
    arg2: null | undefined,
    arg3: null | undefined,
}


export type EventArgument_WebhooksUpdate = {
    //webhook update
    event: Events.WebhooksUpdate,
    /**
     * the channel that the webhook was updated in
     * */
    arg1: TextChannel | NewsChannel | VoiceChannel | StageChannel | ForumChannel,
    arg2: null | undefined,
    arg3: null | undefined,
}


export type EventArguments = {
    [key in Events]: EventArgumentMap[];
}



export type EventArgumentMap = {
    cacheSweep: {
        event: Events.CacheSweep,
        arg1: unknown,
        arg2: unknown,
        arg3: unknown,
    };
    invalidated: {
        event: Events.Invalidated,
        arg1: unknown,
        arg2: unknown,
        arg3: unknown,
    };
    guildAvailable: {
        event: Events.GuildAvailable,
        arg1: Guild,
        arg2: unknown,
        arg3: unknown,
    };
    raw: {
        event: Events.Raw,
        arg1: unknown,
        arg2: unknown,
        arg3: unknown,
    };
    voiceServerUpdate: EventArgument_VoiceServerUpdate;

    applicationCommandPermissionsUpdate: EventArgument_ApplicationCommandPermissionsUpdate;
    autoModerationActionExecution: EventArgument_AutoModerationActionExecution;
    autoModerationRuleCreate: EventArgument_AutoModerationRuleCreate;
    autoModerationRuleDelete: EventArgument_AutoModerationRuleDelete;
    autoModerationRuleUpdate: EventArgument_AutoModerationRuleUpdate;
    channelCreate: EventArgument_ChannelCreate;
    channelDelete: EventArgument_ChannelDelete;
    channelPinsUpdate: EventArgument_ChannelPinsUpdate;
    channelUpdate: EventArgument_ChannelUpdate;
    debug: EventArgument_Debug;
    emojiCreate: EventArgument_GuildEmojiCreate;
    emojiDelete: EventArgument_GuildEmojiDelete;
    emojiUpdate: EventArgument_GuildEmojiUpdate;
    error: EventArgument_Error;
    guildAuditLogEntryCreate: EventArgument_GuildAuditLogEntryCreate;
    guildBanAdd: EventArgument_GuildBanAdd;
    guildBanRemove: EventArgument_GuildBanRemove;
    guildCreate: EventArgument_GuildCreate;
    guildDelete: EventArgument_GuildDelete;
    guildIntegrationsUpdate: EventArgument_GuildIntegrationsUpdate;
    guildMemberAdd: EventArgument_GuildMemberAdd;
    guildMemberAvailable: EventArgument_GuildMemberAvailable;
    guildMemberRemove: EventArgument_GuildMemberRemove;
    guildMembersChunk: EventArgument_GuildMembersChunk;
    guildMemberUpdate: EventArgument_GuildMemberUpdate;
    guildScheduledEventCreate: EventArgument_GuildScheduledEventCreate;
    guildScheduledEventDelete: EventArgument_GuildScheduledEventDelete;
    guildScheduledEventUpdate: EventArgument_GuildScheduledEventUpdate;
    guildScheduledEventUserAdd: EventArgument_GuildScheduledEventUserAdd;
    guildScheduledEventUserRemove: EventArgument_GuildScheduledEventUserRemove;
    guildUnavailable: EventArgument_GuildUnavailable;
    guildUpdate: EventArgument_GuildUpdate;
    interactionCreate: EventArgument_InteractionCreate;
    inviteCreate: EventArgument_InviteCreate;
    inviteDelete: EventArgument_InviteDelete;
    messageCreate: EventArgument_MessageCreate;
    messageDelete: EventArgument_MessageDelete;
    messageDeleteBulk: EventArgument_MessageBulkDelete;
    messageReactionAdd: EventArgument_MessageReactionAdd;
    messageReactionRemove: EventArgument_MessageReactionRemove;
    messageReactionRemoveAll: EventArgument_MessageReactionRemoveAll;
    messageReactionRemoveEmoji: EventArgument_MessageReactionRemoveEmoji;
    messageUpdate: EventArgument_MessageUpdate;
    presenceUpdate: EventArgument_PresenceUpdate;
    ready: EventArgument_ClientReady;
    roleCreate: EventArgument_GuildRoleCreate;
    roleDelete: EventArgument_GuildRoleDelete;
    roleUpdate: EventArgument_GuildRoleUpdate;
    shardDisconnect: EventArgument_ShardDisconnect;
    shardError: EventArgument_ShardError;
    shardReady: EventArgument_ShardReady;
    shardReconnecting: EventArgument_ShardReconnecting;
    shardResume: EventArgument_ShardResume;
    stageInstanceCreate: EventArgument_StageInstanceCreate;
    stageInstanceDelete: EventArgument_StageInstanceDelete;
    stageInstanceUpdate: EventArgument_StageInstanceUpdate;
    stickerCreate: EventArgument_GuildStickerCreate;
    stickerDelete: EventArgument_GuildStickerDelete;
    stickerUpdate: EventArgument_GuildStickerUpdate;
    threadCreate: EventArgument_ThreadCreate;
    threadDelete: EventArgument_ThreadDelete;
    threadListSync: EventArgument_ThreadListSync;
    threadMembersUpdate: EventArgument_ThreadMembersUpdate;
    threadMemberUpdate: EventArgument_ThreadMemberUpdate;
    threadUpdate: EventArgument_ThreadUpdate;
    typingStart: EventArgument_TypingStart;
    userUpdate: EventArgument_UserUpdate;
    voiceStateUpdate: EventArgument_VoiceStateUpdate;
    warn: EventArgument_Warn;
    webhookUpdate: EventArgument_WebhooksUpdate;
    entitlementCreate: {
        event: Events.EntitlementCreate,
        arg1: Entitlement,
        arg2: null | undefined,
        arg3: null | undefined,
    };
    entitlementDelete: {
        event: Events.EntitlementDelete,
        arg1: Entitlement,
        arg2: null | undefined,
        arg3: null | undefined,
    };
    entitlementUpdate: {
        event: Events.EntitlementUpdate,
        arg1: Entitlement,
        arg2: null | undefined,
        arg3: null | undefined,
    };
    messagePollVoteAdd: {
        event: Events.MessagePollVoteAdd,
        arg1: Message,
        arg2: User,
        arg3: null | undefined,
    };
    messagePollVoteRemove: {
        event: Events.MessagePollVoteRemove,
        arg1: Message,
        arg2: User,
        arg3: null | undefined,
    };
};

export type EventArgumentsAlias =
    EventArgument_ApplicationCommandPermissionsUpdate |
    EventArgument_AutoModerationActionExecution |
    EventArgument_AutoModerationRuleCreate |
    EventArgument_AutoModerationRuleDelete |
    EventArgument_AutoModerationRuleUpdate |
    EventArgument_ChannelCreate |
    EventArgument_ChannelDelete |
    EventArgument_ChannelPinsUpdate |
    EventArgument_ChannelUpdate |
    EventArgument_Debug |
    EventArgument_GuildEmojiCreate |
    EventArgument_GuildEmojiDelete |
    EventArgument_GuildEmojiUpdate |
    EventArgument_Error |
    EventArgument_GuildAuditLogEntryCreate |
    EventArgument_GuildBanAdd |
    EventArgument_GuildBanRemove |
    EventArgument_GuildCreate |
    EventArgument_GuildDelete |
    EventArgument_GuildIntegrationsUpdate |
    EventArgument_GuildMemberAdd |
    EventArgument_GuildMemberAvailable |
    EventArgument_GuildMemberRemove |
    EventArgument_GuildMembersChunk |
    EventArgument_GuildMemberUpdate |
    EventArgument_GuildScheduledEventCreate |
    EventArgument_GuildScheduledEventDelete |
    EventArgument_GuildScheduledEventUpdate |
    EventArgument_GuildScheduledEventUserAdd |
    EventArgument_GuildScheduledEventUserRemove |
    EventArgument_GuildUnavailable |
    EventArgument_GuildUpdate |
    EventArgument_InteractionCreate |
    EventArgument_InviteCreate |
    EventArgument_InviteDelete |
    EventArgument_MessageCreate |
    EventArgument_MessageDelete |
    EventArgument_MessageBulkDelete |
    EventArgument_MessageReactionAdd |
    EventArgument_MessageReactionRemove |
    EventArgument_MessageReactionRemoveAll |
    EventArgument_MessageReactionRemoveEmoji |
    EventArgument_MessageUpdate |
    EventArgument_PresenceUpdate |
    EventArgument_ClientReady |
    EventArgument_GuildRoleCreate |
    EventArgument_GuildRoleDelete |
    EventArgument_GuildRoleUpdate |
    EventArgument_ShardDisconnect |
    EventArgument_ShardError |
    EventArgument_ShardReady |
    EventArgument_ShardReconnecting |
    EventArgument_ShardResume |
    EventArgument_StageInstanceCreate |
    EventArgument_StageInstanceDelete |
    EventArgument_StageInstanceUpdate |
    EventArgument_GuildStickerCreate |
    EventArgument_GuildStickerDelete |
    EventArgument_GuildStickerUpdate |
    EventArgument_ThreadCreate |
    EventArgument_ThreadDelete |
    EventArgument_ThreadListSync |
    EventArgument_ThreadMembersUpdate |
    EventArgument_ThreadMemberUpdate |
    EventArgument_ThreadUpdate |
    EventArgument_TypingStart |
    EventArgument_UserUpdate |
    EventArgument_VoiceStateUpdate |
    EventArgument_VoiceServerUpdate |
    EventArgument_Warn |
    EventArgument_WebhooksUpdate;