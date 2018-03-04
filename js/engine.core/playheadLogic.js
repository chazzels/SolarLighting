"use strict";
class PlayheadLogic {
    constructor(playheadStore, playheadMetaStore) {
        this.STATUS_PAUSED = "PAUSE";
        this.STATUS_PLAY = "PLAY";
        this.MODE_HOLD = "HOLD";
        this.MODE_FOLLOW = "FOLLOW";
        this.MODE_END = "END";
        this._playheads = playheadStore;
        this._playheadsMeta = playheadMetaStore;
    }
    modeFollow(playhead, shakey) {
        if (playhead.index + 1 <= playhead.indexMax
            && playhead.index >= 0) {
            playhead.index++;
            playhead.current = 0;
            let meta = this._playheadsMeta.get(shakey);
            if (playhead.index + 1 < meta.length - 1) {
                playhead.nextCueMode = meta[playhead.index + 1].cueMode;
            }
            else {
                playhead.nextCueMode = this.MODE_END;
            }
            console.log("PLAYHEAD::ADVANCING: ", shakey.hex);
        }
        else if (playhead.index >= playhead.indexMax) {
            playhead.index = playhead.indexMax;
            playhead.current = 0;
            if (playhead.state === this.STATUS_PLAY) {
                playhead.state = this.STATUS_PAUSED;
                console.log("PLAYHEAD::END_OF_ASSET: ", shakey.hex);
            }
        }
    }
    modeHold(playhead, shakey) {
        playhead.index++;
        playhead.current = 0;
        if (playhead.state === this.STATUS_PLAY) {
            playhead.state = this.STATUS_PAUSED;
            console.log("PLAYHEAD::HELD: ", shakey.hex);
        }
    }
    modeEnd(playhead, shakey) {
        playhead.index = 0;
        playhead.current = 0;
        playhead.state = this.STATUS_PAUSED;
        let meta = this._playheadsMeta.get(shakey);
        if (meta.length >= 1) {
            playhead.nextCueMode = meta[1].cueMode;
        }
        else {
            playhead.nextCueMode = this.MODE_END;
        }
        console.log("PLAYHEAD::END:", shakey.hex);
    }
}
module.exports = PlayheadLogic;
//# sourceMappingURL=playheadLogic.js.map