const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

function resolve(dir) {
	return path.join(__dirname, dir);
}
module.exports = {
	// 是否为 Babel 或 TypeScript 使用 thread-loader。
	// 该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
	parallel: require("os").cpus().length > 1,
	devServer: {
		proxy: {
			"jplat-file-client/": {
				// target: "http://47.108.161.135:8080/",
				target: "http://10.6.74.249:8080/",
				changeOrigin: true,
				pathRewrite: {
					"^jplat-file-client/": "jplat-file-client/",
				},
			},
		},
		disableHostCheck: true,
	},
	publicPath: "./", // 基本路径
	outputDir: "dist", // 输出文件目录
	// assetsDir: "./assets",
	indexPath: "index.html",
	filenameHashing: true, // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
	lintOnSave: true, // 设置是否在开发环境下每次保存代码时都启用 eslint验证。
	productionSourceMap: false, //发布去掉sourceMap，泄露源代码
	css: {
		loaderOptions: {
			scss: {
				additionalData: `@import "./src/assets/css/common.scss";`,
			},
		},
	},
	chainWebpack: (config) => {
		config.resolve.alias
			.set("@", resolve("src"))
			.set("@img", resolve("src/assets/img"))
			.set("@css", resolve("src/assets/css"))
			.set("@utils", resolve("src/utils"))
			.set("@c", resolve("src/components"))
			.set("@views", resolve("src/views"));
	},
	configureWebpack: (config) => {
		// 入口文件
		config.entry.app = ["babel-polyfill", "./src/main.js"];
		config.externals = {
			vue: "Vue",
			"vue-router": "VueRouter",
			axios: "axios",
		};
		// 删除console插件
		let plugins = [
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: {
						drop_console: true,
						drop_debugger: true,
					},
					output: {
						// 去掉注释内容
						comments: true,
					},
					warnings: false,
				},
				sourceMap: false,
				parallel: true,
			}),
		];
		if (process.env.NODE_ENV === 'production') {// 为生产环境修改配置...
			config.mode = 'production';
			config.plugins = [...config.plugins, ...plugins];
			config["performance"] = {
				//打包文件大小配置
				maxEntrypointSize: 10000000,
				maxAssetSize: 30000000,
			};
		}
	},
};
