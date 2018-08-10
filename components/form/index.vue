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
							提交名称要求<img :src="imgs.help" />
						</div>
						<div class="">
							填写名字的含义 
							<span :class="{'rotate':showMeanInput}" v-tap='[toggleMeanInput]'></span>
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

			<div class="zmiti-submit-C">
				<img :src="imgs.submitBg" alt="">
				<div class="zmiti-submit-btn" v-tap='[submit]'>
					<img :src="imgs.submitBtn" alt="">
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
				show: true,
				username:'',
				mobile:'',
				msg:"",
				meaning:'',
				
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
			toggleMeanInput(){
				this.showMeanInput = !this.showMeanInput;
				setTimeout(()=>{
					this.scroll.refresh();
				},400)
			},
			regEmail(){
				var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
				return reg.test(this.formUser.email);
			},
			addName(){
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
				$.ajax({
					url:'http://120.26.42.181:8016/api.ashx?act=postlunarrover',
					data:{
						username:s.names[0],
						mobile:s.mobile,
						name:s.username,
						meaning:s.meaning,
						timestamp:d,
						signature:SHA1('jlsjflasl7887KJJLJ988welKds&'+s.mobile+'&'+d)
					},
					type:'post',
					success(data){
						if(typeof data === 'string'){
							data = JSON.parse(data);
							console.log(data);
						}
					}
				})
				 
				  
			 },
			 setSize(){
				var canvas = this.$refs['canvas'];
				canvas.width = this.viewW;
				canvas.height = this.viewH;
				return canvas;
			},
			initCanvas(){//
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
						scrollbars:true
					});
				}, 100);
			})

			obserable.on('hideForm',()=>{
				this.show = false;
			})
			
			
			  


			window.onresize = ()=>{

			
			}
		}
	
	}
</script>