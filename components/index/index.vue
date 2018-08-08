<template>
	<div v-tap='[entry]'  class="lt-full zmiti-index-main-ui " :style="{background:'url('+imgs.indexBg+') no-repeat center top',backgroundSize:'cover'}"  :class="{'show':show}">
		<transition name='index'>
			<div class="zmiti-index" v-if='!showIndexMask'>
				<div class="zmiti-title">
					<img @touchstart='imgStart' :src="imgs.title1">
				</div>
				<div class="zmiti-index-img" :style="{WebkitTransform:'translateX('+transX+'px)'}">
					<img :src="imgs.index" alt="">
				</div>
				<div class="zmiti-entry" >
					<img :src="imgs.entry" alt="">
				</div>

				<canvas :width="viewW" height="500" ref='canvas'>

				</canvas>
			</div>
		</transition>

		<transition name='video'>
			<div class="zmiti-video lt-full" v-show='showVideo' >
				<video 
					id="my_video" ref='video' 
					style="object-fit: fill; width: 100%; height: 100%;" preload="load" playsinline="true" webkit-playsinline="true" x-webkit-airplay="allow" airplay="allow" x5-video-player-type="h5" :x5VideoPlayerFullscreen="fullscreen" x5-video-orientation="portrait" 
					:loop='false'
				:src="vidoeUrl"></video>
				
			</div>
		</transition>

		<div class="zmiti-index-logo">
			<img :src="imgs.logo" alt="">
		</div>
	</div>
</template>

<script>
	import './index.css';
	import {imgs} from '../lib/assets.js';
	import zmitiUtil from '../lib/util';
	import Point from './point';
	export default {
		props:['obserable','nickname','pv'],
		name:'zmitiindex',
		data(){
			return{
				imgs,
				pointW:0,
				pointH:0,
				points:[],
				show:true,
				showIndexMask:false,
				showMasks:false,
				transX:-200,
				showVideo:false,
				viewW:window.innerWidth,
				fullscreen:true,
				vidoeUrl:'./assets/video/index1.mp4'
			}
		},
		components:{
		},
		
		methods:{

			imgStart(e){
				e.preventDefault(); 
			},

			entry(){
				
				var {obserable} = this;
				this.showIndexMask = true;
				this.showVideo = true;

				setTimeout(()=>{
					this.$refs['video'].addEventListener('play',()=>{
		 				obserable.trigger({
		 					type:"toggleBgMusic",
		 					data:false
		 				})
		 			})

		 			this.$refs['video'].addEventListener('ended',()=>{
		 				/* obserable.trigger({
		 					type:"toggleBgMusic",
		 					data:true
						 }); */
						 
						 obserable.trigger({
							 type:'entryIntro'
						 });
		 			})

		 			/* this.$refs['video'].addEventListener('pause',()=>{
		 				this.show && this.$refs['video'].play()	
					 }) */
					 
					 
					this.$refs['video'].play()
				},200)
			},

			initPoints(){

				var canvas = this.$refs['canvas'];
				var context = canvas.getContext('2d');

				var width = canvas.width,
					height = canvas.height;
				var img = new Image();
				img.onload = ()=>{
					for(var i = 0 ;i<100;i++){
						var p = new Point({
							img,
							context,
						})
						this.points.push(p);
					}
				}
				img.src = imgs.point;

				var animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
					m = Math;

				var render = ()=>{
					if(width<=0){
						width = canvas.width,
						height = canvas.height;
					}
					context.clearRect(0,0,width,height);

					this.points.map((point,i)=>{
						point.angle += point.speed;
						//point.angle = (point.angle | 0)
						point.angle %= 360;
						point.x += m.sin(point.angle/180*m.PI)*point.speedX;

						point.y -= 1;
						if(point.defaultY  -  point.y  >  point.maxHeight){
							point.y = point.defaultY
						}
						point.update();
					});
					!this.showIndexMask && animationFrame(render);
				}
				
				render()


			}
			
		},
		mounted(){


			var {obserable} = this;

			obserable.on('toggleIndex',(data)=>{
				this.show = data.show;
			})

			this.initPoints();
			 
			var s = this;
			s.lastX = '';
			s.lastY = '';
			var i =0 ;
			var startX,startY;
 			window.addEventListener("deviceorientation", function(event) {
			      

			     // document.title = event.beta|0;
			     i++;
			      if(i===1){
			      	startY = event.beta;
			      }

			      var x =  event.gamma|0,
			      	  y = event.beta|0;

			      if(x<-35){
			      	x=-35;
			      }
			      if(x>10){
			      	x=10
			      }
			     
			     //document.title = x;


			      s.transX = x ;
			     

			    


			    	      

			}, true);


		}
	}
</script>