var path = require('path')
var htmlWebpackPlugin = require('html-webpack-plugin')
var miniCssExtractPlugin = require('mini-css-extract-plugin')
var copyWebpackPlugin = require('copy-webpack-plugin')
var cleanWebpackPlugin = require('clean-webpack-plugin')
//多页面函数
var htmlPluginConfig = function (name, chunks, title, favicon) {
	return {
		title: title,
		template: `./src/${name}.html`, //模板
		filename: `${name}.html`, //打包后文件名
		hash: true, //开启hash
		chunks: chunks,
	}
}
//多页面配置
var htmlArray = [{
		_html: "login",
		title: "登录",
		chunks: ['login'], //填写对应需要使用的js文件名  没有则默认引入全部js文件
		favicon: "./src/favicon.ico"
	},
	{
		_html: "talk",
		title: "聊天",
		chunks: ['talk'],
		favicon: "./src/favicon.ico"
	}
]
module.exports = function (env) {
	var plugins = [
		new miniCssExtractPlugin({
			filename: env.dev ? "css/[name].css" : "css/[name].[contenthash:8].css",
			publicPath: "./"
		}),
		new copyWebpackPlugin([{
			from: path.resolve(__dirname, "./src/libs"),
			to: "libs",
		}]),
		new cleanWebpackPlugin(['dist']),

	]
	htmlArray.forEach((element) => {
		plugins.push(new htmlWebpackPlugin(htmlPluginConfig(element._html, element.chunks, element.title, element.favicon)))
	})
	return {
		devServer: {
			host: "localhost",
			contentBase: path.join(__dirname, 'dist'), //运行那个文件夹
			port: '8080', //端口号
			overlay: true, //浏览器页面显示错误
			hot: true, //热更新
			compress: true, //启用gzip压缩
			disableHostCheck: true, //绕过主机检查
			proxy: {
				'/api': {
					target: 'https://alibaba-resource.evkeji.cn/',
					pathRewrite: {
						'^/api': ''
					},
					changeOrigin: true, // target是域名的话，需要这个参数，
					secure: false, // 设置支持https协议的代理
				}
			}
		},
		mode: env.dev ? 'development' : 'production',
		entry: {
			login: './src/js/login.js',
			talk: "./src/js/talk.js"
		},
		output: {
			path: path.resolve(__dirname, "./dist"),
			filename: "js/[name].[hash:8].js"
		},

		module: {
			rules: [{
					test: /\.js$/i,
					use: [{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"]
						}
					}]
				},
				{
					test: /\.(scss|sass|css)$/i,
					use: [{
							loader: miniCssExtractPlugin.loader,
							options: {
								publicPath: "../" //由于运行后css中引用文件路径是 "img/..."  需要配置css文件内默认路径为 "../"
							}
						},
						"css-loader", {
							loader: "postcss-loader",
							options: {
								plugins: [
									require("autoprefixer")
								]
							}
						},
						"sass-loader"
					]
				},
				{
					test: /\.(jpg|png|gif)$/i,
					use: {
						loader: "file-loader",
						options: {
							esModule: false,
							limit: 24 * 1024,
							name: "img/[name].[hash:8].[ext]",
						}
					}
				},
				{
					test: /\.html$/i,
					use: {
						loader: "html-loader"
					}
				},
			]
		},
		plugins,
		devtool: env.dev ? "source-map" : false
	}
}