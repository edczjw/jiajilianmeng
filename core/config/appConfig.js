const CONFIG = {
	//开发环境配置
	development:{
		//api访问域名
		// apiDomain:'http://api.fszhuazhuale.com',
		// apiDomain:'https://api.fstaolege.com',
		apiDomain:'https://api.fstaonais.com/',
		// apiDomain:'http://192.168.3.2:8084/',
		//静态资源路径前缀
		assetsPath:'/static',
		socketioUrl:'',
		language:'chs',
		//用于h5的版本管理区分
		version:'2.0',
		//验证码等待输入时间
		loginCodeSecond:30,
		loginCodeLength:6
	},
	production:{
		//api访问域名
		apiDomain:'https://api.fstaonais.com/',
		// apiDomain:'http://tlgapi.93kj.top',
		//静态资源路径前缀
		assetsPath:'/static',
		socketioUrl:'',
		language:'chs',
		version:'2.0',
		//验证码等待输入时间
		loginCodeSecond:30,
		loginCodeLength:6
	}
}
export default CONFIG[process.env.NODE_ENV];