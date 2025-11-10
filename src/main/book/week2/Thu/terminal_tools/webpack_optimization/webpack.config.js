const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Intentionally unoptimized webpack configuration with many improvement opportunities
module.exports = {
  // No mode specified - will default to production but not optimized
  entry: './src/index.js',
  
  output: {
    // No hash in filename - poor for caching
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // No clean option - old files will accumulate
  },

  // No optimization configuration
  // Missing: splitChunks, minimize, usedExports, sideEffects
  
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        // No CSS optimization or extraction
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: ['file-loader'],
        // Old file-loader instead of asset modules
        // No image optimization
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // No minification options
    }),
  ],

  // Development server configuration without optimization
  devServer: {
    static: './dist',
    // No hot module replacement
    // No compression
    port: 8080,
  },

  // No source maps for debugging
  // No resolve configuration for better module resolution
  // No performance budgets or warnings
  // No tree shaking configuration
  // No code splitting
  // No bundle analysis tools
};