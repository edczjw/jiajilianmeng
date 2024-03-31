// import $pagesConfig from "../../../core/config/pageConfig.js";
import $pagesConfig from "@/core/config/pagesConfig.js";

export default{
	"id": "6",
	"title": "个人中心",
	"name": null,
	"type": "center",
	"component": [
		{
			"name": "头部",
			"title": "头部",
			"component": "wwj-my-head",
			"container": false,
			"icon": "account-circle-fill",
			"type": "base",
			"enableCustomTemplate": true,
			"props": {
				"isLogin": 1,
				"loginBtnTop": 10,
				"loginBtnWidth": 75,
				"loginBtnHeight": 25,
				"loginBtnColor": "#333",
				"loginBtnBgColor": "#fff",
				"loginBtnBold": 0,
				"loginBtnFontSize": 14,
				"noLoginType": 1,
				"missingFace": "",
				"height": 110,
				"cover": "",
				"colorType": "1",
				"color": "#fff",
				"bgColor": "#f6f0eb",
				"linearColor": {
					"deg": 0,
					"primaryColor": "#F04E2E",
					"deputyColor": "#FA3434",
					"color": "linear-gradient(0deg,#F04E2E 0%,#FA3434 100%)"
				},
				"isBottomRadius": 0,
				"nicknameColor": "#fff",
				"nicknameIsBold": 1,
				"isSignin": 1,
				"signinMode": [
					"button"
				],
				"sgninBgColor": "#fff",
				"sgninColor": "#333",
				"notifyType": 1,
				"notifyColor": "#fff",
				"isMemberLevel": 1,
				"memberLevelType": 1,
				"levelCaver": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0xMi0xOVQxMDozMzoyMyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMTItMTlUMTE6MTA6MjkrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMTItMTlUMTE6MTA6MjkrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODk1YTc2OGYtMzUxNC1jMTQy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",
				"levelColor": "#fff",
				"levelBgColor": "#FFD5CF",
				"avatarSize": 60,
				"isAvatarBorder": 1,
				"avatarBorderColor": "rgba(255,255,255,0.6)",
				"avatarBorderSize": 3,
				"badegColor": "#fff",
				"badegBgColor": "#fa3534",
				"list": [
					{
						"title": "个人资料",
						"num": 99,
						"path": "userInfo",
						"key": "userInfo",
						"checked": true,
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.userInfo.path,
						"needAuth":true
					}
				]
			},
			"offsetTop": 0,
			"offsetLeft": 10,
			"data": []
		},
		{
			"name": "统计菜单",
			"title": "我的口袋",
			"component": "wwj-statistics-menu",
			"container": false,
			"icon": "pie-chart-2-fill",
			"type": "base",
			"enableCustomTemplate": true,
			"props": {
				"pushTop": 94,
				"paddingPushTop": 0,
				"paddingTop": 10,
				"paddingBottom": 10,
				"leftRight": 10,
				"isCellItem": 0,
				"fontSize": 16,
				"isBold": 1,
				"arrow": 1,
				"title": "我的口袋",
				"value": "",
				"col": 4,
				"borderRadius": 10,
				"borderShow": 0,
				"margin": 0,
				"bgColor": "",
				"color": "#555500",
				"numFontSize": 14,
				"titleFontSize": 12,
				"list": [
					{
						"title": "金币",
						"num": 99,
						"path": "account",
						"key": "account",
						"checked": true,
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.recharge.path,
						"needAuth":true
					},
					{
						"title": "积分",
						"num": 99,
						"path": "integral",
						"key": "integral",
						"checked": true,
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.integral.path,
						"needAuth":true
					},
					{
						"title": "收藏",
						"num": 99,
						"path": "collect",
						"key": "collect",
						"checked": true,
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.collect.path,
						"needAuth":true
					},
					{
						"title": "娃娃",
						"num": 99,
						"path": "doll",
						"key": "doll",
						"checked": true,
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.integral.path,
						"needAuth":true
					}
				]
			},
			"offsetTop": 106,
			"offsetLeft": 80,
			"data": []
		},
		{
			"name": "推广中心",
			"title": "推广中心",
			"component": "wwj-distribution",
			"container": false,
			"type": "base",
			"icon": "user-shared-2-fill",
			"props": {
				"pushTop": 0,
				"mode": "store",
				"paddingTop": 0,
				"paddingBottom": 10,
				"leftRight": 10,
				"borderRadius": 10,
				"isCellItem": 1,
				"fontSize": 16,
				"isBold": 1,
				"arrow": 1,
				"bgColor": "#fff",
				"title": "推广中心",
				"value": "",
				"cell": 3,
				"store": [
					{
						"title": "推广人数",
						"num": "9999.99",
						"key": "countExtend",
						"checked": true
					},
					{
						"title": "未提现佣金",
						"num": "9999.99",
						"key": "sumUnWithdraw",
						"checked": true
					},
					{
						"title": "累计佣金",
						"num": "9999.99",
						"key": "sumCommission",
						"checked": true
					}
				],
				"warehouse": [
					{
						"title": "今日货款收益",
						"num": "9999.99",
						"key": "date",
						"checked": true
					},
					{
						"title": "本月货款收益",
						"num": "9999.99",
						"key": "month",
						"checked": true
					},
					{
						"title": "销货笔数",
						"num": "99",
						"key": "sale_stock",
						"checked": true
					},
					{
						"title": "累计货款收益",
						"num": "9999.99",
						"key": "accumulate_brokerage",
						"checked": true
					}
				]
			},
			"offsetTop": 421,
			"offsetLeft": 290,
			"data": []
		},
		{
			"name": "卡片导航",
			"title": "卡片导航",
			"component": "dz-card",
			"container": false,
			"icon": "grid-fill",
			"type": "base",
			"enableCustomTemplate": true,
			"props": {
				"pushTop": 0,
				"badge": 1,
				"menuPushTop": 0,
				"paddingTop": 0,
				"paddingBottom": 10,
				"leftRight": 10,
				"menuRadius": 10,
				"isCellItem": 1,
				"fontSize": 16,
				"isBold": 1,
				"arrow": 0,
				"title": "游戏成果",
				"value": "",
				"col": 3,
				"height": 7,
				"borderRadius": 10,
				"isPage": 0,
				"mode": "round",
				"colNum": 3,
				"isName": 1,
				"widthHeight": 28,
				"bgColor": "#fff",
				"dotColor": "red",
				"margin": 0,
				"productLimit": 12,
				"titleLink": {
					"activeMenuType": "",
					"activeMenu": ""
				},
				"list": [
					{
						"cate_title": "娃娃行囊",
						"cover": "/static/icon/my-doll.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.dollBag.path,
						"needAuth":true,
						"key":"dollBag"
					},
					{
						"cate_title": "娃娃订单",
						"cover": "/static/icon/my-order-doll.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.order.path + "?type=1",
						"needAuth":true,
						"key":"order",
						"method":"order"
					},
					{
						"cate_title": "兑换订单",
						"cover": "/static/icon/my-order-exchange.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.order.path + "?type=2",
						"needAuth":true,
						"key":"order",
						"method":"order"
					} 
				]
			},
			"offsetTop": 539,
			"offsetLeft": 360,
			"data": []
		},
		{
			"name":"轮播图",
			"title":"轮播图",
			"component":"dz-swiper",
			"container":false,
			"icon":"device-fill",
			"type":"base",
			"enableCustomTemplate":true,
			"props":{
				"pushTop":0,
				"productLimit":1,
				"bgColor":"#f3f4f6",
				"borderRadius":20,
				"mode":"round",
				"height":90,
				"indicatorPos":"bottomCenter",
				"effect3d":1,
				"paddingTop":0,
				"paddingBottom":0,
				"leftRight":10,
				"title":0,
				"list":[
					{
						"activeMenu":"1-1",
						"activeMenuType":"pageView",
						"cover":"https://oss.fszhuazhuale.com/test/index-banner.png?v=5",
						"title":"",
						"pageView":"recharge",
						"pageName":"充值中心",
						"active":27,
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.recharge.path,
						"needAuth":true
					}
				]
			},
			"offsetTop":0,
			"offsetLeft":10,
			"data":[

			]
		},
		{
			"name": "我的订单",
			"title": "我的订单",
			"component": "wwj-my-order",
			"container": false,
			"icon": "file-list-3-fill",
			"type": "base",
			"enableCustomTemplate": true,
			"props": {
				"pushTop": 27,
				"badge": 1,
				"menuPushTop": 0,
				"paddingTop": 10,
				"paddingBottom": 10,
				"leftRight": 10,
				"isCellItem": 1,
				"fontSize": 16,
				"isBold": 1,
				"arrow": 1,
				"title": "我的订单",
				"value": "",
				"col": 5,
				"height": 7,
				"borderRadius": 10,
				"isPage": 0,
				"mode": "round",
				"colNum": 2,
				"isName": 1,
				"widthHeight": 27,
				"menuRadius": 10,
				"bgColor": "#fff",
				"dotColor": "red",
				"badegColor": "#fff",
				"badegBgColor": "#fa3534",
				"margin": 0,
				"productLimit": 1,
				"list": [
					{
						"title": "待发货",
						"cover": "",
						"status": "1",
						"checked": true,
						"icon": "deliver"
					},
					{
						"title": "待收货",
						"cover": "",
						"status": "2",
						"checked": true,
						"icon": "send"
					},
					{
						"title": "已完成",
						"cover": "",
						"status": "3",
						"checked": true,
						"icon": "evaluate"
					},
					{
						"title": "全部订单",
						"cover": "",
						"status": "0",
						"checked": true,
						"icon": "refund"
					}
				]
			},
			"offsetTop": 162,
			"offsetLeft": 150,
			"data": []
		},
		{
		     "name": "魔方",
		     "title": "魔方",
		     "component": "dz-rubiks-cube",
		     "container": false,
		     "type": "base",
		     "icon": "dashboard-fill",
		     "enableCustomTemplate": false,
		     "props": {
		         "mode": "single-file",
		         "radius": 12,
		         "Spacing": 0,
		         "clearance": 5,
		         "leftRight": 12,
		         "topButtom": 0,
		         "num": 2,
		         "list": [
		             {
		                 "activeMenuType": "custom",
		                 "activeMenu": "4-1",
		                 "cover": "/static/image/ranking.png",
		                 "id": "3",
		                 "title": "排行榜"
		             },
		             {
		                 "activeMenuType": "product",
		                 "activeMenu": "2-1",
		                 "cover": "/static/image/pointsMall.png",
		                 "id": "19",
		                 "type": "product",
		                 "title": "积分商城"
		             }
		         ],
		         "heightConfig": {
		             "single-file": {
		                 "height": 66
		             },
		             "row2Col2": {
		                 "height": 66
		             },
		             "leftRight2": {
		                 "height": 107
		             },
		             "topBottom2": {
		                 "topHeight": 107,
		                 "bottomHeight": 107
		             },
		             "leftRight3": {
		                 "topHeight": 95,
		                 "bottomHeight": 95
		             }
		         }
		     },
		     "offsetTop": 223,
		     "offsetLeft": 220,
		     "data": []
		 },
		 {
		     "name": "间隔槽",
		     "title": "间隔槽",
		     "component": "dz-gap",
		     "container": false,
		     "type": "base",
		     "icon": "checkbox-blank-fill",
		     "props": {
		         "height": 10,
		         "bgColor": null
		     },
		     "offsetTop": 2167,
		     "offsetLeft": 850,
		     "data": []
		 },
		{
			"name": "分销",
			"title": "分销",
			"component": "dz-distribution",
			"container": false,
			"type": "base",
			"icon": "user-shared-2-fill",
			"props": {
				"pushTop": 0,
				"mode": "warehouse",
				"paddingTop": 0,
				"paddingBottom": 10,
				"leftRight": 10,
				"borderRadius": 10,
				"isCellItem": 1,
				"fontSize": 16,
				"isBold": 1,
				"arrow": 1,
				"bgColor": "#fff",
				"title": "经销商中心",
				"value": "",
				"cell": 4,
				"store": [
					{
						"title": "累计佣金",
						"num": "9999.99",
						"key": "accumulate_brokerage",
						"checked": true
					},
					{
						"title": "可用佣金",
						"num": "9999.99",
						"key": "user_brokerage",
						"checked": true
					},
					{
						"title": "未结算佣金",
						"num": "9999.99",
						"key": "frozen_brokerage",
						"checked": true
					},
					{
						"title": "已提现",
						"num": "9999.99",
						"key": "amount_drawn_brokerage",
						"checked": true
					}
				],
				"warehouse": [
					{
						"title": "今日货款收益",
						"num": "9999.99",
						"key": "date",
						"checked": true
					},
					{
						"title": "本月货款收益",
						"num": "9999.99",
						"key": "month",
						"checked": true
					},
					{
						"title": "销货笔数",
						"num": "99",
						"key": "sale_stock",
						"checked": true
					},
					{
						"title": "累计货款收益",
						"num": "9999.99",
						"key": "accumulate_brokerage",
						"checked": true
					}
				]
			},
			"offsetTop": 305,
			"offsetLeft": 220,
			"data": []
		},
		
		{
			"name": "卡片导航",
			"title": "卡片导航",
			"component": "dz-card",
			"container": false,
			"icon": "grid-fill",
			"type": "base",
			"enableCustomTemplate": true,
			"props": {
				"pushTop": 0,
				"badge": 1,
				"menuPushTop": 0,
				"paddingTop": 0,
				"paddingBottom": 10,
				"leftRight": 10,
				"menuRadius": 10,
				"isCellItem": 1,
				"fontSize": 16,
				"isBold": 1,
				"arrow": 0,
				"title": "我的服务",
				"value": "",
				"col": 4,
				"height": 7,
				"borderRadius": 10,
				"isPage": 0,
				"mode": "round",
				"colNum": 2,
				"isName": 1,
				"widthHeight": 32,
				"bgColor": "#fff",
				"dotColor": "red",
				"margin": 0,
				"productLimit": 12,
				"titleLink": {
					"activeMenuType": "",
					"activeMenu": ""
				},
				"list": [
					{
						"cate_title": "在线客服",
						"cover": "/static/icon/onlineCustomer.png",
						"method":"customerService",
						"needAuth":true
					},
					/* {
						"cate_title": "消息中心",
						"cover": "/static/icon/message.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.message.path,
						"needAuth":true,
						"key":"message"
					}, */
					{
						"cate_title": "充值钜惠",
						"cover": "/static/icon/recharge.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.recharge.path,
						"needAuth":true,
						"key":"recharge"
					},
					{
						"cate_title": "我的收藏",
						"cover": "/static/icon/collect.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.collect.path,
						"needAuth":true,
						"key":"collect"
					},
					/* {
						"cate_title": "积分兑币",
						"cover": "/static/icon/jifen.png",
						"method":"jifenExchangeCoin",
						"needAuth":true
					}, */
					{
						"cate_title": "抓取记录",
						"cover": "/static/icon/gamerecord.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.gamerecord.path,
						"needAuth":true,
						"key":"gamerecord"
					},
					{
						"cate_title": "地址管理",
						"cover": "/static/icon/address.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.address.path,
						"needAuth":true,
						"key":"address"
					},
					/* {
						"cate_title": "金币明细",
						"cover": "/static/icon/coin.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.bill.path,
						"needAuth":true
					}, */
					{
						"cate_title": "邀请领金币",
						"cover": "/static/icon/partner.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.poster.path,
						"key":"poster"
					},
					/* {
						"cate_title": "社区精选",
						"cover": "/static/icon/discover.png",
						"jumpType":"innerPage",
						"jumpLink":$pagesConfig.discover.path,
						"key":"discover"
					},
					{
						"cate_title": "加入粉丝群",
						"cover": "/static/icon/addgroup.png",
						"method":"addgroup",
						"needAuth":true
					}, */
					{
						"cate_title": "设置",
						"cover": "/static/icon/set.png",
						//页面跳转类型jumpType:innerWebview,innerPage
						"jumpType":"innerPage",
						"jumpLink":"/pages_game/user/set/set",
						"needAuth":true,
						"key":"set"
					}
				]
			},
			"offsetTop": 539,
			"offsetLeft": 360,
			"data": []
		},
		{
			"name": "标题",
			"title": "标题",
			"component": "dz-title",
			"container": false,
			"type": "base",
			"icon": "edit-2-fill",
			"props": {
				"title": "为你推荐",
				"mode": "line",
				"barColor": "#FD8F8F",
				"barBokehColor": "#f3f4f6",
				"leftRight": 0,
				"paddingTop": 0,
				"paddingBottom": 0,
				"bgColor": "",
				"textAlign": "left",
				"coverLeft": "",
				"coverRight": "",
				"fontSize": 18,
				"titleColor": "#333",
				"barWidth": 95,
				"barHeight": 8,
				"iconWidth": 26,
				"iconHeight": 26,
				"pushTop": 0,
				"bold": 1,
				"tipConfig": {
					"title": "描述",
					"status": 1,
					"fontSize": 12,
					"color": "#333"
				}
			},
			"offsetTop": 853,
			"offsetLeft": 430,
			"data": []
		},
		{
			"name": "商品列表",
			"title": "商品列表",
			"component": "dz-product-list",
			"container": false,
			"type": "base",
			"icon": "function-fill",
			"enableCustomTemplate": false,
			"props": {
				"isList": "2",
				"pushTop": 0,
				"isLoading": "1",
				"productForm": {
					"loadingType": "guessYouLike",
					"cate_id": "",
					"is_hot": "",
					"is_recommend": "",
					"is_new": "",
					"pageSize": 10
				},
				"productType": "product",
				"productLimit": 1,
				"dataSource": "default",
				"leftRight": 12,
				"topBottom": 10,
				"maxHeight": 160,
				"marketPriceShow": 1,
				"clearance": 6,
				"radius": 10,
			},
			"offsetTop": 895,
			"offsetLeft": 500,
			"data": []
		}
	],
	"params": "[]",
	"bottom_tabbar": "0",
	"font_colour": "",
	"top_colour": "",
	"page_colour": "",
	"background_picture": "",
	"is_default": "0",
	"status": "1",
	"created_at": "1640775846",
	"updated_at": "1641559781"
}