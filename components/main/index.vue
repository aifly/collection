<template>
	<transition name='main'>
	
		<div class="lt-full zmiti-main-main-ui " :class="{'show':show}"  ref='page'>
	
			<div class="zmiti-mask" v-if='showMasks' @touchstart='showMasks = false'>
	
				<img :src="imgs.arrow">
	
			</div>
	
		</div>
	
	</transition>
</template>

<script>
	import './index.css';
	
	import {
	
		imgs,
	
		mainImgList
	
	} from '../lib/assets.js';
	
	import $ from 'jquery';
	
	import zmitiUtil from '../lib/util';
	
	export default {
	
		props: ['obserable', 'pv', 'randomPv', 'nickname', 'headimgurl'],
	
		name: 'zmitiindex',
	
		data() {
	
			return {
				imgs,
				showTeam: false,
				showQrcode: false,
				show: true,
				viewW: window.innerWidth,
				viewH: window.innerHeight,
				showMasks: false,
			}
		},
	
		components: {},
		methods: {
			restart() {
				window.location.href = window.location.href.split('?')[0];
			},
			share() {
				this.showMasks = true;
			},
		},
	
		mounted() {
			window.s = this;
		}
	
	}
</script>