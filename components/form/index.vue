<template>
	<transition name='main'>
		
	</transition>
</template>

<script>
	import './index.css';
	import {
		imgs,
	} from '../lib/assets.js';
	import zmitiUtil from '../lib/util';
	import $ from 'jquery';
	import Toast from '../toast/toast'
	export default {
		props: ['obserable', 'pv', 'randomPv', 'nickname', 'headimgurl'],
		name: 'zmitiindex',
		data() {
			return {
				imgs,
				showTeam: false,
				show: true,
				msg:"",
				showMsg:'',
				errorMsg:'',
				viewW: window.innerWidth,
				viewH: window.innerHeight,
				showMasks: false,
				isPress:false,
				formUser:{
					username:'',
					sex:'',
					nation:'',
					job:'',
					provicename:'',
					mobile:'',
					telphone:'',
					email:''
				},
				provinceList:[
					"--请选择省份--",
					"北京",
					"天津",
					"河北",
					"山西",
					"内蒙古",
					"辽宁",
					'吉林',
					'黑龙江',
					'上海',
					'江苏',
					'浙江',
					'安徽',
					'福建',
					'江西',
					'山东',
					'河南',
					'湖北',
					'湖南',
					'广东',
					'广西',
					'海南',
					'重庆',
					'四川',
					'贵州',
					'云南',
					'西藏',
					'陕西',
					'甘肃',
					'青海',
					'宁夏',
					'新疆',
					'兵团',
					'中国文明网'
				],
				showBtn:true
			}

			
		},
	
		components: {
			Toast
		},
		methods: {
			regEmail(){
				　var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
				return reg.test(this.formUser.email);
			},
			 submit(){

				 var s = this;

				 this.$refs['mobile'].blur();

				 
				 if(!s.formUser.username){
					 this.errorMsg = '用户名不能用空';
					 setTimeout(() => {
						this.errorMsg = '';	 
					 }, 1000);
					 return;
				 }

				  if(this.formUser.email.length <=0 ){
				 	this.errorMsg = '邮箱不能为空';
					 setTimeout(() => {
						this.errorMsg = '';	 
					 }, 1000);
				 	return;
				 }

				 if(!this.regEmail()){
				 	this.errorMsg = '邮箱格式错误';
					 setTimeout(() => {
						this.errorMsg = '';	 
					 }, 1000);
				 	return;
				 }
				 var data = this.formUser;
				 if(!data.provicename){
					 data.provicename = '北京';
				 }
				 data.wxopenid = window.openid || zmitiUtil.randomString();
				 data.pnumber =  window.pNumber;
				
				 $.ajax({
					 url:window.baseUrl+'/wenming/post_signup/',
					 type:'post',
					 data:data,
					 success(data){
						 if(data.getret === 0){
							 //s.msg = '提交成功';
							 s.errorMsg = '';

							 s.showMsg = '你已经成功提交信息，请等待后台审核。'

							 $.ajax({
								 url:window.baseUrl+'/share/wmsendsms/',
								 type:'post',
								 data:{
									 mobile:s.formUser.mobile,
									 smstype:1,//1.报名成功短信,2.审核通过短信,3.审核未通过短信
									 username:s.formUser.username,
									 projectname:document.title,
									 getdate:'2018年8月14日至2018年8月14日16日'
								 },
								 error(){
								 },
								 success(data){
								 }
							 })

							 
						 }else{
							 s.errorMsg = data.getmsg;
							 s.msg = '';
							 setTimeout(() => {
								s.errorMsg = '';	 
							 }, 2000);
						 }

					 }
				 })
				  
			 },
			 closeInfo(){
				 this.showMsg = '';
			 }
			
		},
	
		mounted() {
			window.s = this;
 
			var {obserable} = this;
			obserable.on('showForm',()=>{
				this.show = true;
			})

			obserable.on('hideForm',()=>{
				this.show = false;
			})
			 
			 
			var  s= this;
			var t = setInterval(()=>{
				
				if(window.openid){
					clearInterval(t);
					$.ajax({
						url:window.baseUrl+'/wenming/getsignuplist/',
						type:'post',
						data:{
							wxopenid:window.openid,
							pnumber:window.pNumber
							
						},
						error(){
						},
						success(data){
							if(data.getret === 0 ){
								if(data.list.length<=0){
									return;
								}
								s.userinfo = data.list[0];

								if(s.userinfo.issign){//已签到
									obserable.trigger({
										type:'toggleIndex',
										data:{
											show:true
										}
									})
									s.show = false;
								}
								if(s.userinfo.status*1 === 0){
									s.showMsg = '你已经成功提交信息，请等待后台审核！'
									
								}else if(s.userinfo.status*1 === 1){
									s.showMsg = '你已通过后台审核，请到现场签到！'
								}

								s.formUser = {};

							}
						}
					})
				}
			},30);


			window.onresize = ()=>{

				setTimeout(() => {
					this.showBtn = window.innerHeight >=this.viewH;
				}, 10);
			}
		}
	
	}
</script>