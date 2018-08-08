<template>
	<transition name='main'>
	
		<div class="lt-full zmiti-friend-main-ui " :class="{'show':show}"  ref='page'>
			
			<section>
				<div class="zmiti-index-logo">
					<img :src="imgs.logo" alt="">
				</div>
				<img :src="imgs.friendTitle" alt="">
				<div class="zmiti-friend-C">
					<div class="zmiti-head">
						<img :src="imgs.head1" alt="">
					</div>
					<div>
						<div class="zmiti-friend-nickname">国家电网</div>
						<div class="zmiti-friend-content">
							<div class="zmiti-friend-link">
								<div>
									<img :src="imgs.head2" alt="">
								</div>
								<div>
									<span>中宣部授予张黎明“时代楷模”称号</span>
								</div>
							</div>
						</div>

						<div class="zmiti-friend-time">
							<div>3分钟前</div>
							<div><img :src="imgs.like" alt=""></div>
						</div>

						<div class="zmiti-friend-like-list">
							<img :src="imgs.heart" alt="">
							滨海新区区委宣传部张宁，国网天津市电力公司党建工作部主任及明，国网天津滨海供电公司员工张斌，马秀环老人，塘沽街道新城家园社区居委会主任何丽，张黎明儿子
						</div>
						
						<div class="zmiti-friend-comment">
							<span>滨海新区区委宣传部张宁：</span>
							张黎明在看似平凡中彰显了一名共产党员的先进本色。
						</div>
						<div class="zmiti-friend-comment">
							<span>国网天津市电力公司党建工作部主任及明：</span>
							他所展现出的良好的党性修养产生了辐射效应，带动了一批党员群众向他看齐。
						</div>

						<div class="zmiti-friend-comment">
							<span>国网天津滨海供电公司员工张斌：</span>
							我很荣幸，能在步入企业之初就找到像张黎明这样的工作标杆。
						</div>

						<div class="zmiti-friend-comment">
							<span>马秀环老人：</span>
							张师傅比我自己孩子还上心。
						</div>

						<div class="zmiti-friend-comment">
							<span>塘沽街道新城家园社区居委会主任何丽：</span>
							他是我们百姓的贴心人，也是我们身边的榜样。
						</div>

						<div class="zmiti-friend-comment">
							<span>张黎明儿子：</span>
							他有时候就会跟我说，儿子，你做事情的时候，一定要踏实，要认真，要钻研。
						</div>

						<div class="zmiti-friend-comment">
							<span>张黎明</span>：党的十九大报告已经给我们指明了方向，知识型、技能型、创新型，就是我们蓝领工人的奋斗目标。作为一名基层党员，我会继续在服务群众上下功夫。
						</div>
						
					</div>

				</div>
				<div class="zmiti-copyright" v-tap='[showTeamPage]' v-if='false'>
					制作团队
				</div>
			</section>
			
			<div class="zmiti-back" v-tap='[hidePage]'>
				<img :src="imgs.back" alt="">
			</div>
		</div>
	
	</transition>
</template>

<script>
	import './index.css';
	
	import {
	
		imgs
	
	} from '../lib/assets.js';

	import IScroll from 'iscroll';
	
	import $ from 'jquery';
	
	import zmitiUtil from '../lib/util';

	import Team from '../team/index';
	export default {
	
		props: ['obserable', 'pv', 'randomPv', 'nickname', 'headimgurl'],
	
		name: 'zmitiindex',
	
		data() {
	
			return {
				imgs,
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
			hidePage(){
				this.show = false;
			},
			showTeamPage(){
				this.obserable.trigger({
					type:'showTeam'
				})
			}
		},
	
		mounted() {
			window.s = this;

			this.scroll = new IScroll(this.$refs['page'],{
			})

			var {obserable} = this;
			obserable.on('showFriend',()=>{
				this.show = true;
				this.scroll.scrollTo(0,0,1);
			})
		}
	
	}
</script>