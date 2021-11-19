/**
 * 客服小助手-小星 (https://getbootstrap.com/)
 * @version V1.0.0 `版本号`
 * @description `注释描述`
 * @param {Object} `参数说明`
 * @return {Object} `返回值说明`
 * @author 优酱 `作者`
 * @email 718741938@qq.com `联系邮箱`
 * @create_date 2021-11-09 03:05:19 `创建日期`
 * --
 * @revise_version [V1.0.1] `修订版本`
 * @revise_description [] `修订描述`
 * @revise_author [] `修订作者`
 * @revise_email [] `联系邮箱`
 * @revise_date [] `修订日期`
 * 
 * // !     设计中 []
 * // todo  待确定 []
 * // dev   开发中 [*]
 * // #     已完成 []
 * // *     已发布 []
 * // ?     异　常 []
 * // ~     维护中 []
 * // dep   废　弃 []
 */

//	检测是否引入Jquery
if ( typeof jQuery === 'undefined' ) {
	throw new Error('使用小客服组件需要引入jQuery')
}
// 检测Jquery版本
+function ( $ ) {
	'use strict';
	var version = $.fn.jquery.split(' ')[0].split('.')
	if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
	  throw new Error('使用小客服组件需要jquery版本1.9.1或更高版本，但当前版本低于4 ')
	}
}( jQuery );

/**
 * 定义小星基础信息
 */
class Assistant {
	static APP_NAME 	= '网站小客服';
	static APP_VERSION 	= '1.0';
	static APP_DEV_URL 	= 'https://www.youyan.site';
	static APP_DEBUG 	= true;

	//	页面超时设置 单位：分钟
	static PAGE_OVERTIME_TIME = 30;
	//	页面超时设置标识符
	static PAGE_OVERTIME_IDENTIFIER = false;
	//	自言自语计数
	static SACLER_NUMBER = 1;
	//	自言自语
	static SACLER_IDENTIFIER = false;
	//	表情
	static Emoji = [];
	//	自言自语频率 单位秒
	static AUTOMATIC_SPEAKING_FREQUENCY = 30;
	//	自言自语文本列表
	static AUTOMATIC_SPEAKING_LIST = [
		{
			message:'可疑之利不可取,得之易时失之易。',
			mood:'smile'
		},
		{
			message:'熊猫眼又加重了！注意休息下眼睛～',
			mood:'excite'
		},
		{
			message:'我是不是很厉害呀～～？',
			mood:'happy'
		},
		{
			message:'怎么了？有什么可以帮得到你吗？',
			mood:'excite'
		},
		{
			message:'=。=...',
			mood:'excite'
		},
	];
	constructor(
			name,
			width,
			height,
			apiData={
				faceImages:{
					'smile':'./images/face1.gif',//微笑
					'happy':'./images/face2.gif',//开心
					'excite':'./images/face3.gif',//激动
				},
				music:[],//音乐
				navigation:[],//导航
			},

		) {
		// 用户定义变量
        this.name = name;	// 小助手名称
        this.faceImages = apiData.faceImages;

		this.initWidthAndHeight(width,height);	// 小助手宽高初始化

		// 系统初始化变量
		this.cwidth		= document.documentElement.clientWidth - 100;	//	获取对象可见窗口宽度	JQ=> $(window).width() - 100;
		this.cheight	= document.documentElement.clientHeight - 30;	//	获取对象可见窗口宽度	JQ=> $(window).height() - 30;
		// 
		this.moveX 	= 0;
		this.moveY 	= 0;
		this.moveTop = 0;
		this.moveLeft = 0;
		this.moveable = false;
		 // 自言自语计数器初始值
		this.automaticSpeakingScalerNumber = Assistant.SACLER_NUMBER;
		this.automaticSpeakingScalerIdentifier = Assistant.SACLER_IDENTIFIER; // 定时器标识 在释放自言自语定时器时使用
		//	页面超时监听器标识符（在释放页面监听定时器时使用）
		this.pageOvertimeIdentifier = Assistant.PAGE_OVERTIME_IDENTIFIER;
		

		this.eattimes = 0;

		this.docMouseMoveEvent 	= document.onmousemove;	// 监听鼠标移动
		this.docMouseUpEvent 	= document.onmouseup;	// 鼠标按键被松开时

		this.objectMusicPlayer 	= Object;	// 音乐播放器对象
		this.apiData = apiData;

		// 启用
		this.startRun();

		Assistant.APP_DEBUG && this.config();
    }
	/**
	 * 初始化小助手宽度和高度
	 */
	initWidthAndHeight(width,height){
		this.imagesWidth = width;
		this.imagesHeight = height;
		//	获取历史小星宽高
		var historyWidth 	= this.getCookie("historywidth");
		var historyHeight 	= this.getCookie("historyheight");

		// 如果没有历史记录则自动计算对象可见的窗口宽高
		this.width 	= historyWidth == null ?  document.documentElement.clientWidth - 200 - width : historyWidth; // 小助手图片宽度
		this.height = historyHeight  == null ?  document.documentElement.clientHeight - 200 - width : historyHeight; // 小助手图片高度
	}
	startRun(){
		//	创建DOM视图
		this.createDocumentCanvas();
		//	监听事件
		this.listenEvent();
		//	功能触发事件
		this.funcTrigger();
		//	初始化播放器
		// !Assistant.APP_DEBUG && this.initMusicPlayer();
		this.initMusicPlayer();
		//	触发自言自语
		this.automaticSpeaking();
	}
	/**
	 * 
	 * @param {*} list 
	 */
	setMusic( list ){
		this.apiData.music = list;
		return this;
	}
	/**
	 * 监听事件
	 */
	listenEvent(){
		//  鼠标按下小助手执行事件
		document.getElementById("assistant").onmousedown = ()=>{
			var ent = this.getEvent();
			this.moveable = true;
			console.log(ent);
	
			this.moveX = ent.clientX;	// clientX 事件属性返回当事件被触发时鼠标指针相对于浏览器页面（或客户区）的水平坐标。
			this.moveY = ent.clientY;	// clientY 事件属性返回当事件被触发时鼠标指针向对于浏览器页面（客户区）的垂直坐标。 客户区指的是当前窗口。
	
			var obj = document.getElementById("assistant");
	
			this.moveTop 	= parseInt(obj.style.top);	//	获取小星当前位置的top
			this.moveLeft 	= parseInt(obj.style.left);	//	获取小星当前位置的left
	
			if( navigator.userAgent.indexOf("Firefox") > 0 ){ // 判断是否为火狐浏览器
				window.getSelection().removeAllRanges(); // 从当前selection对象中移除所有的range对象,取消所有的选择
			}
			//  鼠标移动事件		
			document.onmousemove = ()=>{
				if(this.moveable){
					var ent = this.getEvent();
					var x = this.moveLeft + ent.clientX - this.moveX;
					var y = this.moveTop + ent.clientY - this.moveY;
					obj.style.left = x + "px";
					obj.style.top = y + "px";
				}
			};
	
			//  鼠标松开事件
			document.onmouseup = ()=>{
				console.log('鼠标松开事件鼠标松开事件');
				if(this.moveable){
					var historywidth = obj.style.left;
					var historyheight = obj.style.top;
	
					historywidth = historywidth.replace('px', '');
					historyheight = historyheight.replace('px', '');
					// 存储小星当前的位置
					this.setCookie("historywidth", historywidth, 60*60*24*30*1000);
					this.setCookie("historyheight", historyheight, 60*60*24*30*1000);
	
					document.onmousemove = this.docMouseMoveEvent;
					document.onmouseup = this.docMouseUpEvent;
					this.moveable = false; 
					this.moveX = 0;
					this.moveY = 0;
					this.moveTop = 0;
					this.moveLeft = 0;
				}
			}
		};
		// 监听窗口中鼠标移动
		document.onmousemove = ()=>{
			//	重置页面监听
			this.listenPageOvertimeRestart();
		}

		// 鼠标指针移动到小助手时触发
		document.getElementById('assistant').onmouseover = ()=>{
			this.automaticSpeakingScalerRestart(); // 重置自言自语计数器
		}
	}
	/**
	 * 播放音乐
	 */
	playRandomMusics(){
		this.stopTalkSelf();
		this.closeAssistantMenu();
		this.closeInput();

		this.assistantSay("开始唱歌啦....");

		//var morder = Assistant.__RandomNumber( 0,3 );
		$('#music-player').show();
		this.objectMusicPlayer.pause(); // 暂停
		this.objectMusicPlayer.play(); // 播放

		this.setFace( 'happy' );
		this.listenPageOvertimeRestart();

	}
	/**
	 * 页面监听重置
	 */
	listenPageOvertimeRestart(){
		this.releasePageListenOvertimeIdentifier();
		this.listenPageOvertime( 0 );
	}
	/**
	 * 
	 */
	automaticSpeakingScalerClear(){
		clearTimeout( this.automaticSpeakingScalerIdentifier );
		this.automaticSpeakingScalerIdentifier = Assistant.SACLER_IDENTIFIER;
	}
	/**
	 * 创建画布
	 */
	 createDocumentCanvas(){
		//	创建小助手
		$("body").append(`
			<!-- 小客服容器 -->
			<article id="assistant" class="assistant-wrapper theme-style-pink"
				style="
					top:${this.height}px;
					left:${this.width}px;
					width:${this.imagesWidth}px;
					height:${this.imagesHeight}px;
				"
			>
				<!-- 角色形象 -->
				<section id="assistant-sticker"></section>
				<!-- 功能窗口 -->
				<section class='assistant-workarea'>
					<!-- 发言区 -->
					<div id="assistant-dialog"></div>
					<!-- 功能菜单 -->
					<div class="assistant-menu-wrapper">
						<ul>
							<li class="assistant-menu-item" id="wccguide">网站导航</li>
							<li class="assistant-menu-item" id="shownotice">显示公告</li>
							<li class="assistant-menu-item" id="chatTochuncai">技术搜索</li>
							<li class="assistant-menu-item" id="playmusic">弄点歌听</li>
							<li class="assistant-menu-item" id="assistant-life-time">生存时间</li>
							<li class="assistant-menu-item" id="close-assistant">关闭小星</li>
							<div class="clear"></div>
						</ul>
					</div>

					<!-- 搜索框 -->
					<section id="assistant-search">
						<input class="assistant-search-input"  type="text" name="mastersay" placeholder="说点什么吧" />
						<input class="assistant-search-submit" type="button" value="OK" />
					</section>
					<!-- 音乐播放器 -->
					<div id="music-player" class="aplayer"></div>
					<!-- 导航按钮 -->
					<div class='button-menu'>菜单</div>
				</section>
			</article>
			<!-- 召唤小助手 -->
			<div id="call-assistant"
				style="
					top:${this.cheight}px;
					left:${this.cwidth}px;
					text-align:center;
				"
			>
				召唤${this.name}
			</div>
		`);

		// 判断小星是否处于隐藏状态 //? 是否需要单独出去
		if( 'close' === this.getCookie("is_close_assistant") ){
			this.close_assistant_init();
		} else {
			$('#assistant').show();
			this.getdata("getnotice");//打开公告
			this.setFace( 'smile' );
		}	
	}
	initMusicPlayer(){
		let that = this;
		console.log(111111111);
		console.log(that.apiData);
		console.log(2222222222);
		this.objectMusicPlayer = new APlayer({
			container: document.getElementById('music-player'),
			audio: that.apiData.music
		});
	}
	/**
	 * 
	 */
	funcTrigger(){
		// 打开菜单
		$(".button-menu").click(()=>{
			this.assistantMenu();
			this.setFace( 'smile' );
		});
	
		// 关闭小星
		$("#close-assistant").click(()=>{
			this.setFace( 'excite' );
			this.closeAssistant();
		});

		// 召唤小星
		$("#call-assistant").click(()=>{
			this.setFace( 'happy' );
			this.callAssistant();
			this.setCookie("is_close_assistant", '', 60*60*24*30*1000); // 解除小星关闭状态
		});

		// 打开公告
		$("#shownotice").click(()=>{
			this.getdata("getnotice");
			this.setFace( 'smile' );
			this.closeAssistantMenu();
		});

		// 打开网站导航
		$("#wccguide").click(()=>{
			// <li><a href="/article/notice/" target="_blank">1. 了解一下我们最近的动态？</a></li>
			// <li><a href="/article/news/" target="_blank">2. 最近有什么新鲜事发生呢？</a></li>
			// <li><a href="/illustration/nebula" target="_blank">3. 浩瀚星空中的一粒微尘</a></li>
			// <li><a href="https://jq.qq.com/?_wv=1027&k=QQvPj8aE" target="_blank">4. 我有问题，想和大家讨论一下</a></li>
			// <li><a href="/about-us.html" target="_blank">5. 我想投递自己的作品！</a></li>
			let html='';
			this.apiData.navigation.map(( item, index )=>{
				html+=`<li><a href="${item.url} target="_blank"">${++index}.${item.title}</a></li>`;
			})
			this.assistantSay(
				`
					<ul>
						${html}
					</ul>
				`
				,true);
			this.setFace( 'happy' );
			this.closeAssistantMenu();
		});
		//	听音乐
		$("#playmusic").click(()=>{
			this.playRandomMusics();
			this.closeAssistantMenu();
		});
		//	生存时间
		$("#assistant-life-time").click(()=>{
			this.closeAssistantMenu();
			this.setFace( 'happy' );
			this.getdata('showlifetime');
		});
		// 技术搜索
		$("#chatTochuncai").click(()=>{
			this.showInput();
		});
		// 关闭搜索框
		$("#inp_r").click(()=>{
			this.closeInput();
			this.assistantSay('不聊天了吗？(→_→)');
			this.setFace( 'excite' );
		});
		// 搜索按钮提交
		$(".assistant-search-submit").click(()=>{
			this.getdata("talking");
		});
	}
	showInput(){
		this.closeAssistantMenu();
		this.assistantSay("............您要搜点什么？");
		$("#assistant-search").css('display','inline-block');
	}
	/**
	 * 关闭小助手
	 */
	closeAssistant(){

		this.stopTalkSelf(); // 停止轮询瞎BB

		this.assistantSay("记得再叫我出来哦...");
		// 立即关闭功能菜单
		$(".assistant-menu-wrapper").hide();
		//	2秒后关闭小助手视图
		setTimeout(()=>{
			$("#assistant").fadeOut(1200,function(){
				$("#call-assistant").show(); // 窗口视图彻底消失后出现召唤小助手按钮
			}); // 1.2秒
		}, 1300);

		// 保存关闭状态的小助手 
		this.setCookie("is_close_assistant", 'close', 60*60*24*30*1000);
	}
	/**
	 * 
	 */
	close_assistant_init(){

		this.stopTalkSelf();
		$(".assistant-menu-wrapper").hide();
		setTimeout(function(){
				$("#assistant").css("display", "none");
				$("#call-assistant").css("display", "block");
		}, 30);
	}
	closeInput(){
		this.setFace( 'excite' );
		$("#assistant-search").hide();
	}
	/**
	 * 系统事件监听
	 * window.event 是一个由微软IE引入的属性，只有当DOM事件处理程序被调用的时候会被用到。它的值是当前正在处理的事件对象。
	 * arguments 是一个对应于传递给函数的参数的类数组对象。
	 * @returns 
	 */
	getEvent() {
		return window.event || arguments.callee.caller.arguments[0];
	}
	/**
	 * 召唤小助手
	 */
	callAssistant(){

		this.automaticSpeaking();
		setTimeout(()=>{ $("#assistant").fadeIn(1500) },1300);
		$("#call-assistant").css("display", "none");
		this.closeAssistantMenu();
		this.assistantSay("我回来啦～");
		this.setCookie("is_close_assistant", '', 60*60*24*30*1000);

	}
	/**
	 * 自言自语
	 */
	 automaticSpeaking(){

		if( 0 === parseInt( this.automaticSpeakingScalerNumber % Assistant.AUTOMATIC_SPEAKING_FREQUENCY ) ){

			this.closeAssistantMenu();
			this.closeInput();
			let randomNumber = Assistant.__RandomNumber( 1,Assistant.AUTOMATIC_SPEAKING_LIST.length ) - 1; // 随机选择自言自语中的内容

			this.assistantSay( Assistant.AUTOMATIC_SPEAKING_LIST[randomNumber].message );
			this.setFace( Assistant.AUTOMATIC_SPEAKING_LIST[randomNumber].mood );

		}

		//	没有触发定时自言自语时才会执行
		if( !this.automaticSpeakingScalerIdentifier ) this.automaticSpeakingScalerIdentifier = window.setInterval(()=>{ this.automaticSpeaking() }, 1000); // 1秒执行一次自言自语
		// 计数器自增
		this.automaticSpeakingScalerIncrease();
	}
	/**
	 * 自言自语计数器重置
	 */
	automaticSpeakingScalerRestart(){
		this.automaticSpeakingScalerNumber = Assistant.SACLER_NUMBER;
		// 清除定时器
		this.automaticSpeakingScalerIdentifier && this.automaticSpeakingScalerClear();
		// 重新触发自言自语
		this.automaticSpeaking();
	}
	/**
	 * 自言自语计数器自增
	 */
	automaticSpeakingScalerIncrease(){
		this.automaticSpeakingScalerNumber++;
	}
	closeAssistantMenu(){
		this.clearAssistantSay();
		$(".assistant-menu-wrapper").hide();
		$(".button-menu").css("display", "block");
	}
	/**
	 * 
	 */
	stopTalkSelf(){
		this.automaticSpeakingScalerIdentifier && clearTimeout( this.automaticSpeakingScalerIdentifier );
	}
	/**
	 * 系统计时器
	 * 页面在指定时间内没有 事件触发 则停止所有事件
	 * @param {*} accumulative_total_time 
	 */
	listenPageOvertime( accumulative_total_time = 0 ){

		this.pageOvertimeIdentifier = window.setTimeout( ()=>{
			this.listenPageOvertime( ++accumulative_total_time )
		}, 1000 );

		//	超过监听时间停止相关事件活动
		if( parseInt( accumulative_total_time ) == parseInt( Assistant.PAGE_OVERTIME_TIME * 60 ) ){
			// 关闭语书
			this.stopTalkSelf();
			// 关闭目录
			this.closeAssistantMenu();
			// 关闭输入框
			this.closeInput();
		
			this.assistantSay("主人跑到哪里去了呢....");
			this.setFace( 'excite' );
			this.releasePageListenOvertimeIdentifier();
		}
	}
	/**
	 * 生成随机数
	 * @param {*} startNumber 
	 * @param {*} endNumber 
	 * @returns 
	 */
	static __RandomNumber( startNumber, endNumber ){
		return Math.floor( Math.random() * ( endNumber - startNumber ) + startNumber );
	}
	assistantMenu(){
		this.clearAssistantSay();
		this.closeInput();
		this.assistantSay("准备做什么呢？");
		$(".assistant-menu-wrapper").show();
		$(".button-menu").css("display", "none");
	}
	/**
	 * 释放页面监听标识符
	 */
	releasePageListenOvertimeIdentifier(){
		this.pageOvertimeIdentifier && clearTimeout( this.pageOvertimeIdentifier );
	}
	/**
	 * 设置Cookie
	 * @param {*} key 
	 * @param {*} value 
	 * @param {*} expires 
	 */
	setCookie( key, value, expires = false ){

		let system_date_object = new Date();

		// 填写的毫秒数。最终向以1970-01-01为基准，添加millisec后，并重新计算显示新的日期和时间。
		expires && system_date_object.setTime( system_date_object.getTime() + expires );

		//	是否设置cookie超时时间
		expires ? document.cookie = `${key}=${value};` : document.cookie = `${key}=${value};expires=${system_date_object.toGMTString()}`;
	}
	/**
	 * 获取cookie
	 * @param {*} key 
	 * @returns 
	 */
	getCookie( key ){

		let cookie_array = document.cookie.match( new RegExp( `(^| )${key}=([^;]*)(;|$)` ) );

		if( cookie_array != null ) return unescape(cookie_array[2]);

		return null;
	}
	setFace( mood ){

		//let obj = document.getElementById( "mood-"+mood ).src;

		$("#assistant-sticker").css({
			'background':`url(${this.faceImages[ mood ]}) no-repeat scroll 50% 0% transparent`,
			'background-size':'contain',
			'width':`${this.imagesWidth}px`,
			'height':`${this.imagesHeight}px`,
		});

	}
	getdata(el, id){
		var data = {
		 adminname:'',
		 ans: ["早上好～", "中午好～", "下午好～", "晚上好～", "晚安～"],
		 ccs: ["rakutori", "neko", "chinese_moe"],
		 defaultccs: "rakutori",
		 eatsay: ["吃了金坷垃，一刀能秒一万八～！", "吃咸梅干，变超人！哦耶～～～"],
		 isnotice: "",
		 lifetime:{
			 chinese_moe: 1411579198,
			 neko: 1411579198,
			 rakutori: 1411579198
		 },
		 notice: "欢迎来到中文科普站，我是您的小导游～",
		 ques: ["早上好", "中午好", "下午好", "晚上好", "晚安"],
		 showlifetime: '我已经与主人  一起度过了愉快的 <font color="red">2542</font> 天 <font color="red">23</font> 小时 <font color="red">10</font> 分钟 <font color="red">45</font> 秒了～*^_^*'
		};

		 $("#assistant-dialog").css('display', "");

		 var dat = data;
		 if(el == 'defaultccs'){
			 this.assistantSay(dat.defaultccs);
		 }else if(el == 'getnotice'){
			this.assistantSay( dat.notice );
			this.setFace( 'smile' );

		 }else if(el == 'showlifetime'){
			this.assistantSay(dat.showlifetime);
		 }else if(el == 'talking'){
			 var talkcon = $(".assistant-search-input").val();
			 var i = in_array(talkcon, dat.ques);
			 var types = typeof(i);
			 if(types != 'boolean'){
				this.assistantSay(dat.ans[i]);
				this.setFace( 'happy' );
			 }else{
				this.assistantSay('.......................主人还没做这功能呢');
				this.setFace( 'excite' );
			 }
			 clearInput();
		 }else if(el = "eatsay"){
			 var str = dat.eatsay[id];
			 this.assistantSay(str);
			 this.setFace( 'happy' );
		 }else if(el = "talkself"){
			 var arr = dat.talkself;
			 return arr;
		 }
	}
	/**
	 * 小助手对话方法
	 * @param {*} speak 
	 * @param {*} isHtml 
	 */
	assistantSay( speak,isHtml=false ){

		if( this.objSpeakText ){

			this.clearAssistantSay();
			$("#assistant-dialog").show();
			
			if( isHtml ){
				$("#assistant-dialog").html( speak )
			} else {
				this.typing(speak);
			}
			clearTimeout(this.objSpeakText)
			this.objSpeakText = false;
		} else {
			this.objSpeakText = setTimeout(()=>{
				this.assistantSay( speak,isHtml );
			},20)
		}

	}
	/**
	 * 字符串渐出效果
	 * @param {*} stringText 
	 * @param {*} stringIndex 
	 */
	typing( stringText,stringIndex=0){

		document.getElementById("assistant-dialog").innerHTML += stringText.charAt( stringIndex );

        var id = setTimeout(()=>{ this.typing( stringText,++stringIndex ); },20);

		stringIndex == stringText.length && clearTimeout(id);
   }
	/**
	 * 
	 */
	typeWords() {
		let that = this;
		var p = 1;
		var str = this.speak_content.substr(0,this._typei);
		
		var w = this.speak_content.substr(this._typei,1);
		// console.log( str );
		// console.log( w );

		// if( w == "<" ){
		// 	str += this.speak_content.substr(this._typei,this.speak_content.substr(this._typei).indexOf(">")+1);
		// 	p= this.speak_content.substr(this._typei).indexOf(">")+1;
		// }

		this._typei += p;
		document.getElementById("assistant-dialog").innerHTML = str;

		let txtst = setTimeout(function(){
			that.typeWords()
		},20);

		if ( this._typei > this.speak_content.length ){
			clearTimeout(txtst);
			this._typei = 0;
		}
	}
	clearAssistantSay(){
		$("#assistant-dialog").html('').hide();
	}
	eatfood(obj){
		var gettimes = this.getCookie("eattimes");
		if(parseInt(gettimes) > parseInt(9)){
			this.assistantSay("主人是个大混蛋！！");
			this.setFace( 'excite' );
			this.closechuncai_evil();
		}else if(parseInt(gettimes) > parseInt(7)){
			this.assistantSay(".....................肚子要炸了，死也不要再吃了～～！！！TAT");
			this.setFace( 'excite' );
		}else if(parseInt(gettimes) == parseInt(5)){
			this.assistantSay("我已经吃饱了，不要再吃啦......");
			this.setFace( 'excite' );
		}else if(parseInt(gettimes) == parseInt(3)){
			this.assistantSay("多谢款待，我吃饱啦～～～ ╰（￣▽￣）╭");
			this.setFace( 'happy' );
		}else{
			var id = obj.replace("f",'');
			this.getdata('eatsay', id);
		}
		eattimes++;
		this.setCookie("eattimes", eattimes, 60*10*1000);
	}
	static __Color( color ){
		let colorList = {
			'bright'    : '\x1B[1m', // 亮色
			'grey'      : '\x1B[2m', // 灰色
			'italic'    : '\x1B[3m', // 斜体
			'underline' : '\x1B[4m', // 下划线
			'reverse'   : '\x1B[7m', // 反向
			'hidden'    : '\x1B[8m', // 隐藏
			'black'     : '\x1B[30m', // 黑色
			'red'       : '\x1B[31m', // 红色
			'green'     : '\x1B[32m', // 绿色
			'yellow'    : '\x1B[33m', // 黄色
			'blue'      : '\x1B[34m', // 蓝色
			'magenta'   : '\x1B[35m', // 品红
			'cyan'      : '\x1B[36m', // 青色
			'white'     : '\x1B[37m', // 白色
			'blackBG'   : '\x1B[40m', // 背景色为黑色
			'redBG'     : '\x1B[41m', // 背景色为红色
			'greenBG'   : '\x1B[42m', // 背景色为绿色
			'yellowBG'  : '\x1B[43m', // 背景色为黄色
			'blueBG'    : '\x1B[44m', // 背景色为蓝色
			'magentaBG' : '\x1B[45m', // 背景色为品红
			'cyanBG'    : '\x1B[46m', // 背景色为青色
			'whiteBG'   : '\x1B[47m' // 背景色为白色
		};
		return colorList[color];
	}
	config(){
		$('#assistant-sticker').css({
			border:'1xp solid red',
		});
		console.log(`
${Assistant.__Color('red')}-----------------  ~~  小助手常规参数查看 Start  ~~  ---------------------
${Assistant.__Color('green')}- 
${Assistant.__Color('green')}- [组件名称]          ${Assistant.APP_NAME}
${Assistant.__Color('green')}- [组件版本]          ${Assistant.APP_VERSION}
${Assistant.__Color('green')}- [组件文档]          ${Assistant.APP_DEV_URL}
${Assistant.__Color('green')}- [自言自语间隔时间]   AUTOMATIC_SPEAKING_FREQUENCY = ${Assistant.AUTOMATIC_SPEAKING_FREQUENCY} 秒
${Assistant.__Color('green')}- [组件宽度]          width = ${this.width} px
${Assistant.__Color('green')}- [组件高度]          height = ${this.height} px
${Assistant.__Color('green')}-
${Assistant.__Color('red')}-----------------  ~~  小助手常规参数查看 END  ~~  -----------------------
		`);
	};
}