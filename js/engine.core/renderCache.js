"use strict";
class RenderCache {
    constructor(perf) {
        this._storage = new Map();
        this._timestamp = new Map();
        this.CACHEWRITE = "CacheWrite";
        this.CACHEREAD = "CacheRead";
        console.log("CACHE::STARTING");
        console.group();
        this.perf = perf;
        perf.registerParameter(this.CACHEREAD);
        perf.registerParameter(this.CACHEWRITE);
        console.groupEnd();
    }
    write(shahex, value) {
        let writeStatus = false;
        this._storage.set(shahex, value);
        this._timestamp.set(shahex, Date.now());
        this.perf.hit(this.CACHEWRITE);
    }
    read(shahex) {
        let cacheObj = {
            cue: {},
            timestamp: -1
        };
        cacheObj.cue = this._storage.get(shahex);
        cacheObj.timestamp = this._timestamp.get(shahex);
        this.perf.hit(this.CACHEREAD);
        return cacheObj;
    }
}
module.exports = RenderCache;
//# sourceMappingURL=renderCache.js.map