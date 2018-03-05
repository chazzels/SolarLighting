"use strict";
class ClientMeta {
    constructor(perf) {
        this.clientKeys = [];
        this.clients = new Map();
        this.perf = perf;
        ;
    }
    updateKeys(manifest) {
        this.clientKeys = manifest;
    }
}
module.exports = ClientMeta;
//# sourceMappingURL=clientMeta.js.map