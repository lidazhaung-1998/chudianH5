var path = require('path')
var htmlWebpackPlugin = require('html-webpack-plugin')
var miniCssExtractPlugin = require('mini-css-extract-plugin')
var cleanWebpackPlugin = require('clean-webpack-plugin')
module.exports =  function(env) {
	var plugins = [		 
		new miniCssExtractPlugin({
			filename:env.dev ? "css/[name].css" : "css/[name].[contenthash:8].css",
			publicPath:"./"
		}),
		new cleanWebpackPlugin(['dist']),
		new htmlWebpackPlugin({
			template:"./src/index.html",
			filename:"index.html",
			favicon:"./src/favicon.ico",
		})
	]
	return {
		devServer: {
			host:"192.168.25.126",        
			contentBase: path.join(__dirname, 'dist'), //运行那个文件夹
			port: "8080", //端口号
			overlay: true, //浏览器页面显示错误
			hot: true, //热更新
			compress: true, //启用gzip压缩
			disableHostCheck: true,//绕过主机检查
			inline:true,            
			progress:true,          //显示打包进度
		},
		mode: env.dev ? 'development' : 'production',
		entry: './src/js/index.js',
		output: {
			path: path.resolve(__dirname, "./dist"),
			filename: env.dev ? "js/[name].js" : "js/[name].[chunkhash:8].js",
		},
		
		module:{
			rules:[
				{
					test:/\.js$/i, use:[{
						loader:"babel-loader",
						options:{
							presets:["@babel/preset-env"]
						}
					}]
				},
				{
					test:/\.(scss|sass|css)$/i, use:[
						{
							loader:miniCssExtractPlugin.loader,
							options:{
								publicPath:"../"                     //运行后css中引用文件路径是 "css/img/..."  需要配置css文件内默认路径为 "../"
							}
						},
						"css-loader", {
						loader:"postcss-loader",
						options:{
							plugins:[
								require("autoprefixer")
							]
						}
					},"sass-loader"]
				},
				{
					test:/\.(jpg|png|gif|webp)$/i, use:[
						{
							loader:"url-loader",
							options:{
								esModule:false,
								limit:3 * 1024,     // 3*1024
								name:"img/[name].[hash:8].[ext]",
							}
						},
						{
							loader: 'image-webpack-loader',
							options: {
								bypassOnDebug: true,
							}
						}
					]
				},
				{
					test:/\.html$/i, use: {loader:"html-loader"}
				},
			]
		},
		plugins,
		devtool: env.dev ? "source-map" : false
	}
}
