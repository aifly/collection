import $ from 'jquery'
var zmitiUtil = {
	wxInfo() {
		return {
			wxappid: window.wxappid,
			wxappsecret: wxappsecret,
			customid: window.customid
		}
	},
	getQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return (r[2]);
		return null;
	},
	changeURLPar: function(url, arg, val) {
		var pattern = arg + '=([^&]*)';
		var replaceText = arg + '=' + val;
		return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
	},
	isWeiXin: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},
	wxConfig: function(title, desc, url, isDebug = false) {
		var s = this;

		var img = window.baseUrl + '/assets/images/300.jpg';

		var appId = this.wxInfo().wxappid;


		var durl = url || location.href.split('#')[0];

		var code_durl = encodeURIComponent(durl);

		if(durl.indexOf('localhost:')>-1){//本地调用，不用请远程请求接口。
			return;
		}
		//alert(title+' \n' + desc + '\n');

		$.ajax({
			type: 'get',
			url: "http://h5.zhongguowangshi.com/tree/weixin/jssdk.php?type=signature&durl=" + code_durl + '&worksid=' + window.customid,
			dataType: 'jsonp',
			jsonp: "callback",
			jsonpCallback: "jsonFlickrFeed",
			error: function() {

			},
			success: function(data) {

				wx.config({
					debug: isDebug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: appId, // 必填，公众号的唯一标识
					timestamp: '1488558145', // 必填，生成签名的时间戳
					nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名，见附录1
					jsApiList: ['checkJsApi',
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo',
						'hideMenuItems',
						'showMenuItems',
						'hideAllNonBaseMenuItem',
						'showAllNonBaseMenuItem'
					] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});

				wx.ready(function() {

					//朋友圈

					wx.onMenuShareTimeline({
						title: title, // 分享标题
						link: durl, // 分享链接
						imgUrl: img, // 分享图标
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
					//朋友
					wx.onMenuShareAppMessage({
						title: title, // 分享标题
						link: durl,
						imgUrl: img, // 分享图标
						type: "link",
						dataUrl: "",
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
					//qq
					wx.onMenuShareQQ({
						title: title, // 分享标题
						link: durl, // 分享链接
						imgUrl: img, // 分享图标
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
				});
			}
		});



	},

	saveWxUserInfo(option) {
		$.ajax({
			url: window.protocol + '//api.zmiti.com/v2/weixin/add_wxuser/',
			type: 'post',
			data: option
		}).done((data) => {
			//document.title = data.getret + ','+data.getmsg;
			///alert('add_wxuser : data.getret => ' + data.getret + '\n data.getmsg =>' + data.getmsg);
		})
	},

	getOauthurl: function(obserable) {

		/*$.ajax({
			type:"post",
			url:"http://h5.zhongguowangshi.com/interface/public/index.php?s=v2/Share/createImageByUrl",
			data:{
				setimagesrc:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK4D8RdGsOFc4UuTR5vGdL1x2dHxMoABic6x21sjL6A1hj30MyZ2CMLJsYibyIUPKpEvCMRN18xBolw/0"
			}
		}).done(data=>{
			console.log(data)
		})*/
		var s = this;
		var {
			wxappid,
			wxappsecret,
			customid
		} = this.wxInfo();

		if (!s.isWeiXin()) {
			setTimeout(()=>{
				obserable.trigger({
					type:'initWebgl'
				})
			},2000)
			return;
		}
		var key = 'headimgurl8'
		if(window.localStorage.getItem('nickname') && window.localStorage.getItem(key)){
			if (obserable) {
				obserable.trigger({
					type: 'setUserInfo',
					data: {
						nickname:window.localStorage.getItem('nickname'),
						headimgurl: window.localStorage.getItem(key)
					}
				})

				setTimeout(()=>{
					obserable.trigger({
						type:'initWebgl'
					})
				},2000)
			}
			return;
		}
		$.ajax({
			type: 'post',
			//url: window.baseUrl + '/weixin/getwxuserinfo/',
			url: window.protocol + '//api.zmiti.com/v2/weixin/getwxuserinfo/',
			data: {
				code: s.getQueryString('code'),
				wxappid,
				wxappsecret
			},
			error: function() {},
			success: function(dt) {
				if (dt.getret === 0) {

					s.openid = dt.userinfo.openid;
					s.nickname = dt.userinfo.nickname;
					s.headimgurl = dt.userinfo.headimgurl;

					window.nickname = s.nickname;
					window.headimgurl = s.headimgurl;
					window.openid = s.openid;
					$.ajax({
						url:"http://h5.zhongguowangshi.com/interface/public/index.php?s=v2/Share/createImageByUrl",
						type:'post',
						data:{
							setimagesrc:s.headimgurl,
							setwidth:300,
							setheight:300
						}
					}).done(data=>{

						if(data.getret === 0){

							window.localStorage.setItem(key,data.getimageurl);
							window.localStorage.setItem('nickname',s.nickname);


							if (obserable) {
								obserable.trigger({
									type: 'setUserInfo',
									data: {
										nickname: s.nickname,
										headimgurl: s.headimgurl
									}
								})

								setTimeout(()=>{
									obserable.trigger({
										type:'initWebgl'
									})
								},1000)
							}
							s.saveWxUserInfo({
								wxappid:wxappid,
								worksid: window.customid,
								wxopenid: s.openid,
								nickname: s.nickname,
								headimgurl: data.getimageurl,
							})
						}
					})


					

					//var URI = window.location.href.split('#')[0];

					//s.wxConfig('为你圆梦', '@留守儿童 新华社喊你来许愿！有机会得团圆基金哦');

				} else {
					if (s.isWeiXin()) {

						var wish = s.getQueryString('src');
						var nickname = s.getQueryString('nickname');
						var num = s.getQueryString('num');

						var redirect_uri = window.location.href.split('?')[0];

						if (wish) {
							redirect_uri = s.changeURLPar(redirect_uri, 'src', (wish));
						}
						if (nickname) {
							redirect_uri = s.changeURLPar(redirect_uri, 'nickname', (nickname));
						}
						if (num) {
							redirect_uri = s.changeURLPar(redirect_uri, 'num', (num));
						}

						$.ajax({
							//url: window.baseUrl + '/weixin/getoauthurl/',
							url: window.protocol + '//api.zmiti.com/v2/weixin/getoauthurl/',
							type: 'post',
							data: {
								redirect_uri: redirect_uri,
								scope: 'snsapi_userinfo',
								worksid: customid,
								state: new Date().getTime() + ''
							},
							error: function() {},
							success: function(dt) {
								if (dt.getret === 0) {
									window.location.href = dt.url;
								}
							}
						})
					} else {
						//s.wxConfig('为你圆梦', '@留守儿童 新华社喊你来许愿！有机会得团圆基金哦')
					}

				}


			}
		});
	}
}

function add(x, y) {
	return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
}

function SHA1hex(num) {
	var sHEXChars = "0123456789abcdef";
	var str = "";
	for (var j = 7; j >= 0; j--)
		str += sHEXChars.charAt((num >> (j * 4)) & 0x0F);
	return str;
}

function AlignSHA1(sIn) {
	var nblk = ((sIn.length + 8) >> 6) + 1,
		blks = new Array(nblk * 16);
	for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
	for (i = 0; i < sIn.length; i++)
		blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);
	blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
	blks[nblk * 16 - 1] = sIn.length * 8;
	return blks;
}

function rol(num, cnt) {
	return (num << cnt) | (num >>> (32 - cnt));
}

function ft(t, b, c, d) {
	if (t < 20) return (b & c) | ((~b) & d);
	if (t < 40) return b ^ c ^ d;
	if (t < 60) return (b & c) | (b & d) | (c & d);
	return b ^ c ^ d;
}

function kt(t) {
	return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
		(t < 60) ? -1894007588 : -899497514;
}

function SHA1(sIn) {
	var x = AlignSHA1(sIn);
	var w = new Array(80);
	var a = 1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d = 271733878;
	var e = -1009589776;
	for (var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;
		var olde = e;
		for (var j = 0; j < 80; j++) {
			if (j < 16) w[j] = x[i + j];
			else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
			var t = add(add(rol(a, 5), ft(j, b, c, d)), add(add(e, w[j]), kt(j)));
			e = d;
			d = c;
			c = rol(b, 30);
			b = a;
			a = t;
		}
		a = add(a, olda);
		b = add(b, oldb);
		c = add(c, oldc);
		d = add(d, oldd);
		e = add(e, olde);
	}
	var SHA1Value = SHA1hex(a) + SHA1hex(b) + SHA1hex(c) + SHA1hex(d) + SHA1hex(e);
	return SHA1Value.toUpperCase();
}
export default {zmitiUtil,SHA1};