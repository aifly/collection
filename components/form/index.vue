<template>
	<transition name='main'>
		<div class="zmiti-form-main-ui lt-full" :class="{'show':show}">
			<div class="zmiti-moon1">
				<img :src="imgs.moon1" alt="">
			</div>

			<div class="zmiti-plane">
				<img :src="imgs.plane" alt="">
			</div>

			<div class="zmiti-subtitle">
				<img :src="imgs.subtitle" alt="">
			</div>

			<div :key="i" class="zmiti-name-C" v-for='(name,i) in names'>
				<div class="zmiti-name-input">
					<input type="text" v-model='names[i]'/>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>
				<div class="zmiti-add" v-if='i===0' v-tap='[addName]'>
					<img :src="imgs.add" alt="">
				</div>
			</div>
			<div class="zmiti-tips">
				<div>
					提交名称要求<img :src="imgs.help" />
				</div>
				<div class="">
					填写名字的含义 
					<span></span>
				</div>
			</div>
			
			<div class="zmiti-mean-input">
				<textarea>
					
				</textarea>
			</div>


		</div>
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
				names:[''],
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
				}
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
			addName(){
				this.names.push('');
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