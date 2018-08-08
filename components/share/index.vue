<template>
	<div  class="lt-full zmiti-share-main-ui " :style="{background:'url('+imgs.shareBg+') no-repeat center top',backgroundSize:'cover'}"   :class="{'show':show}">
		 
		<transition name="zmiti-scale"
			@after-enter="afterEnter"
		 >
		    <div ref='createimgs'  class="zmiti-createimg"  v-if='createImg'>
				<img :src="createImg" alt="">
			</div>
		  </transition>

		 <div class="lt-full zmiti-share-main" :style="{width:viewW+'px',height:viewH+'px',background:'url('+imgs.shareimgBg+') no-repeat center center',backgroundSize:'100% 100%'}" v-if='!createImg && index>-1' ref='zmiti-cache-page'>
		 	<div class="zmiti-share-img-C">
		 		<div class="zmiti-share-img" :style="{background: 'url('+mainImgList[index][0].url+') no-repeat center center',backgroundSize:'cover'}"></div>
		 		<div class="zmiti-qrcode">
		 			<img @touchstart='imgStart($event)' :src="imgs.qrcode" class="zmiti-qrcode-img" />
		 			<img @touchstart='imgStart($event)' :src="imgs.liulian" class="zmiti-liulian">
					<div class="zmiti-date">{{date}}</div>
		 			<div class="zmiti-headimg" v-if='headimg'>
		 				<img @touchstart='imgStart($event)' :src="headimg">
		 			</div>
		 		</div>
		 	</div>
		 </div>

		 <transition name='team'>
				<div v-if='showTeam' :style='{background:"#fff url("+imgs.shareBg+") no-repeat center top",backgroundSize:"cover"}' class="zmiti-team-main-ui lt-full" @touchend='showTeam = false'>
					<div class="zmiti-team-main">
						<h1>
							<div>制作团队</div>
						</h1>
						<section><span>出品人：</span><span>陈凯星</span><span>冯瑛冰</span></section>
						<section><span>监制：</span><span>马书平</span></section>	
						<section><span>策划：</span><span>葛素表</span><span>张洪河</span></section>
						<section><span>统筹：</span><span>徐蕊</span><span>周年均</span></section>
						<section><span>创意：</span><span>曹建礼</span></section>
						<section><span>记者：</span><span>范世辉</span><span>杨世尧</span><span>牟宇</span><span>张润贞</span></section>
						<section><span>编辑：</span><span>潘红宇</span><span>钱程</span><span>赵丹阳</span><span>路滨琪</span><span style="opacity:0;">徐徐达</span><span>屈萌</span><span>赵逸赫</span><span>乔煜成</span></section>
						<section><span>制作：</span><span>马发展</span></section>
						<section><span>技术支持：</span><span>麟腾传媒</span></section>
						<section  style="margin-top: 30px" class="zmiti-copyright"><span>新华社新媒体中心、新华社摄影部、新华社河北分社联合出品</span></section>
						<div class="zmiti-back">返回</div>
					</div>
				</div>
			</transition>
		<transition name='btn'>
			<div class="zmiti-share-btns" :class='{"restart":src}' v-if='showBtns'>
		 		<div v-if='!src' v-tap='[rechoose]'>重新选择</div>
		 		<div v-if='!src' v-tap='[share]'>分享</div>
				<div v-if='src' v-tap='[restart]'>我也要合影</div>
		 		<section v-if='!src' class="zmiti-team" v-tap='[showTeamPage]'>
		 			制作团队
		 		</section>
		 	</div>
		</transition>



		<div class="zmiti-mask" v-if='showMasks' @touchstart='showMasks = false'>
			<img @touchstart='imgStart($event)' :src="imgs.arrow">
		</div>
		
	</div>
</template>

<script>
	import './index.css';
	import {imgs,mainImgList} from '../lib/assets.js';
	import zmitiUtil from '../lib/util';
	import $ from 'jquery';
	import '../lib/html2canvas';
	export default {
		props:['obserable','pv'],
		name:'zmitiindex',
		data(){
			return{
				imgs,
				show:false,
				toastMsg:'',
				src:'',
				headimg:'',
				index:-1,
				viewW:document.documentElement.clientWidth,
				showBtns:false,
				viewH:document.documentElement.clientHeight,
				showMasks:false,
				transX:0,
				showTeam:false,
				date:'',
				transY:0,
				mainImgList,
				createImg:'',

			}
		},
		components:{
		},
		
		methods:{


			restart(){
				window.location.href = window.location.href.split('?')[0]; 
			},
			imgStart(e){
				e.preventDefault();
			},
			showTeamPage(){
				this.showTeam = true;
			},

			share(){
				this.showMasks = true
			},

			rechoose(){
				var {obserable} = this;
				obserable.trigger({
					type:'toggleShare',
					data:{
						show:false,
						index:-1,
						headimg:''
					}
				});
				obserable.trigger({
					type:'clearFile'
				});
				this.index = -1;
				this.headimg = '';
				this.createImg = '';
			},

			afterEnter(){
				this.showBtns = true;
			},
			html2img(){
				var s = this;

				var {obserable} = this;



				//document.title = '开始截图....'


				setTimeout(()=>{
					//this.showLoading = true;
					var ref = 'zmiti-cache-page';
					var dom = this.$refs[ref];
					html2canvas(dom,{
						useCORS: true,
						onrendered: function(canvas) {

					        var src = canvas.toDataURL();
					        s.createImg = src;
		             		s.showBtns = true;
		             		s.showLoading = false;

		             		obserable.trigger({
								type:'playVoice',
								data:"photo"
							})

		             		setTimeout(()=>{
		             			//document.title=s.viewH+','+(s.$refs['createimgs'].offsetHeight*1.2)
								s.$refs['createimgs'].style.WebkitTransform = 'scale('+s.viewH/(s.$refs['createimgs'].offsetHeight*1.2)+')'

								///s.deleteImg(s.headimg);

								
							},100);



							$.ajax({
					          url:window.protocol+'//'+window.server+'.zmiti.com/v2/share/base64_image/',
					          type: 'post',
					          data: {
					            setcontents: src,
					            setwidth: dom.clientWidth,
					            setheight:dom.clientHeight
					          },
					          success: function(data) {
					            if (data.getret === 0) {
					            	//s.deleteImg(dt.img);
						            var src = data.getimageurl;
									var url = window.location.href.split('#')[0];
					            	console.log(src);

									url = zmitiUtil.changeURLPar(url,'src',src);
									url = zmitiUtil.changeURLPar(url,'num',s.pv);
									zmitiUtil.wxConfig('我是第'+s.pv+'位为雄安过周岁者',window.desc,url);
									
								       
					            }

					          }
					        })

							/*zmitiUtil.wxConfig(window.zmitiConfig.shareTitle.replace(/{{totalPv}}/ig, s.totalpv),
							window.zmitiConfig.shareDesc.replace(/{{periods}}/ig, s.periodsUpper[window.zmitiConfig.periods - 1]).replace(/{{pv}}/ig, s.randomPv));*/
					      },
					      width: dom.clientWidth,
					      height:dom.clientHeight
					})
				},100)
			},
			deleteImg(url){//删除原图

				setTimeout(()=>{
					$.ajax({
						url: window.protocol+'//api.zmiti.com/v2/share/delete_file/',
						type:'post',
						data:{
							filepath:url
						},
						success(data){
							console.log(data);
						}
					})

				},2000)
			},
			
			
		},
		mounted(){

			var dt = new Date();

			var year = dt.getFullYear();
			var month = dt.getMonth() + 1;
			var date = dt.getDate();

			this.date = year + ' / ' + month + ' / '+ date;


			var {obserable} = this;


			setTimeout(()=>{
				//this.html2img();
			},1000)

			

			obserable.on('toggleShare',(data)=>{

				this.show = data.show;

				this.index = data.index;
				this.headimg = data.headimg;
				if(data.createImg){
					this.src = data.createImg;
					this.createImg = data.createImg;


					zmitiUtil.wxConfig('我是第'+data.num+'位为雄安过周岁者',window.desc);
				}
				if(data.headimg){
					this.html2img();
					
				}
			})

			/*obserable.trigger({
				type:'toggleShare',
				data:{
					index:0,
					show:true,
					headimg:imgs.logo
				}
			});*/



		}
	}
</script>