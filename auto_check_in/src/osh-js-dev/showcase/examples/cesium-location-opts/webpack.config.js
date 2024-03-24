/* webpack.config.js */

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var path = require('path');
const webpack = require("webpack");

const PROCESS_BASE_PATH = process.cwd();

// Cesium deps
const cesiumSource = 'node_modules/cesium/Build/Cesium';
const cesiumBaseUrl = "cesiumStatic";
//

module.exports = {
    // Tell Webpack which file kicks off our app.
    entry: path.resolve(__dirname,'cesium-location-opts.js'),
    // Tell Weback to output our bundle to ./dist/bundle.js
    output: {
        filename: 'bundle.cesium.location.opts.js',
        path: path.resolve(__dirname, 'dist'),
        // Needed to compile multiline strings in Cesium
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty'
    },
    // Tell Webpack which directories to look in to resolve import statements.
    // Normally Webpack will look in node_modules by default but since we’re overriding
    // the property we’ll need to tell it to look there in addition to the
    // bower_components folder.
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
        ],
        alias: {
            'osh-js': path.resolve(__dirname, '../../../source')
        }
    },
    // These rules tell Webpack how to process different module types.
    // Remember, *everything* is a module in Webpack. That includes
    // CSS, and (thanks to our loader) HTML.
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },{
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }, {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader', options: { name: 'WorkerName.[hash].js' } }
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: {
                    and: [/node_modules/], // Exclude libraries in node_modules ...
                    not: [/cesium/], // Except Cesium because it uses modern syntax
                },
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                ["@babel/preset-env", { targets: "defaults, not ie 11" }],
                            ],
                            plugins: ["@babel/plugin-transform-optional-chaining"],
                        },
                    },
                    // Babel understands the import.meta syntax but doesn't transform it in any way
                    // However Webpack can't parse this and throws an error for an unexpected token
                    // we need to use this extra loader so Webpack can actually bundle the code
                    // https://www.npmjs.com/package/@open-wc/webpack-import-meta-loader
                    require.resolve("@open-wc/webpack-import-meta-loader"),
                ],
            }
        ]
    },
    // Enable the Webpack dev server which will build, serve, and reload our
    // project on changes.
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: true,
        index: 'cesium-location-opts.html',
        https:true
    },
    devtool: 'source-map',
    plugins: [
        /**
         * All files inside webpack's output.path directory will be removed once, but the
         * directory itself will not be. If using webpack 4+'s default configuration,
         * everything under <PROJECT_DIR>/dist/ will be removed.
         * Use cleanOnceBeforeBuildPatterns to override this behavior.
         *
         * During rebuilds, all webpack assets that are not used anymore
         * will be removed automatically.
         *
         * See `Options and Defaults` for information
         */
        new CleanWebpackPlugin(),
        // This plugin will generate an index.html file for us that can be used
        // by the Webpack dev server. We can give it a template file (written in EJS)
        // and it will handle injecting our bundle for us.
        new HtmlWebpackPlugin({
            filename: "cesium-location-opts.html",
            template: path.resolve(__dirname, 'cesium-location-opts.html')
        }),
        // This plugin will copy files over to ‘./dist’ without transforming them.
        // That's important because the custom-elements-es5-adapter.js MUST
        // remain in ES2015. We’ll talk about this a bit later :)
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname,'images'), to: 'images'},
            { from: path.join(PROCESS_BASE_PATH+'/'+cesiumSource, 'ThirdParty'), to: `${cesiumBaseUrl}/ThirdParty`, force:true },
            { from: path.join(PROCESS_BASE_PATH+'/'+cesiumSource, 'Workers'), to: `${cesiumBaseUrl}/Workers`, force:true },
            { from: path.join(PROCESS_BASE_PATH+'/'+cesiumSource, 'Assets'), to: `${cesiumBaseUrl}/Assets`, force:true },
            { from: path.join(PROCESS_BASE_PATH+'/'+cesiumSource, 'Widgets'), to: `${cesiumBaseUrl}/Widgets`, force:true }
        ]),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl),
        }),
    ]
};