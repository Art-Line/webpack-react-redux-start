const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let mode = 'development';
if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}
console.log(mode + 'mode');


module.exports = {
    mode: mode,
    output: {
        publicPath: '/',
        filename: './js/[name].[contenthash].js',
        // assetModuleFilename: "assets/[hash][ext][query]",
        clean: true
    },
    devtool: (mode === 'development') ? 'eval-cheap-module-source-map' : false,
    devServer: {
        client: {
            overlay: true,
        },
        historyApiFallback: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './css/[name].[contenthash].css'
        }),
        new HTMLWebpackPlugin({
            template: './src/index.html'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env",
                            [
                                "@babel/preset-react",
                                {
                                    runtime: "automatic"
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    (mode === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'postcss-preset-env'
                                    ]
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name].[hash][ext]'
                }
            },
            {
                test: /\.svg$/i,
                type: 'asset/resource',
                resourceQuery: /url/, // *.svg?url
                generator: {
                    filename: 'img/[name].[hash][ext]'
                }
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
                use: {
                    loader: '@svgr/webpack',
                    options: {
                        svgoConfig: {
                            plugins: [
                                {
                                    name: 'removeViewBox',
                                    active: false
                                }
                            ]
                        }
                    }
                }
            },
            {
                test: /\.(woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash][ext]'
                }
            }
        ]
    },
}