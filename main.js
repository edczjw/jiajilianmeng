import Vue from 'vue'
import App from './App'

import store from '@/store'

import core from 'core'

if(process.env.NODE_ENV ==='production'){
	Vue.config.productionTip = false
}else{
	Vue.config.productionTip = true
}

App.mpType = 'app'

Vue.use(core)

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
uni.$u.setConfig({
	// 修改$u.config对象的属性
	config: {
		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
		unit: 'rpx'
	},
	// 修改$u.props对象的属性
	props: {
		// 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
		radio: {
			size: 15
		}
		// 其他组件属性配置
		// ......
	}
})

const app = new Vue({
	...App,
	store:store
})

app.$mount()