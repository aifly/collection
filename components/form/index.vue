<template>
	<transition name='main'>
		<div class="zmiti-form-main-ui lt-full" v-if='show'>
			<div class="zmiti-moon1">
				<img :src="imgs.moon1" alt="">
			</div>

			<canvas ref='canvas'></canvas>

			<div class="zmiti-plane">
				<img :src="imgs.plane" alt="">
			</div>

			<section  ref='page' class="zmiti-form-main">
				<div>
					<div class="zmiti-subtitle">
						<img :src="imgs.subtitle" alt="">
					</div>
					<div :key="i" class="zmiti-name-C" v-for='(name,i) in names'>
						<div class="zmiti-name-input">
							<input placeholder="征集的名字" type="text" v-model='names[i]'/>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
						<div class="zmiti-add" v-if='i===0' v-tap='[addName]'>
							<img :src="imgs.add" alt="">
						</div>
						<div class="zmiti-reduce" v-if='i>0' v-tap='[reduceName,i]'>
							<img :src="imgs.reduce" alt="">
						</div>
					</div>
					<div class="zmiti-tips">
						<div>
							提交名称要求<img :src="imgs.help" @touchstart='imgStart' v-tap='[showYaoqiu]'/>
						</div>
						<div class="" v-tap='[toggleMeanInput]'>
							填写名字的含义 
							<span :class="{'rotate':showMeanInput}" ></span>
						</div>
					</div>
					
					<div class="zmiti-mean-input" :style="{margin:showMeanInput?'30px auto 0':'0 auto'}" :class="{'hide':!showMeanInput}">
						<textarea placeholder="征集名字的含义" v-model="meaning">
							
						</textarea>
					</div>

					<div class="zmiti-username">
						<span>姓名：</span><input type="text" v-model="username">
					</div>
					<div class="zmiti-mobile">
						<span>电话：</span><input type="text" v-model="mobile">
					</div>
				</div>
			</section>

			<div class="zmiti-submit-C" v-if='showSubmit'>
				<img :src="imgs.submitBg" alt="">
				<div class="zmiti-submit-btn" v-tap='[submit]'>
					<img :src="imgs.submitBtn" alt="">
				</div>

				<div class="zmiti-car">
					<img :src="imgs.car" alt="">

					<div class="zmiti-car-tips" v-tap='[showJX]'>
						<div>
							<ul>
								<li>快来给我起名吧</li>
								<li>每天抽取6名幸运网友</li>
								<li>奖品探月征名活动车模</li>
								<li>点击查看</li>
								<li>快来给我起名吧</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<Toast :errorMsg='errorMsg'></Toast>
			
			<div v-if='showImg' class="zmiti-mask lt-full">
				<div v-tap='[hideMask]'>
					<img :src="showImg" alt="">
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import './index.css';
	import {
		imgs,
	} from '../lib/assets.js';
	import {zmitiUtil,SHA1} from '../lib/util';
	import $ from 'jquery';
	import IScroll from 'iscroll';
	import Toast from '../toast/toast'
	import Point from '../index/point';
	export default {
		props: ['obserable', 'pv', 'randomPv', 'nickname', 'headimgurl'],
		name: 'zmitiindex',
		data() {
			return {
				imgs,
				showTeam: false,
				show:false,
				username:'',
				showImg:'',
				mobile:'',
				msg:"",
				meaning:'',
				showSubmit:true,
				names:[''],
				showMsg:'',
				errorMsg:'',
				showMeanInput:false,
				viewW:Math.min( window.innerWidth,750),
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
			imgStart(e){
				e.preventDefault(); 
			},
			toggleMeanInput(){
				this.showMeanInput = !this.showMeanInput;
				setTimeout(()=>{
					setTimeout(() => {
						this.scroll.scrollTo(0,this.showMeanInput?this.scroll.wrapperHeight  - this.scroll.scrollerHeight:0,1);
						this.scroll.refresh();
					}, 100);
					this.scroll.scrollTo(0,this.showMeanInput?this.scroll.wrapperHeight  - this.scroll.scrollerHeight:0,1);
					this.scroll.refresh();
				},400)
			},
			hideMask(){
				this.showImg =  '';

			},
			isPoneAvailable(val) {
	            var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
	            if (!myreg.test(val)) {
	                return false;
	            } else {
	                return true;
	            }
	        },
			showYaoqiu(){
				this.obserable.trigger({
					type:'hideForm'
				});
				this.obserable.trigger({
					type:'hideIndexSubmitBg',
					data:false
				});
				this.obserable.trigger({
					type:'toggleRequirement',
					data:true
				})
			},
			showJX(){
				this.obserable.trigger({
					type:'hideForm'
				});
				this.obserable.trigger({
					type:'hideIndexSubmitBg',
					data:false
				});
				this.obserable.trigger({
					type:'showByJX'
				})
			},
			regEmail(){
				var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
				return reg.test(this.formUser.email);
			},
			addName(){
				if(this.names.length>=3){
					this.errorMsg = '您最多可提交3个名字';


					setTimeout(()=>{
						this.errorMsg = '';
					},2000)
					return;
				}
				this.names.push('');
				setTimeout(()=>{
					this.scroll.refresh();
				},400)
			},
			reduceName(index){
				this.names.splice(index,1);
				setTimeout(()=>{
					this.scroll.refresh();
				},400)
			},
			submit(){
				var s = this;
				var d = new Date().getTime();
				if(!s.isPoneAvailable(s.mobile)){
					s.errorMsg = '手机号码不合法';
					setTimeout(()=>{
						s.errorMsg = '';
					},2000)
					return
				}
				if(s.names.length === 1 && !s.names[0]){

					s.errorMsg = '名字不能为空';
					setTimeout(()=>{
						s.errorMsg = '';
					},2000)
					return	
				}

				s.names.map((name,i)=>{
					if(name){
						$.ajax({
							url:'http://120.26.42.181:8016/api.ashx?act=postlunarrover',
							url:'http://open.api.zhongguowangshi.com/api.ashx?act=postlunarrover',
							 dataType: 'JSON',
		            		//contentType: "application/json",
							data:JSON.stringify({
								username:s.username,
								mobile:s.mobile,
								name:name,
								meaning:s.meaning,
								timestamp:d,
								signature:SHA1('jlsjflasl7887KJJLJ988welKds&'+s.mobile+'&'+d)
							}),
							type:'post',
							success(data){
								//console.log(data);
								if(typeof data === 'string'){
									data = JSON.parse(data);
								}
								if(data.Status === 1){
									s.showImg = imgs.submitSuccess;
									s.names = [''];
									s.mobile = '';
									s.username = '';
									s.meaning  = '';


								}else{
									s.errorMsg = '您已经提交了信息'
									setTimeout(()=>{
										s.errorMsg = '';
									},1000)
								}
							}
						})
					}
				})

				
				 
				  
			 },
			 setSize(){
				var canvas = this.$refs['canvas'];
				canvas.width = this.viewW;
				canvas.height = this.viewH;
				return canvas;
			},
			showDialog(type){
				this.showImg = type;
			},
			initCanvas(){//

				return;
				var canvas = this.setSize();
				var context = canvas.getContext('2d');
				var img = new Image();
				var points = [];
				img.onload = ()=>{
					
					for(var i = 0 ;i < 100;i++){
						var size = 0;
						if(i% 15 === 0){
							size = Math.random()*10+10
						}
						var  p = new Point({
							context,
							img,
							size
						});
						points.push(p);
						p.render();
					}
					/*  */
					
				}
			
				img.src = imgs.point;
			},
			 
			
		},
	
		mounted() {
			window.s = this;
 
			var {obserable} = this;
			obserable.on('showForm',()=>{
				this.show = true;
				setTimeout(() => {
					this.initCanvas();
					this.scroll = new IScroll(this.$refs['page'],{
						scrollbars:true,
						probeType: 3,
						bounce:false
					});
				}, 100);
			})

			obserable.on('hideForm',()=>{
				this.show = false;
			})

			window.onresize = ()=>{
				setTimeout(() => {
					this.showSubmit = window.innerHeight >=this.viewH;
					obserable.trigger({
						type:'hideIndexSubmitBg',
						data:this.showSubmit
					})

				}, 10);
			}
		}
	
	}
</script>