"use strict";
class AssetStore {
    constructor(perf) {
        this._totalTracks = 0;
        this._tracks = new Map();
        this._tracksMeta = new Map();
        this.STOREREAD = "StoreRead";
        this.STOREWRITE = "StoreWrite";
        console.log("STORE::STARTING");
        this.perf = perf;
    }
    loadTrack(shakey, assetData) {
        this._tracks.set(shakey, assetData.cueTrack);
        this._totalTracks + assetData.cueTrack.length;
        this._tracksMeta.set(shakey, assetData.cueTrackMeta);
        this.perf.hit(this.STOREWRITE);
        console.log("STORE::LOAD: " + shakey.hex);
    }
    dumpTrack(shakey) {
        this._tracks.delete(shakey);
        this._tracksMeta.delete(shakey);
        console.log("STORE::DUMP: " + shakey.hex);
    }
    getCue(shakey, cueIndex) {
        let track = this._tracks.get(shakey);
        this.perf.hit(this.STOREREAD);
        if (cueIndex >= 0) {
            return track[cueIndex];
        }
        else {
            return -1;
        }
    }
}
module.exports = AssetStore;
//# sourceMappingURL=assetStore.js.map