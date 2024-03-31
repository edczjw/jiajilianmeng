import $utils from './helper.js';
import $cj from './crypto-js.js';
export default{
	key: "0123456780ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	code: "02T01101T01X01101T01D03402102R01101K01G01101T01X01101W01C01101W01L01101W01J01101L01J02T02T",
	parseQueryString(url){
	    let urlSplit=url.split("?");
		if(urlSplit.length ==2){
			return urlSplit[1];
		}
	    return '';
	},
	sign(token,timestamp,params){
		if (typeof params == "string") {
			return this.paramsStrSort(params,token,timestamp);
		} else if (typeof params == "object") {
			let arr = [];
			for (let i in params) {
				if(!$utils.isEmpty(params[i])){
					arr.push((i + "=" + params[i]));
				}
			}
			return this.paramsStrSort(arr.join(("&")),token,timestamp);
		}
		return '';
	},
	paramsStrSort(paramsStr,token,timestamp) {
		let urlStr = 'timestamp='+ timestamp;
		if(!$utils.isEmpty(paramsStr)){
			urlStr = urlStr + "&" + paramsStr;
		}
		
		if(!$utils.isEmpty(token) && urlStr.indexOf("token") == -1){
			urlStr = urlStr+"&token=" + token;
		}
		urlStr = urlStr.split("&").sort().join("&");
		urlStr = urlStr + "&key=" + this.getK(this.fromCode(this.code));
		let afterSign = $cj.MD5(urlStr).toString()
	    return afterSign;
	},
	getK(code){  
	   code=unescape(code);  
	   var c=String.fromCharCode(code.charCodeAt(0)-code.length);  
	   for(var i=1;i<code.length;i++){  
	       c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));  
	   }  
	   return c;  
	},
	fromCode(str) {
	    var key = this.key;
	    var l = key.length; 
	    var b, b1, b2, b3, d = 0, s;
	    s = new Array(Math.floor(str.length / 3)); 
	    b = s.length; 
	    for (var i = 0; i < b; i ++) { 
	        b1 = key.indexOf(str.charAt(d)); 
	        d ++;
	        b2 = key.indexOf(str.charAt(d));
	        d ++;
	        b3 = key.indexOf(str.charAt(d));
	        d ++;
	        s[i] = b1 * l * l + b2 * l + b3
	    }
	    // b = eval("String.fromCharCode(" + s.join(',') + ")");
		b = String.fromCharCode.apply(null, s);
	    return b;
	},
}
