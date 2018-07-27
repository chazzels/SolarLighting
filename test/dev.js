/* create a new engine */
let SolarEngine = require("./js/solarEngine");
let engine = new SolarEngine({
	perf: {verbose: true},
	store: {verbose: false},
	playhead: {verbose: false},
	server: {verbose: false}
});

//ASSET LOAD TEST

/* load an asset into the engine */
let sampleAsset = require("./sampleData/cuelist.json");
let sha1 = engine.loadAsset(sampleAsset);
let sha2 = engine.loadAsset(sampleAsset);
let sha3 = engine.loadAsset(sampleAsset);
let sha4 = engine.loadAsset(sampleAsset);
let sha5 = engine.loadAsset(sampleAsset);
let sha6 = engine.loadAsset(sampleAsset);
let sha7 = engine.loadAsset(sampleAsset);
let sha8 = engine.loadAsset(sampleAsset);
let sha9 = engine.loadAsset(sampleAsset);
let sha0 = engine.loadAsset(sampleAsset);

let sha20 = engine.loadAsset(sampleAsset);
let sha21 = engine.loadAsset(sampleAsset);
let sha22 = engine.loadAsset(sampleAsset);
let sha23 = engine.loadAsset(sampleAsset);
let sha24 = engine.loadAsset(sampleAsset);
let sha25 = engine.loadAsset(sampleAsset);
let sha26 = engine.loadAsset(sampleAsset);
let sha27 = engine.loadAsset(sampleAsset);
let sha28 = engine.loadAsset(sampleAsset);
let sha29 = engine.loadAsset(sampleAsset);

let sha30 = engine.loadAsset(sampleAsset);
let sha31 = engine.loadAsset(sampleAsset);
let sha32 = engine.loadAsset(sampleAsset);
let sha33 = engine.loadAsset(sampleAsset);
let sha34 = engine.loadAsset(sampleAsset);
let sha35 = engine.loadAsset(sampleAsset);
let sha36 = engine.loadAsset(sampleAsset);
let sha37 = engine.loadAsset(sampleAsset);
let sha38 = engine.loadAsset(sampleAsset);
let sha39 = engine.loadAsset(sampleAsset);

let sha40 = engine.loadAsset(sampleAsset);
let sha41 = engine.loadAsset(sampleAsset);
let sha42 = engine.loadAsset(sampleAsset);
let sha43 = engine.loadAsset(sampleAsset);
let sha44 = engine.loadAsset(sampleAsset);
let sha45 = engine.loadAsset(sampleAsset);
let sha46 = engine.loadAsset(sampleAsset);
let sha47 = engine.loadAsset(sampleAsset);
let sha48 = engine.loadAsset(sampleAsset);
let sha49 = engine.loadAsset(sampleAsset);

let sha50 = engine.loadAsset(sampleAsset);
let sha51 = engine.loadAsset(sampleAsset);
let sha52 = engine.loadAsset(sampleAsset);
let sha53 = engine.loadAsset(sampleAsset);
let sha54 = engine.loadAsset(sampleAsset);
let sha55 = engine.loadAsset(sampleAsset);
let sha56 = engine.loadAsset(sampleAsset);
let sha57 = engine.loadAsset(sampleAsset);
let sha58 = engine.loadAsset(sampleAsset);
let sha59 = engine.loadAsset(sampleAsset);

//ASSET PLAY TEST
engine.play(sha1);
engine.play(sha2);
engine.play(sha3);
engine.play(sha4);
engine.play(sha5);
engine.play(sha6);
engine.play(sha7);
engine.play(sha8);
engine.play(sha9);
engine.play(sha0);

engine.play(sha20);
engine.play(sha21);
engine.play(sha22);
engine.play(sha23);
engine.play(sha24);
engine.play(sha25);
engine.play(sha26);
engine.play(sha27);
engine.play(sha28);
engine.play(sha29);

engine.play(sha30);
engine.play(sha31);
engine.play(sha32);
engine.play(sha33);
engine.play(sha34);
engine.play(sha35);
engine.play(sha36);
engine.play(sha37);
engine.play(sha38);
engine.play(sha39);

engine.play(sha40);
engine.play(sha41);
engine.play(sha42);
engine.play(sha43);
engine.play(sha44);
engine.play(sha45);
engine.play(sha46);
engine.play(sha47);
engine.play(sha48);
engine.play(sha49);

engine.play(sha50);
engine.play(sha51);
engine.play(sha52);
engine.play(sha53);
engine.play(sha54);
engine.play(sha55);
engine.play(sha56);
engine.play(sha57);
engine.play(sha58);
engine.play(sha59);