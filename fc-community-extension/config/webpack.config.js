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
      contentScript: PATHS.src + '/contentScript.js',
      provider: PATHS.src + '/provider.js',
      logging: PATHS.src + '/logging.js',
      components: PATHS.src + '/components.js',
      serviceWorker: PATHS.src + '/serviceWorker.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
