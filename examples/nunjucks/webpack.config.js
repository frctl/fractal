const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: ['./assets/css/main.css'],
    },
    output: {
        filename: 'js/[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, 'public/dist'),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('tailwindcss'), require('autoprefixer')],
                            },
                        },
                    },
                ],
            },
        ],
    },
};
