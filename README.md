# SolarEngine
This project is a personal effort to build from the ground up a light control system/software. The entire stack at this time is written in NodeJS. Due to limitations of NodeJS execution it has been broken into multiple services/applications to run together. 

As for now this code repository is changing rapidly and breaking changes may happen.
Please comeback for the full release if you are interested.

## Planned Functionality
- Cuelist creation and playback.
- Show control from real world data/sensors.
- Pattern/design generation with Canvas API in  a headless.

## Directories
__bin__ -
bash scripts to complete common tasks.  

__js__ -
compiled typescript is output here. 
should not be committed to the source git index.  

__src__ -
source typescript code.
contains source code for all aspects of the stack.

__dev__ -
files to test features and create custom shows files.
should not be committed to the source git index.

__public__ -
publice files to be used in the status page.
HTML / CSS / JS  

__sampleData__ -
sample show files to illistrate structure.
should all be able to be loaded into the engine.  

## Compiling for use
First, ensure that all the dependancies for the npm project are installed.  
` $ tsc `
