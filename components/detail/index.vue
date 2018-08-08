<template>
	<transition name='main'>
	
		<div class="lt-full zmiti-detail-main-ui " :class="{'show':show}"  ref='page'>

			<div :style="{background:'url('+imgs.detailBg+') no-repeat center top',backgroundSize:'cover'}">
				<div class="zmiti-index-logo">
					<img :src="imgs.logo" alt="">
				</div>
				
				<h1></h1>
				<div class="zmiti-detail-title">
					<img :src="data.title" alt="">
				</div>

				<div v-tap='[toggleVideo]' v-if='data.videoPoster' class="zmiti-video-C" :style="{background:showVideo?'transparent':'url('+data.videoPoster+') no-repeat center'}">
					<video :style="{opacity:showVideo?1:0}" :src="data.videoUrl" x5-playsinline="" ref="video" controls x-webkit-airplay="true"  webkit-playsinline="true" playsinline="true" > 
					</video>
				</div>
				<div class="zmiti-video-text">
					{{data.videoText}}
				</div>
				<div class="zmiti-image">
					<img :src="data.image" alt="">
				</div>

				<div class="zmiti-subtitle">
					{{data.subTitle}}
				</div>

				<div class="zmiti-image-text" v-if='data.imageText'>
					<div v-for='(text,i) in data.imageText.split("|")' :key='i'>
						{{text}}
					</div>
				</div>

				<div class="zmiti-comment">
					<h2>
						<div>精选留言</div>
						<div>
							<img :src="imgs.edit" alt="">
							<span>写留言</span>
						</div>
					</h2>
					
					<div v-for="(comment,i) in comments" :key="i" class="zmiti-comment-item">
						<div>
							<img :src="comment.headimgurl" alt="">
						</div>
						<div>
							<div>{{comment.name}}</div>
							<div>{{comment.content}}</div>
						</div>
					</div>
					
					<div class="zmiti-more" v-tap='[entryFriend]'>
						查看更多
					</div>
					
				</div>
			</div>
			<section class="zmiti-back" v-tap='[hidePage]'>
				<img :src="imgs.back" alt="">
			</section>
		</div>
	
	</transition>
</template>

<script>
	import './index.css';
	import {
		imgs
	} from '../lib/assets.js';
	import $ from 'jquery';
	import zmitiUtil from '../lib/util';
	import IScroll from 'iscroll';
	export default {
	
		props: ['obserable', 'pv', 'randomPv', 'nickname', 'headimgurl'],
	
		name: 'zmitiindex',
	
		data() {
	
			return {
				imgs,
				texts,
				comments,
				showTeam: false,
				showQrcode: false,
				showVideo:false,
				show: false,
				viewW: window.innerWidth,
				viewH: window.innerHeight,
				showMasks: false,
				data:{

				}
			}
		},
	
		components: {},
		methods: {
			
			hidePage(){
				this.data = {};
				this.show = false;
				var video = this.$refs['video'];
				video.pause();
			},
			entryFriend(){
				var {obserable} = this;
				obserable.trigger({
					type:'showFriend'
				});
				var video = this.$refs['video'];
				video.pause();
			},
			toggleVideo(){
				this.showVideo = true;
				var video = this.$refs['video'];
				video.play();

				setTimeout(() => {
					this.scroll.refresh()
				}, 1000);
				//video[video.paused?'play':'pause']();
			
			}
		},
	
		mounted() {
			window.s = this;
			this.scroll = new IScroll(this.$refs['page'],{});
			

			//this.data = window.aigangjingye;

			var {obserable} = this;
			obserable.on('entryDetail',key=>{
				this.show =  true;
				this.data = window[key];
				this.scroll.scrollTo(0,0,1);
				this.scroll.refresh()
				setTimeout(() => {
					this.toggleVideo();
				}, 400);
			})
		}
	
	}
</script>