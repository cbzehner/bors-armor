const webpack = require("webpack")
const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
// const WriteFileWebpackPlugin = require("write-file-webpack-plugin")

const rootPath = path.join(__dirname, "./..")
// const fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"]

const options = {
  mode: "development",
  entry: {
    popup: `${rootPath}/src/js/popup.js`,
    content: `${rootPath}/src/js/content.js`,
    // background: `${rootPath}/src/js/background.js"`,
  },
  output: {
    path: `${rootPath}/build`,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // {
      // test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
      // loader: "file-loader?name=[name].[ext]",
      // },
      {
        test: /\.html$/,
        use: ["html-loader"],
        // use: ['file-loader?name=[name].[ext]', 'extract-loader', 'html-loader'],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean `build/` between webpack runs
    // new WriteFileWebpackPlugin({ test: /\.css$/ }),    // ???
    new HtmlWebpackPlugin({   // Load HTML files
      template: `${rootPath}/src/html/popup.html`,
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new CopyWebpackPlugin(    // Copy static assets into `build/`
      [
        { 
          from: 'manifest.json', 
          transform: function (content, _path) {
            // Use the package.json to populate the manifest.json
            return Buffer.from(JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString())
            }))
          },
          context: `${rootPath}/src/`
        },
        { from: 'css/*', to: `${rootPath}/build`, context: `${rootPath}/src/` },
        { from: 'icons/*.png', to: `${rootPath}/build`, context: `${rootPath}/src/` }
      ],
    ),
  ]
}

module.exports = options
