const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Enable advanced bundle splitting
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            enforce: true,
          },
          // Separate chart libraries (they're large)
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|recharts|react-chartjs-2)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 15,
          },
          // Separate Firebase (also large)
          firebase: {
            test: /[\\/]node_modules[\\/]firebase[\\/]/,
            name: 'firebase',
            chunks: 'all',
            priority: 15,
          },
        },
      };

      // Add bundle analyzer when ANALYZE=true
      if (process.env.ANALYZE) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        webpackConfig.plugins.push(new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        }));
      }

      // Optimize for production
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.optimization.usedExports = true;
        webpackConfig.optimization.sideEffects = false;
        webpackConfig.optimization.minimize = true;
      }

      return webpackConfig;
    },
  },
  
  devServer: {
    compress: true,
    hot: true,
  },
};
