"use strict";
class ClientMeta {
    constructor(perf) {
        this.clientsKeys = [];
        this.clients = new Map();
        this.perf = perf;
        ;
    }
    updateKeys(manifest) {
        this.clientsKeys = manifest;
    }
}
module.exports = ClientMeta;
//# sourceMappingURL=clientMeta.js.map