<template>
	<transition name='upload'>
		<div class="lt-full zmiti-upload-main-ui "  v-show='show' ref='page'>
			<div class="lt-full " :style="{background: 'url('+mainImgList[index][0].url+') no-repeat center center',backgroundSize:'cover','-webkit-filter':'blur('+blur+'px)'}"></div>

			<div class="zmiti-upload-C lt-full">
				<div class="zmiti-upload-main">
					<div class="zmiti-upload-img">
						<img :src="imgs.upload">
						<input   class="zmiti-file" accept="image/*" type='file' ref='file' @change="upload"/>
					</div>
					<div class="zmiti-upload-btn" v-if='false'>
						<div>重新上传</div>
						<div>完成</div>
					</div>
				</div>
			</div>

			<div class="zmiti-upload-bottom" ref='list'>
				<ul :style="{width:mainImgList.length*2.4+'rem'}">
					<li v-tap='[tab,i]' v-for='(img,i) in mainImgList'>
						<div :class="{'active':i === index}" :style="{background: 'url('+img[0].url+') no-repeat center center',backgroundSize:'cover'}"></div>
						<div>{{img[0].date}}</div>
					</li>
				</ul>
			</div>

			<div v-show='showClipPage' class="zmiti-img-clip-C lt-full">
				<header>
					<div v-tap="[cancelClip]">取消</div>
					<div v-tap="[beginFacedetection]">确定</div>
				</header>
				<div class="zmiti-photo-loading" v-if='!showClipImg && showClipPage'>图片上传加载中...</div>
				<div class="zmiti-clip-img">
					 
					<canvas ref='canvas' :width='viewW' :height='viewH - 1.5*viewW/10'></canvas>
					<canvas  @touchstart='touchstart($event)' @touchmove='touchmove($event)' @touchend="touchend($event)" :style='{WebkitTransform:"translate3d("+transX+"px,"+transY+"px,0)"}' class="zmiti-clip-canvas" ref='clip-canvas' :width='clipSize' :height='clipSize*10/10'></canvas>

					<div v-show='showClipImg' ref='scan' class="zmiti-scan" :style="{WebkitTransform:'translate3d('+(clipSize+transX+offsetLeft/2-K)+'px,'+(clipSize*10/10-20+transY)+'px,0)'}">
						<img :src="imgs.scan">
					</div>
				</div>
			</div>

		</div>


		
	</transition>
</template>

<script>
	import './index.css';
	import {imgs,mainImgList} from '../lib/assets.js';
	import $ from 'jquery';
	import IScroll from 'iscroll';
	export default {
		props:['obserable','pv','randomPv','nickname','headimgurl'],
		name:'zmitiindex',
		data(){
			return{
				imgs,
				showTeam:false,
				showQrcode:false,
				show:false,
				mainImgList,
				index:0,
				transX:0,
				offsetLeft:0,
				clipSize:0,
				transY:0,
				blur:0,
				iNow:0,
				K:60,
				viewW:window.innerWidth,
				viewH:window.innerHeight,
				showMasks:false,
				animating:false,//正在动画
				isNext:true,
				headimg:"",
				showClipPage:false,
				showClipImg:false,
				isEntryShare:false,
			}
		},
		components:{
		},
		
		methods:{

			beginFacedetection(){
				
				//this.$emit('play-show',true);
				if(this.isEntryShare){
					return;
				}
				this.headimg = '';
				this.isEntryShare = true;


				this.context.clearRect(0,0,this.viewW,this.viewH);
				var {obserable} = this;
				 
				 $.ajax({
                   url: window.protocol+'//api.zmiti.com/v2/share/base64_image/',
	                   type: 'post',
	                   data: {
	                       setcontents: this.clipContext.canvas.toDataURL(),
	                       setwidth: this.clipSize|0,
	                       setheight: this.clipSize*10/10|0
	                   }
	               }).done(data=>{
	               	   if (data.getret === 0) {
	               	   	   this.scaning = true;
	                       var src = data.getimageurl;
	                       this.clipImg = src;
	                       console.log(src);

	                       this.clipContext.clearRect(0,0,this.viewW,this.viewH);

	                      obserable.trigger({
								type:"toggleShare",
								data:{
									show:true,
									index:this.index,
									headimg:src
								}
							})

	                      this.showClipPage = false;
	                      this.showClipImg = false;

	                      

	                        /*var t = setInterval(()=>{
						 	 	var index = Math.random()*100|0;
						 	 	this.currentIndex = index;
						 	 },300)
	                      */
	                    }
	               })
			},

			upload(){


				var {obserable} = this;
				this.detectionError = '正在上传，请稍后';

				this.showSmileText = false;
				this.showClipPage = true;
				obserable.trigger({
               		type:'setPlay',
               		data:{
               			display:'none'
               		}
                })

				var formData = new FormData();
	  		    var s = this;


	  					
			      formData.append('setupfile', this.$refs['file'].files[0]);
			      formData.append('uploadtype', 0);
			     
			      $.ajax({
			        type: "POST",
			        contentType: false,
			        processData: false,
			        url: window.protocol+'//api.zmiti.com/v2/share/upload_file/',
			        data: formData,
			        error(e){
			        	
			        	s.detectionError = '服务器错误';
			          	setTimeout(()=>{
			          		s.detectionError = '';
			          	},2000)
			          	
			        },
			        success(data){
			        	 
				        //console.log(data);
				        //alert('服务器返回正确');
				        if (data.getret === 0) {
				        	obserable.trigger({type:'toggleMusic'});
				          var url = data.getfileurl[0].datainfourl;
				          //alert('上传成功')
				          var img = new Image();
				        	img.onload = function(){
				        		setTimeout(()=>{
				          		s.headimg = url;
				          		if(this.width>this.height){
				          			s.K = 20
				          		}
				          		//s.$emit('play-show',false);//隐藏音乐播放按钮
					          	setTimeout(()=>{
					          		s.initCanvas();
					          	},100)
					          	


					          	s.deleteImg(url);
					          	
					          },100)
				        	}
				          img.src = url
				        }else{
				        	
				        	setTimeout(()=>{
				        		s.detectionError = '';
				        	},2000)
				        }
			        }
			      });
			},

			cancelClip(){

				this.headimg='';
				this.showClipPage = false;
				this.smile = 0;
				this.attractive = 0;
				this.$refs['file'].value = '';
				var {obserable} = this;
				obserable.trigger({
               		type:'setPlay',
               		data:{
               			display:'block'
               		}
               })
				//this.$emit('play-show',true);
			},

			tab(i){
				//console.log(i)
				this.index = i;
				this.blur = 0;
				setTimeout(()=>{
					var t = setInterval(()=>{
						this.blur+=1;
						if(this.blur>=14){
							clearInterval(t);
						}
					},40)
				},600)
				var {obserable} = this;
				/*obserable.trigger({
					type:'toggleUpload',
					data:{
						show:false
					}
				})
				obserable.trigger({
					type:'toggleMain',
					data:{
						show:true,
						index:i
					}
				});*/
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
			drawDashLine(context){
				var self = this;
				context.strokeStyle = 'rgba(241,62,65,.5)';
				var num = Math.floor(self.clipSize/5);  
					 var x1 =0 ,
					 	 x2 = self.clipSize,
					 	 y1 = self.clipSize,
					 	 y2 = self.clipSize;
					for(var i = 0 ; i < num; i++) {  
				        context[i%2 == 0 ? 'moveTo' : 'lineTo'](x1+(x2-x1)/num*i,y1+(y2-y1)/num*i);  
				    }
				//context.fillStyle = 'rgba(0,0,0,.5)';
				//context.fillRect(0,self.clipSize,self.clipSize,self.clipSize*10/10-self.clipSize);

				context.stroke(); 
			},
			initCanvas(){
				var canvas = this.$refs['canvas'];
				var context = canvas.getContext('2d');
				var canvasW = canvas.width,
					canvasH = canvas.height,
					canvasScale = canvasW / canvasH;


				var img = new Image();
				var self = this;

				img.crossOrigin = 'anonymous';


				img.onload = function(){

					var scale = this.width/this.height;

					context.clearRect(0,0,canvasW,canvasH)
					if(this.height / this.width <= canvasH / canvasW){//横图，

						var y = (canvasH - this.height*canvasW/this.width);
						context.drawImage(this,0,y/2,canvasW,this.height*canvasW/this.width);
						self.transX = 0;
						self.clipSize = Math.min(this.height*canvasW/this.width | 0,canvasW)/1.5;
						self.transY = y/2;
						self.imgType = 0;
						self.offsetTop = y/2;
					}
					else{
						scale = canvasH * this.width / this.height;

						var x = canvasW- scale;
						self.offsetLeft = x/2;
						context.drawImage(this,self.offsetLeft,0,scale,canvasH);
						self.transX = x/2;
						self.transY = 0;
						self.clipSize = scale |0;;
						self.imgType = 1;
					}
					 
					self.context = context;
					var clipCanvas = self.$refs['clip-canvas'];
					var clipContext = clipCanvas.getContext('2d');

					var clipCanvasH = self.clipSize * 10 /10;
					
					self.showClipImg = true;

					setTimeout(()=>{
						clipContext.clearRect(0,0,self.clipSize,self.clipSize*10/10)
						clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize*10/10,0,0,self.clipSize,clipCanvasH)
						self.drawDashLine(clipContext)
					},200)

						self.clipContext = clipContext;

						self.canvas = canvas;
							
						}

					
					img.src = self.headimg;

			},
			touchstart(e){
				this.isCanMove = true;
				this.startX = e.changedTouches[0].pageX - this.transX;
				this.startY = e.changedTouches[0].pageY -this.transY;

				//return false;
			},
			touchmove(e){

				e.preventDefault();
				var self = this;
				var canvas = self.canvas;
				var endX = e.changedTouches[0].pageX;
				var endY = e.changedTouches[0].pageY;


				//this.clipContext.clearRect(0,0,self.clipSize,self.clipSize);

				if(self.imgType === 1){

					this.transY = endY - this.startY;
					if(self.transY<=self.offsetTop){
						self.transY = self.offsetTop;
						return;
					}
					if(self.transY >= canvas.height-self.clipSize*10/10){
						self.transY = canvas.height-self.clipSize*10/10;
						return;
					}

					this.transX = endX - this.startX;
					if(self.transX<self.offsetLeft){
						self.transX = self.offsetLeft;
					}

					if(self.transX > canvas.width- self.clipSize - self.offsetLeft){
						self.transX = canvas.width - self.clipSize - self.offsetLeft;
						
					}
					this.clipContext.clearRect(0,0,self.clipSize,self.clipSize*10/10)
					this.clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize*10/10,0,0,self.clipSize,self.clipSize*10/10)
				}
				else{


					this.transX = endX - this.startX;
					if(this.transX<=self.offsetLeft){
						this.transX = self.offsetLeft;
						return;
					}

					if(this.transX>canvas.width - self.clipSize){
						this.transX = canvas.width - self.clipSize;
						return;
					}

					this.transY = endY - this.startY;
					if(self.transY<=self.offsetTop){
						self.transY = self.offsetTop;
						return;
					}
					if(self.transY >= canvas.height-self.clipSize*10/10-self.offsetTop){
						self.transY = canvas.height-self.clipSize*10/10-self.offsetTop;
						return;
					}

					

					//console.log(self.transY,canvas.height-self.clipSize-self.offsetTop)


					this.clipContext.clearRect(0,0,self.clipSize,self.clipSize*10/10);
					this.clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize*10/10,0,0,self.clipSize,self.clipSize*10/10)
				}

				this.drawDashLine(this.clipContext)


				//return false;

			},
			bindEvent(){

				var self = this;
				var canvas = this.$refs['canvas'];
				var $doc=$(document);
				$(this.$refs['scan']).on('touchstart',e=>{
					
					var e = e.originalEvent;
					var startX = e.changedTouches[0].pageX;
					var startY = e.changedTouches[0].pageY;

					var defaultSize = this.clipSize;
					$doc.on('touchmove',e=>{

						e.preventDefault();
						var e = e.originalEvent;

						var endX = e.changedTouches[0].pageX;
						var endY = e.changedTouches[0].pageY;

						this.clipSize = defaultSize -((startX - endX));

					 
						

						//return false;

					}).on('touchend',e=>{
						$doc.off('touchend touchmove');
						this.clipContext.clearRect(0,0,self.clipSize,self.clipSize*10/10)
						this.clipContext.drawImage(canvas,self.transX,self.transY,self.clipSize,self.clipSize*10/10,0,0,self.clipSize,self.clipSize*10/10)

						this.drawDashLine(this.clipContext)
					})

					//return false;
				})
			},
			touchend(){
				this.isCanMove = false;
			}
			
		},
		mounted(){

			window.s = this;
			var {obserable} = this;

			this.scroll = new IScroll(this.$refs['list'],{
				scrollX:true,
				scrollY:false
			});

			this.bindEvent();

			obserable.on('toggleUpload',(data)=>{
				this.show = data.show;
				

				setTimeout(()=>{
					this.scroll.refresh();
					var t = setInterval(()=>{
						this.blur+=1;
						if(this.blur>=14){
							clearInterval(t);
						}
					},40)
				},600)
			})

			obserable.on('fillIndex',(data)=>{
				this.index = data;
			});

			obserable.on('clearFile',()=>{
				this.$refs['file'].value = '';
				this.isEntryShare = false;
			})
		}
	}
</script>