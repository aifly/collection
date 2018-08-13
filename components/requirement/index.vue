<template>
	<div ref='page'  class="lt-full zmiti-requirement-main-ui "   :class="{'show':show}" >

		<div  class="zmiti-organization">

			<div class="zmiti-back" v-tap='[hidePage]'></div>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<div class="zmiti-organization-title">
				<img :src="imgs.organization" alt="">
				<span>{{showJX?'奖项设置':'提交名称要求'}}</span>
			</div>
			<h1 style="height:4vh;"></h1>

			<div class="zmiti-units" v-if='!showJX' v-for='(yq,i) in yaoqiuList' :key='i'>
				{{yq}}
			</div>
			<div  v-if='showJX'  class="zmiti-jx">
				<img :src="imgs.jiangxiang" alt="">
			</div>
		</div>
		
		
		
	</div>
</template>

<script>
	import './index.css';
	import {imgs} from '../lib/assets.js';
	import {zmitiUtil} from '../lib/util';
	export default {
		props:['obserable','nickname','pv'],
		name:'zmitiindex',
		data(){
			return{
				imgs,
				showStartBtn:false,
				showJX:false,
				index:-1,
				yaoqiuList:window.yaoqiuList,
				starting:false,
				show:false,
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
			hidePage(){
				this.obserable.trigger({
					type:'toggleRequirement',
					data:false
				})
				this.obserable.trigger({
					type:'showForm'
				});
				this.obserable.trigger({
					type:'hideIndexSubmitBg',
					data:true
				})
			}
		},
		mounted(){

			var {obserable} = this;

			obserable.on('toggleRequirement',(data)=>{
				this.show = data;
				setTimeout(() => {
					this.showJX = false;
				}, 1000);
			});

			obserable.on('showByJX',()=>{
				this.show =  true;
				this.showJX = true;
			})

		}
	}
</script>