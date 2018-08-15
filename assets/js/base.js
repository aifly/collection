var imgs = {
	logo: './assets/images/logo.png',
	logo1: './assets/images/logo1.png',
	logo2: './assets/images/logo2.png',
	indexBg: './assets/images/index-bg.jpg',
	point:'./assets/images/star.png',
	mount:'./assets/images/mount.png',
	title:'./assets/images/title1.png',
	moon:'./assets/images/moon.png',
	moon1:'./assets/images/moon1.png',
	plane:'./assets/images/plane.png',
	light:'./assets/images/light.png',
	subtitle:'./assets/images/subtitle1.png',
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
	jiangxiang:'./assets/images/jiangxiang1.png',
	//yaoqiu:'./assets/images/yaoqiu.png',
	car:'./assets/images/car.png',
	jiasu:'./assets/images/jiasu.png',
	jiasu1:'./assets/images/jiasu1.png',
	submitSuccess:'./assets/images/submit-success.png',
}

var organizationArr = [
	{
		key: 'jianjie',
		title: '活动简介',
		type: 'text',
		content: ['月球是地球唯一的天然卫星，陪伴地球已经超过45亿年。中国探月工程在圆满完成嫦娥一号、嫦娥二号、嫦娥三号和探月工程三期再入返回试验任务以后，计划于今年12月实施嫦娥四号任务。中国探月嫦娥四号任务，将首次探访神秘的月球背面，在我们看不见的地方实现软着陆和巡视探测，这将开辟人类月球探测的新领域。探月与航天工程中心通过新华社客户端在全球开展嫦娥四号月球车征名活动。']
	}, {
		key: 'jieduan',
		title: '征名活动分四个阶段',
		type: 'text',
		content: ['第一阶段：8月16日至9月5日，提交名称，函审备选。',
				'第二阶段：9月上旬，组织初评，遴选十强。',
				'第三阶段：9月上旬至9月30日，网络投票，评选前三。',
				'第四阶段：10月上旬，确定三甲，公布结果。',
				'第五阶段：10月上旬，公布征名结果。'
		]
	},
	{
		key:'huodong',
		title: '活动说明',
		type:'text',
		content: ['中国探月工程在圆满完成嫦娥一号、嫦娥二号、嫦娥三号和探月工程三期再入返回试验任务以后，计划于今年12月实施嫦娥四号任务。嫦娥四号将首次实现人类探测器在月球背面软着陆，首次实现在月球背面巡视探测，意义重大。探月与航天工程中心会同有关部门和单位，在全球开展嫦娥四号月球车征名活动。']
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
				units: ['嫦娥奔月航天科技（北京）有限责任公司', '新华社客户端',  '中国网', '腾讯网', '国家航天局网',  '上海中宣国际新思维广告有限公司等']
			}, {
				title: '赞助企业',
				units: ['东莞美驰图实业有限公司']
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


var yaoqiuList = [
	'1.符合国家商标法的有关规定，具有时代性、延伸性和较好的文化内涵体现中华民族的文化特征。',
	'2.符合中国探月工程理念和工程特点文字简练，便于记忆， 易于传播。',
	'3.提交名称需包括不多于300字的创意说明和背景阐述， 否则视为无效投稿。',
	'4.参选人提交名称不得超过3个，不要重复提交已征集到的相同名称； 如果征集的名称相同，在遴选阶段将以时间先后的顺序， 选取最早提交者。 '
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