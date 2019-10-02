#!/bin/bash

#  install deps for browserify. dev only.
npm install --save-dev browserify webpack jspm tsify

# needed to support websockets being bundled.
npm install --save-dev bufferutil utf-8-validate
