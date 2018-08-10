var imgs = {
	logo: './assets/images/logo.png',
	logo1: './assets/images/logo1.png',
	logo2: './assets/images/logo2.png',
	indexBg: './assets/images/index-bg.jpg',
	point:'./assets/images/star.png',
	mount:'./assets/images/mount.png',
	title:'./assets/images/title.png',
	moon:'./assets/images/moon.png',
	moon1:'./assets/images/moon1.png',
	plane:'./assets/images/plane.png',
	light:'./assets/images/light.png',
	subtitle:'./assets/images/subtitle.png',
	submitBg:'./assets/images/submit-bg.png',
	submitBtn:'./assets/images/submit-btn.png',
	send:'./assets/images/send.png',
	help:'./assets/images/help.png',
	add:'./assets/images/add.png',
	reduce:'./assets/images/reduce.png',
	rocket:'./assets/images/rocket.png',
	start:'./assets/images/start.png',
	cloud:'./assets/images/cloud.png',
	organization:'./assets/images/organization.png',
	submitSuccess:'./assets/images/submit-success.png',
}

var organizationArr = [
	{
		key:'huodong',
		title: '活动说明',
		type:'text',
		content: ['中国探月工程在圆满完成嫦娥一号、嫦娥二号、嫦娥三号和探月工程三期再入返回试验任务以后，计划于今年12月实施嫦娥四号任务。嫦娥四号将首次实现人类探测器在月球背面软着陆，首次实现在月球背面巡视探测，意义重大。为扩大嫦娥四号任务的社会影响，树立探月工程的文化形象，激发全国人民和海外同胞的爱国主义热情，探月与航天工程中心会同有关部门和单位，在全球开展嫦娥四号月球车征名活动。']
	},
	{
		key: 'zuzhi',
		title: "主办组织机构",
		items: [{
				title: "主办单位",
				units: ['国家国防科工局探月与航天工程中心']
			},
			{
				title: '协办单位',
				units: ['国家国防科工局新闻宣传中心', '中科院月球与火星探测总体部', '中国航天科技集团公司宇航部', '中国运载火箭技术研究院', '中国空间技术研究院', '上海航天技术研究院']
			}
		]
	}, {
		key: 'zhuban',
		title: "主办组织机构",
		items: [ {
				title: '承办单位',
				units: ['嫦娥奔月航天科技（北京）有限责任公司', '中央电视台央视新闻客户端', '新华社新媒体中心', '中国网', '腾讯科技（北京）有限公司', '国家航天局网', '中国探月与深空探测网', '上海中宣国际新思维广告有限公司等']
			}, {
				title: '赞助企业',
				units: ['东莞美驰图实业有限公司']
			}
		]
	}, {
		key: 'pingshen',
		title: "评审委员会",
		items: [
			{
				title: '顾<span style="opacity:0">成功</span>问',
				units: ['栾恩杰（院士、探月工程高级顾问）', '孙家栋（院士、探月工程高级顾问）', '欧阳自远（院士、探月工程高级顾问）']
			}, {
				title: '主<span style="opacity:0">成功</span>任',
				units: ['刘继忠（探月与航天工程中心主任）']
			}, {
				title: '副 主 任',
				units: ['吴伟仁（探月工程总设计师）', 'XXX（国防科工局新闻宣传中心主任）', 'XXX（中国航天科技集团总公司1人）']
			}, {
				title: '秘 书 长',
				units: ['许兴利（嫦娥奔月航天科技（北京）有限责任公司总经理）']
			}
		]
	},{
		key: 'weiyuanhui',
		title: '评审委员会',
		items:[
			{
				title: '成<span style="opacity:0">成功</span>员',
				units: ['（探月与航天工程中心副主任1人）',
					'（国防科工局新闻宣传中心1人）',
					'（中科院月球与火星探测总体部1人）',
					'（中国航天科技集团公司宇航部1人）',
					'（中国运载火箭技术研究院1人）',
					'（ 中国空间技术研究院1人）',
					'（ 上海航天技术研究院1人）',
					'（中国文化名人3人）',
					'（ 媒体单位专家4人）'

				]
			}
		]
	}, {
		key: 'zhengming',
		title: '征名奖项设置',
		type: 'text',
		content: [
			'一等奖1名(中选名称）：奖励证书,现金3000元，价值18000元的限量版珍藏水晶汽车模型一个。',
			'二等奖2名(三甲未中选名称）：奖励证书，现金2000元，价值680元精装版汽车模型一个。',
			'三等奖7名(十强中未进三甲名称）：奖励证书，现金1000元，价值480精品汽车模型一个。'
		]
	},
]

var arr = [];


for (var attr in imgs) {
	arr.push(imgs[attr]);
}



var musics = {
	music: {
		src: './assets/music/bg2.mp3',
		autoplay: false,
		name: 'bg',
		loop: true
	},
	photo:{
		src:'./assets/music/photo.mp3',
		autoplay:false,
		name:"photo",
		loop:false
	}
};

 (function () {

 	if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
 		handleFontSize();
 	} else {
 		if (document.addEventListener) {
 			document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
 		} else if (document.attachEvent) {
 			document.attachEvent("WeixinJSBridgeReady", handleFontSize);
 			document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
 		}
 	}

 	function handleFontSize() {
 		// 设置网页字体为默认大小
 		WeixinJSBridge.invoke('setFontSizeCallback', {
 			'fontSize': 0
 		});
 		// 重写设置网页字体大小的事件
 		WeixinJSBridge.on('menu:setfont', function () {
 			WeixinJSBridge.invoke('setFontSizeCallback', {
 				'fontSize': 0
 			});
 		});
 	}
 })();