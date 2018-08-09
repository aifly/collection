<template>
	<div ref='page'  class="lt-full zmiti-index-main-ui "   :class="{'show':show}" >
		
		<div class="zmiti-moon">
			<img :src="imgs.moon" alt="">
		</div>

		<div class="zmiti-plane" :class="planeClass">
			<img :src="imgs.plane" alt="">
		</div>

		<div class="zmiti-light" v-show='showLight'>
			<img :src="imgs.light" alt="">
		</div>


		<div class="zmiti-title">
			<img :src="imgs.title" alt="">
		</div>

		

		<div class="zmiti-index-page lt-full" :style="{background:'url('+imgs.indexBg+') no-repeat center top',backgroundSize:'cover',WebkitTransform:'translateY('+transY+'px)'}">
			<div class='zmiti-bottom'>
				<img :src="imgs.mount" alt="">
			</div>
			<canvas :style="{WebkitTransform:'translateY('+-transY+'px)'}" ref='canvas'></canvas>
			<div class="zmiti-send">
				<img :src="imgs.send" alt="">
			</div>
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
				transY:0,
				pointH:0,
				points:[],
				showLight:false,
				starting:false,
				planeClass:'',
				show:false,
				showIndexMask:false,
				viewW:Math.min(window.innerWidth,750),
				viewH:window.innerHeight
			}
		},
		components:{
		},
		
		methods:{

			imgStart(e){
				e.preventDefault(); 
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
					var zmitiAnimationFrame = window.requestAnimationFrame ||  window.webkitRequestAnimationFrame;
					var width = canvas.width,
						height=  canvas.height;

					var render = ()=>{

						context.clearRect(0,0,canvas.width,canvas.height);
						points.map((p,i)=>{
							p.y+=2;
							if(p.y> height){
								p.y = 0
							}
							p.render()
						});	
						this.transY+=2;
						
						this.transY = Math.min(this.transY,height);
						this.starting && zmitiAnimationFrame(render)

					}

					render();
					
				}
			
				img.src = imgs.point;
			},
			planeLeave(){
				this.planeClass = 'leave';
				this.showLight = false;
				setTimeout(() => {
					this.planeClass = 'leave1'
				}, 1000);
			}
		},
		mounted(){

			var {obserable} = this;

			obserable.on('toggleIndex',(data)=>{
				this.show = data.show;
			})

			this.initCanvas();

			setTimeout(() => {
				}, 1000);
			setTimeout(() => {
				
				this.planeClass = 'active';
				setTimeout(() => {
					this.showLight = true;
					
				}, 600);
				
			}, 1000);



		}
	}
</script>