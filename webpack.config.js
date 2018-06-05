const path = require("path");
const webpack = require("webpack");
const NODE_ENV = process.env.NODE_ENV || "development";
const OUTPUT_FOLDER = "public";
const debug = NODE_ENV.trim() !== "production";

module.exports = {
  mode: NODE_ENV,
  entry: {
    main: "./src/index.js"
  },
  output: {
    path: path.join(__dirname, OUTPUT_FOLDER),
    filename: "./js/[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, OUTPUT_FOLDER),
    historyApiFallback: true
  },
  plugins: debug
    ? []
    : [new webpack.optimize.UglifyJsPlugin({ mangle: false, sourceMap: false })]
};
