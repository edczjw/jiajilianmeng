export default {
    id: "1",
    title: "首页配置",
    name: null,
    type: "home",
    component: [
        {
            "name": "头部",
            "title": "头部",
            "component": "dz-head",
            "container": false,
            "type": "base",
            "icon": "search-line",
            "enableCustomTemplate": false,
            "props": {
                "spacing": 10,
                "value": "",
                "shape": "round",
                "inputAlign": "left",
                "isDiy": 1,
                "isLeft": 1,
                "leftType": "2",
                "leftText": "logo",
                "leftStyle": {
                    "fontSize": 16,
                    "color": "#333",
                    "isBold": 1
                },
				"cover":"/static/logo.png",
                "coverWidth": 200,
				"coverHeight":55,
                "borderRadius": 0,
                "isRight": 1,
                "rightType": "2",
                "rightStyle": {
                    "fontSize": 19,
                    "color": "#333"
                },
                "bgColor": "#f3f4f6",
                "topBottom": 6,
                "leftRight": 12
            },
            "offsetTop": 0,
            "offsetLeft": 10,
            "data": {}
        },
		{
		    "name": "下拉加载",
		    "title": "下拉加载",
		    "component": "wwj-loading",
		},
		/* {
		    "name": "搜索",
		    "title": "搜索",
		    "component": "dz-search",
		    "container": false,
		    "type": "base",
		    "icon": "search-line",
		    "enableCustomTemplate": false,
		    "props": {
		        "spacing": 10,
		        "value": "",
		        "shape": "square",
		        "inputAlign": "left",
		        "isDiy": 1,
		        "coverSize": 30,
		        "borderRadius": 0,
		        "bgColor": "#fff",
		        "searchBgColor": "#fff",
		        "topBottom": 6,
		        "leftRight": 10
		    },
		    "offsetTop": 0,
		    "offsetLeft": 10,
		    "data": {
		        "hot_search_default": "",
		        "hot_search_list": [
		            "日用品",
		            "布公仔"
		        ]
		    }
		}, */
        {
            "name": "轮播图",
            "title": "轮播图",
            "component": "dz-swiper",
            "container": false,
            "icon": "device-fill",
            "type": "base",
            "enableCustomTemplate": true,
            "props": {
                "bgColor": "#f3f4f6",
                "borderRadius": 10,
                "mode": "slider",
                "height": 160,
                "indicatorPos": "bottomCenter",
                "effect3d": 1,
                "topBottom": 6,
                "leftRight": 0,
                "title": 0,
                "list": []
            },
            "offsetTop": 47,
            "offsetLeft": 80,
            "data": []
        },
		{
		    "name": "导航",
		    "title": "导航",
		    "component": "dz-grid-menu",
		    "container": false,
		    "icon": "grid-fill",
		    "type": "base",
		    "enableCustomTemplate": true,
		    "props": {
		        "col": "4",
		        "isPage": "1",
		        "isName": 1,
		        "widthHeight": 45,
		        "borderRadius": 10,
		        "radius": 10,
		        "topBottom": 8,
		        "leftRight": 10,
		        "bgColor": "#fff",
		        "dotColor": "red",
		        "mode": "round",
		        "colNum": 1,
		        "list": [
		            {
		                "cate_title": "口令红包",
		                "cover": "/static/image/kl.png",
		                "activeMenuType": "",
		                "delId": 0
		            },
		            {
		                "cate_title": "特惠充值",
		                "cover": "/static/image/cz.png",
		                "activeMenuType": "",
		                "delId": 1
		            },
		            {
		                "cate_title": "积分商城",
		                "cover": "/static/image/sc.png",
		                "activeMenuType": "",
		                "delId": 2
		            },
		            {
		                "cate_title": "邀请有礼",
		                "cover": "/static/image/yq.png",
		                "activeMenuType": "",
		                "delId": 3
		            },
		            {
		                "cate_title": "大神榜",
		                "cover": "",
		                "activeMenuType": "",
		                "delId": 4
		            },
		            {
		                "cate_title": "我的订单",
		                "cover": "",
		                "activeMenuType": "",
		                "delId": 5
		            }
		        ],
		        "topButtom": 0,
		        "clearance": 0
		    },
		    "offsetTop": 345,
		    "offsetLeft": 290,
		    "data": []
		},
		{
		    "name": "公告",
		    "title": "公告",
		    "component": "dz-notice-bar",
		    "container": false,
		    "type": "base",
		    "icon": "airplay-fill",
		    "enableCustomTemplate": false,
		    "props": {
		        "mode": "horizontal",
		        "volumeIcon": "1",
		        "moreIcon": 1,
		        "title": "公告",
		        "color": "#333",
		        "iconColor": "#333",
		        "bgColor": "#fff",
		        "topBottom": 8,
		        "leftRight": 12,
		        "radius": 10,
		        "titleStyle": {
		            "fontSize": 16,
		            "isBold": "1",
		            "color": "#333"
		        },
		        "cover": "",
		        "coverSize": 20
		    },
		    "offsetTop": 345,
		    "offsetLeft": 290,
		    "data": [
		        {
		            "id": "1",
		            "title": "YYDShop来了",
		            "cover": "https://yydshop-b2c.vjlau.com/attachment/images/2021/12/25/image_1640424193_p1xTZZ1h.png",
		            "synopsis": "",
		            "view": "4",
		            "created_at": "1640426478"
		        }
		    ]
		},
        {
            "name": "图片广告",
            "title": "图片广告",
            "component": "dz-banner",
            "container": false,
            "type": "base",
            "icon": "image-2-fill",
            "enableCustomTemplate": false,
			"height": 100,
			"leftRight": 12,
			"topBottom": 0,
			"radius": 12,
            "props": null,
            "area": [],
            "offsetTop": 410,
            "offsetLeft": 360,
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
		        "height": 8,
		        "bgColor": null
		    },
		    "offsetTop": 209,
		    "offsetLeft": 150,
		    "data": []
		},
        {
            "name": "标配导航",
            "title": "标配导航",
            "component": "dz-section",
            "container": false,
            "type": "base",
            "icon": "input-cursor-move",
            "enableCustomTemplate": false,
            "props": {
                "title": "趣味评测圈",
                "right": 1,
                "showLine": "0",
                "lineColor": null,
                "bgColor": null,
                "topBottom": 10,
                "leftRight": 14,
                "link": {
                    "activeMenu": "1-1",
                    "pageView": "article",
                    "pageName": "文章首页",
                    "active": 31,
                    "activeMenuType": "pageView"
                },
                "bold": "1"
            },
            "offsetTop": 521,
            "offsetLeft": 500,
            "data": []
        },
        {
            "name": "文章列表",
            "title": "文章列表",
            "component": "dz-article",
            "container": false,
            "type": "base",
            "icon": "list-unordered",
            "props": {
                "dataSource": "manual",
                "productLimit": 2,
                "mode": "default",
                "topBottom": 0,
                "leftRight": 12,
                "radius": 12,
                "cardMargin": 12,
                "cardPadding": 10,
                "contentPadding": 0,
                "width": 112,
                "height": 75,
                "radius1": 10,
                "radius2": 10,
                "isDescription": 1,
                "isTime": 1,
                "isViewCount": 1,
                "list": [
                    {
                        "title": "Dr独特艾琳白茶香氛护手霜",
                        "diyCover": "https://yydshop-b2c.vjlau.com/attachment/images/2022/01/05/image_1641365313_w2WvxV0u.png",
                        "cover": "https://yydshop-b2c.vjlau.com/attachment/images/2022/01/05/image_1641365313_fR71Xp9z.jpg",
                        "description": "高定香氛 指尖生香",
                        "view_count": "4",
                        "created_at": "1641352682",
                        "id": "1"
                    },
                    {
                        "title": "小米平板5Pro",
                        "diyCover": "https://yydshop-b2c.vjlau.com/attachment/images/2022/01/05/image_1641365749_U3Y4z54y.jpg",
                        "cover": "https://yydshop-b2c.vjlau.com/attachment/images/2022/01/05/image_1641365749_U3Y4z54y.jpg",
                        "description": "最佳购买平板电脑？",
                        "view_count": "0",
                        "created_at": "1641357761",
                        "id": "2"
                    }
                ]
            },
            "offsetTop": 562,
            "offsetLeft": 570,
            "data": [
                {
                    "id": "1",
                    "title": "Dr独特艾琳白茶香氛护手霜",
                    "cover": "https://yydshop-b2c.vjlau.com/attachment/images/2022/01/05/image_1641365313_fR71Xp9z.jpg",
                    "cate_id": "1",
                    "description": "高定香氛 指尖生香",
                    "position": "0",
                    "link": "",
                    "author": "YYDShop",
                    "view_count": "7",
                    "sort": "999",
                    "status": "1",
                    "created_at": "1641352682",
                    "updated_at": "1641365333",
                    "cate": {
                        "id": "1",
                        "title": "个人美妆",
                        "sort": "999",
                        "level": "1",
                        "pid": "0",
                        "tree": "tr_0 ",
                        "status": "1",
                        "created_at": "1641352446",
                        "updated_at": "1641352446"
                    },
                    "tags": []
                },
                {
                    "id": "2",
                    "title": "小米平板5Pro",
                    "cover": "https://yydshop-b2c.vjlau.com/attachment/images/2022/01/05/image_1641365749_U3Y4z54y.jpg",
                    "cate_id": "2",
                    "description": "最佳购买平板电脑？",
                    "position": "0",
                    "link": "",
                    "author": "YYDS",
                    "view_count": "6",
                    "sort": "999",
                    "status": "1",
                    "created_at": "1641357761",
                    "updated_at": "1641365836",
                    "cate": {
                        "id": "2",
                        "title": "电脑办公",
                        "sort": "999",
                        "level": "1",
                        "pid": "0",
                        "tree": "tr_0 ",
                        "status": "1",
                        "created_at": "1641357381",
                        "updated_at": "1641357381"
                    },
                    "tags": []
                }
            ]
        },
       {
            "name": "标题",
            "title": "标题",
            "component": "dz-title",
            "container": false,
            "type": "base",
            "icon": "edit-2-fill",
            "props": {
                "title": "娃娃部落",
                "mode": "icon",
                "barColor": "#2979ff",
                "barBokehColor": "#f3f4f6",
                "coverLeft": "https://yydshop-b2c.vjlau.com/attachment/images/2021/12/25/image_1640426866_XaTC51Dv.png",
                "coverRight": "https://yydshop-b2c.vjlau.com/attachment/images/2021/12/25/image_1640426870_RvwOofzu.png",
                "fontSize": 18,
                "titleColor": "#333",
                "barWidth": 95,
                "barHeight": 8,
                "iconWidth": 60,
                "iconHeight": 34,
                "leftRight": 0,
                "paddingTop": 10,
                "paddingBottom": 10,
                "bgColor": "",
                "bold": 1,
                "textAlign": "left",
                "tipConfig": {
                    "title": "描述",
                    "status": 0,
                    "fontSize": 12,
                    "color": "#333"
                }
            },
            "offsetTop": 784,
            "offsetLeft": 640,
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
            "isList": 2,
            "props": {
				"isLoading": "1",
                "productType": "product",
                "productLimit": 10,
                "dataSource": "manual",
                "leftRight": 12,
                "topBottom": 0,
                "maxHeight": 160,
                "marketPriceShow": 1,
                "clearance": 6,
                "radius": 10
            },
            "offsetTop": 840,
            "offsetLeft": 710,
            "data": []
        },
    ],
    params: "{\"auths\": [\"default\"], \"isHeight\": 0, \"pageColor\": \"#f3f4f6\", \"pageStyle\": {\"top\": 10, \"bottom\": 10, \"leftRight\": 10}, \"isNavColor\": 0, \"pageColorMode\": \"default\", \"pictureHeight\": 667, \"pageLinearColor\": {\"deg\": 0, \"deputyColor\": \"#D51010\", \"primaryColor\": \"#F04E2E\"}, \"backgroundPicture\": \"\"}",
    bottom_tabbar: "0",
    font_colour: "",
    top_colour: "",
    page_colour: "",
    background_picture: "https://yydshop-b2c.vjlau.com/attachment/images/2021/12/25/image_1640424526_yMZ6E1eV.jpg",
    is_default: "1",
    status: "1",
    created_at: "1640398140",
    updated_at: "1646013615"
}
