'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      createNote: PATHS.src + '/createNote.js',
      rateNotes: PATHS.src + '/rateNotes.js',
      defaultContentScript: PATHS.src + '/defaultContentScript.js',
      statusContentScript: PATHS.src + '/statusContentScript.js',
      subscribeContentScript: PATHS.src + '/subscribeContentScript.js',
      birdwatchContentScript: PATHS.src + '/birdwatchContentScript.js',
      contentModifiers: PATHS.src + '/contentModifiers.js',
      mint: PATHS.src + '/mint.js',
      web3: PATHS.src + '/web3.js',
      logging: PATHS.src + '/logging.js',
      components: PATHS.src + '/components.js',
      serviceWorker: PATHS.src + '/serviceWorker.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
