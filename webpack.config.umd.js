module.exports = (config, options) => {
    console.log(config, config.module.rules, options);
    return {
        ...config,
        devtool: 'source-map',
        module: {
            rules: [
                ...config.module.rules,
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },

        output: {
            // ...config.output,
            filename: '[name].bundle.umd.js',
            libraryTarget: 'umd',
            umdNamedDefine: true,
        },
        // mode: config.mode,
        // entry: config.entry.main[0],
        // root:
        optimization: {
            ...config.optimization,
            splitChunks: false,
        },
    };
};
