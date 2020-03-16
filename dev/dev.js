const express = require('express');
const app = express();
const port = 80;

// app.use(express.static('public'));

// app.get('/', (request, response) => {
//   response.send('Hello from Express!');
// });

// app.listen(port, (err) => {
//   if (err) {
//     return console.log('something bad happened', err);
//   }

//   console.log(`server is listening on ${port}`);
// });
// END STATIC SERVER. 


/* create a new engine */
let SolarEngine = require("../js/engine/solarEngine");
let engine = new SolarEngine({
	perf: {verbose: false},
	store: {verbose: true},
	playhead: {verbose: true},
	render: {verbose: false},
	server: {verbose: false}
});

//ASSET LOAD TEST

/* load an asset into the engine */
let sampleAsset = require("../sampleData/cuelist.json");
let sha1 = engine.loadAsset(sampleAsset, "DEVELOPMENTDATADUMP");
// let sha2 = engine.loadAsset(sampleAsset);
// let sha3 = engine.loadAsset(sampleAsset);
// let sha4 = engine.loadAsset(sampleAsset);
// let sha5 = engine.loadAsset(sampleAsset);
// let sha6 = engine.loadAsset(sampleAsset);
// let sha7 = engine.loadAsset(sampleAsset);
// let sha8 = engine.loadAsset(sampleAsset);
// let sha9 = engine.loadAsset(sampleAsset);
// let sha0 = engine.loadAsset(sampleAsset);

// let sha20 = engine.loadAsset(sampleAsset);
// let sha21 = engine.loadAsset(sampleAsset);
// let sha22 = engine.loadAsset(sampleAsset);
// let sha23 = engine.loadAsset(sampleAsset);
// let sha24 = engine.loadAsset(sampleAsset);
// let sha25 = engine.loadAsset(sampleAsset);
// let sha26 = engine.loadAsset(sampleAsset);
// let sha27 = engine.loadAsset(sampleAsset);
// let sha28 = engine.loadAsset(sampleAsset);
// let sha29 = engine.loadAsset(sampleAsset);

//ASSET PLAY TEST
engine.play(sha1);
// engine.play(sha2);
// engine.play(sha3);
// engine.play(sha4);
// engine.play(sha5);
// engine.play(sha6);
// engine.play(sha7);
// engine.play(sha8);
// engine.play(sha9);
// engine.play(sha0);

// engine.play(sha20);
// engine.play(sha21);
// engine.play(sha22);
// engine.play(sha23);
// engine.play(sha24);
// engine.play(sha25);
// engine.play(sha26);
// engine.play(sha27);
// engine.play(sha28);
// engine.play(sha29);
