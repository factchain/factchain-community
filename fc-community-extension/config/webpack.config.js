'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/pages/popup/index.js',
      createNote: PATHS.src + '/pages/createNote.js',
      rateNotes: PATHS.src + '/pages/rateNotes.js',
      mintXNote: PATHS.src + '/pages/mintXNote.js',
      components: PATHS.src + '/pages/components.js',
      defaultContentScript: PATHS.src + '/defaultContentScript.js',
      statusContentScript: PATHS.src + '/statusContentScript.js',
      subscribeContentScript: PATHS.src + '/subscribeContentScript.js',
      contentModifiers: PATHS.src + '/contentModifiers.js',
      web3: PATHS.src + '/utils/web3.js',
      logging: PATHS.src + '/utils/logging.js',
      constants: PATHS.src + '/utils/constants.js',
      selectors: PATHS.src + '/utils/selectors.js',
      backend: PATHS.src + '/utils/backend.js',
      serviceWorker: PATHS.src + '/serviceWorker.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    resolve: {
      alias: {
        '@': PATHS.src,
      },
    },
  });

module.exports = config;
