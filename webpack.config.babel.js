import autoprefixer from "autoprefixer";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";

const extractCSS = new ExtractTextPlugin({
    filename: '[name].css'
});

const config = {
    devtool: 'source-map',
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: './js/app.js'
    },
    output: {
        path: path.resolve(__dirname),
        filename: '[name].bundle.js',
        libraryTarget: 'window'
    },
    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        port: 9000
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            use: [{
                loader: 'babel-loader',
                options: { presets: ['env'] }
            }]
        }, {
            test: /\.scss$/,
            include: path.resolve(__dirname, 'src'),
            use: extractCSS.extract({
                use: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer({
                                browsers: ['last 3 versions']
                            })]
                        }
                    },
                    'sass-loader'
                ]
            })
        }]
    },
    plugins: [
        extractCSS
    ]
};

module.exports = config;