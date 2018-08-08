<template>
	<transition name='main'>
	
		<div class="lt-full zmiti-introduce-main-ui " :class="{'show':show}" :style="{background:'url('+imgs.introduceBg+') no-repeat center center',backgroundSize:'cover'}"  ref='page'>
			<div class="zmiti-logo">
				<img :src="imgs.logo" alt="">
			</div>
			<div class="zmiti-introduce-main">
				<div class="zmiti-introduce-title">
					<img :src="imgs.introTitle" alt="">
					<div>{{texts.zlmIntro}}</div>
				</div>
				<div class="zmiti-introduce-content">
					<h2 class="zmiti-introduce-name">
						{{texts.zlmName}}
					</h2>
					<div class="zmiti-introduce-wrap" ref='zmiti-introduce-wrap'>
						<div>
							<div v-for='(content,i) in texts.zlmIntroContent' :key="i">
								{{content}}
							</div>
						</div>
					</div>
				</div>
			</div>

			<nav class="zmiti-nav">
				<ul>
					<li @touchstart='tabIndex = 0' @touchend='tabIndex = -1' :class="{'active':tabIndex === 0}"  v-tap='[entryDetail,"aigangjingye"]'>爱岗敬业</li>
					<li @touchstart='tabIndex = 1' @touchend='tabIndex = -1' :class="{'active':tabIndex === 1}" v-tap='[entryDetail,"yongyuchuangxin"]'>勇于创新</li>
					<li @touchstart='tabIndex = 2' @touchend='tabIndex = -1' :class="{'active':tabIndex === 2}" v-tap='[entryDetail,"ganyufengxian"]'>甘于奉献</li>
					<li @touchstart='tabIndex = 3' @touchend='tabIndex = -1' :class="{'active':tabIndex === 3}" v-tap='[entryFriend]'>
						<img :src="imgs.msg" alt="">
					</li>
				</ul>
			</nav>

			<div class="zmiti-team-entry" v-tap='[showTeamPage]'>制作团队</div>

			<div class="zmiti-mask" v-if='showMasks' @touchstart='showMasks = false'>
				<img :src="imgs.arrow">
			</div>
			<div>
				<Team :obserable='obserable'></Team>
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
	import IScroll from 'iscroll';
	import Team from '../team/index';
	export default {
		props: ['obserable', 'pv', 'randomPv', 'nickname', 'headimgurl'],
		name: 'zmitiindex',
		data() {
			return {
				imgs,
				texts,
				tabIndex:-1,
				showTeam: false,
				showQrcode: false,
				show: false,
				viewW: window.innerWidth,
				viewH: window.innerHeight,
				showMasks: false,
			}
		},
	
		components: {
			Team
		},
		methods: {
			restart() {
				window.location.href = window.location.href.split('?')[0];
			},
			share() {
				this.showMasks = true;
			},
			entryDetail(key){
				var {obserable} = this;
				obserable.trigger({
					type:"entryDetail",
					data:key
				})
			},
			entryFriend(){
				var {obserable} = this;
				obserable.trigger({
					type:"showFriend"
				})
			},
			showTeamPage(){
				this.obserable.trigger({
					type:'showTeam'
				})
			}
		},
	
		mounted() {
			window.s = this;

			this.scroll = new IScroll(this.$refs['zmiti-introduce-wrap'],{
				scrollbars:true
			});
 
			var {obserable} = this;
			obserable.on('entryIntro',()=>{
				this.show = true;
				this.scroll.refresh();
			})
			 
		}
	
	}
</script>