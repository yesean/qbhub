const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
      resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
        },
      },
      ignoreWarnings: [
        function ignoreSourceMapsLoaderWarnings(warning) {
          return (
            warning.module?.resource?.includes('node_modules') &&
            warning.details?.includes('source-map-loader')
          );
        },
      ],
    },
  },
};
