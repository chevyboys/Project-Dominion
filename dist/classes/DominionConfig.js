export class DominionConfig {
    constructor(options) {
        this.adminIds = options.adminIds;
        this.database = options.database;
        this.prefix = options.prefix || "!";
        this.repo = options.repo;
        this.token = options.token;
        this.webhooks = options.webhooks;
        this.adminServer = options.adminServer;
        this.DEBUG = options.DEBUG || false;
        this.smiteArray = options.smiteArray || [];
    }
}
