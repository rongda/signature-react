/* eslint-disable */
module.exports = {
	outDir: './dist',        // 将生成的文件放入输出目录下，默认为 dist
	port: 80,              // 监听端口
	env: {
		dev: 'development',
		prod: 'production'
	},
	url: {
		test: '.app.sign.sicherdata.net',
		dev: '.app1.sign.sicherdata.net',
		local: '.app1.sign.sicherdata.net',
		prod: '.app.sign.sicherdata.net'
	},
	api: {
		test: 'https://supersign.sicherdata.net',
		dev: 'http://192.168.100.2:6070',
		local: 'http://192.168.100.2:6070',
		prod: 'https://youduo.sicherdata.net'
	}
}
