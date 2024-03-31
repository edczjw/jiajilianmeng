/*
 *上传文件到阿里云oss
 *@param - filePath :文件的本地资源路径
  @param - path :上传oss哪个路径下
  postfix : 文件后缀
 *@param - successc:成功回调
 *@param - failc:失败回调
 */
const uploadFile = function(filePath, fix, successc, failc,ossCredit) {
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	let path = year + "-" + month + "-" + day;

	fix = fix.replace('.', '')
	if (!filePath || filePath.length < 9) {
		wx.showModal({
			title: '文件错误',
			content: '请重试',
			showCancel: false,
		})
		return;
	}
	if (!fix) {
		fix = ''
	}
	//存放文件命名格式：自定义时间戳给文件名字(可以自己改)
	const aliyunFileKey = path + '/' + new Date().getTime() + parseInt(Math.random() * (9999 - 1000 + 1) + 1000,
		10) + '.' + fix.replace('.', '');

	return uni.uploadFile({
		url: ossCredit.host, //开发者服务器 url
		filePath: filePath, //要上传文件资源的路径
		name: 'file', //必须填file
		formData: {
			'key': ossCredit.dir + aliyunFileKey,
			'policy': ossCredit.policy,
			'OSSAccessKeyId': ossCredit.accessid,
			'signature': ossCredit.signature,
			'success_action_status': '200',
		},
		success: function(res) {
			if (res.statusCode != 200) {
				failc(new Error('上传错误:' + JSON.stringify(res)))
				return;
			}
			successc(ossCredit.dir + aliyunFileKey);
		},
		fail: function(err) {
			err.wxaddinfo = ossCredit.host;
			failc(err);
		},
	})


	/* uni.http.get('oss/getCredit?type=img').then(res => {
		console.log(res);
		var data = res.data;

		return uni.uploadFile({
			url: data.host, //开发者服务器 url
			filePath: filePath, //要上传文件资源的路径
			name: 'file', //必须填file
			formData: {
				'key': data.dir + aliyunFileKey,
				'policy': data.policy,
				'OSSAccessKeyId': data.accessid,
				'signature': data.signature,
				'success_action_status': '200',
			},
			success: function(res) {
				console.log(res);
				if (res.statusCode != 200) {
					failc(new Error('上传错误:' + JSON.stringify(res)))
					return;
				}
				successc('/' + aliyunFileKey);
			},
			fail: function(err) {
				err.wxaddinfo = data.host;
				failc(err);
			},
		})
	}) */
}

module.exports = uploadFile;
