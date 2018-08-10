<template>
	<div ref='page'  class="lt-full zmiti-index-main-ui "   :class="{'show':show}" >
		
		<div class="zmiti-moon" :class="{'hide':starting}">
			<img :src="imgs.moon" alt="">
		</div>

		<div class="zmiti-plane" :class="planeClass">
			<img :src="imgs.plane" alt="">
		</div>

		<div class="zmiti-light" v-show='showLight'>
			<img :src="imgs.light" alt="">
		</div>


		<div class="zmiti-title" :class="{'hide':starting}">
			<img :src="imgs.title" alt="">

			<div class="zmiti-logos">
				<div>
					<img :src="imgs.logo" alt="" class="zmiti-logo">
					<span>新华社新媒体中心出品</span>
				</div>
				<div>
					<span>合作单位:</span>
					<img :src="imgs.logo1" alt=""  class="zmiti-logo1">
					<img :src="imgs.logo2" alt="" class="zmiti-logo2">
				</div>
			</div>
		</div>

		<canvas ref='rocket' class="zmiti-rocket">
		</canvas>
		<img style="opacity:0;z-index:-1;position:fixed;" ref='rocket-img' :src="imgs.rocket" alt="">

		<div class="zmiti-index-page lt-full" :style="{background:'url('+imgs.indexBg+') no-repeat center top',backgroundSize:'cover',WebkitTransform:'translateY('+transY+'px)'}">
			<div class='zmiti-bottom'>
				<img :src="imgs.mount" alt="">
			</div>
			<canvas :style="{WebkitTransform:'translateY('+-transY+'px)'}" ref='canvas'></canvas>
			<div class="zmiti-send">
				<img :src="imgs.send" alt="">
				<img :src="imgs.cloud" alt="" class='zmiti-cloud' :class="{'active':starting}"/>
			</div>

		</div>
		<div class="zmiti-start" v-tap='[start]' v-show ='!starting'>
			<img :src="imgs.start" alt="">
		</div>

		<div v-if='index>-1' class="zmiti-organization" v-for="(org,h) in organizationArr" :key='org.key'  :class="{'active':index === h}">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<div class="zmiti-organization-title">
				<img :src="imgs.organization" alt="">
				<span>{{org.title}}</span>
			</div>
			<h1 style="height:4vh;"></h1>
			<div class="zmiti-units" v-for="(item,i) in org.items" :key="i+'1'">
				<div v-if='item.type !=="text"' class="zmiti-unit-title" v-html='item.title+"："'></div>
				<div  v-if='item.type !=="text"' class="zmiti-unit-names">
					<div v-for="(unit,k) in item.units" :key="k">
						{{unit}}
					</div>
				</div>
			</div>
			<div :key='l' class="zmiti-remark"  v-if='org.type="text"' v-for='(c,l) in organizationArr[index].content'>
				{{c}}
			</div>
		</div>
	</div>
</template>

<script>
	import './index.css';
	import {imgs} from '../lib/assets.js';
	import {zmitiUtil} from '../lib/util';
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
				index:-1,
				showRemark:false,
				organizationArr:window.organizationArr,
				showLight:false,
				starting:false,
				planeClass:'',
				show:true,
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

				var canvas1 = this.$refs['rocket'];
				canvas1.width = this.viewW;
				canvas1.height = this.viewH;
				return canvas;
			},
			start(){
				this.starting = true;
				this.planeLeave();
			},
			initDocket(){
				var canvas = this.$refs['rocket'];
				var rocketContext = canvas.getContext('2d');
				var rocketImg = this.$refs['rocket-img'];

				var height=  500/2;
				var i = 0;
				

				return {rocketContext,rocketImg};
				
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

					var {rocketContext,rocketImg} = this.initDocket();
					var h = this.viewH - 500/1.81 - 70;
					var i = 0;
					var x = 400;
					var iNow = 0;
					var scale = 1.5;
					var defaultScale = 1.5;
					var isChange = false;
					var render = ()=>{
						var h1 = 500-165;
						if(this.starting){
							context.clearRect(0,0,canvas.width,canvas.height);
							rocketContext.clearRect(0,0,canvas.width,canvas.height);
							i++;
							i%=4;
							h1 = 500;
							h -= 8;

						
							defaultScale+=.0005;
							scale = Math.min(defaultScale,2);
							
							x = Math.max(x,(750-258/scale)/2);
							h = Math.max(h,80);
						
							if(h <= 80 && !isChange){
								isChange = true;
								this.showRemark = true;
								this.index++;

								

								var t = setInterval(()=>{
									
									if(this.index>=5){
										this.index =5;
										this.obserable.trigger({
											type:'showForm'
										})
										clearInterval(t);
										return;
									}else{
										this.index++;
									}

								},4000)

							}
							points.map((p,i)=>{
								p.y+=4;
								if(p.y> height){
									p.y = 0
								}
								p.render()
							});	
							iNow++;
							if(iNow>10){

								this.transY+=4;
							}
							
							this.transY = Math.min(this.transY,height);
							 
						}

						rocketContext.drawImage(rocketImg,i*258,0,258,h1,x,h,258/scale,(h1)/scale);

						zmitiAnimationFrame(render)

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