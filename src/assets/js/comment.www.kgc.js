//邀请
function init(){
	// For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection.
	var swfVersionStr = "11.1.0";
	// To use express install, set to playerProductInstall.swf, otherwise the empty string.
	var xiSwfUrlStr = "/img/invite/playerProductInstall.swf";
	var flashvars = {};
	var params = {};
	params.quality = "high";
	params.bgcolor = "#ffffff";
	params.allowscriptaccess = "sameDomain";
	params.allowfullscreen = "true";
	var attributes = {};
	attributes.id = "button";
	attributes.name = "button";
	attributes.align = "middle";
	swfobject.embedSWF(
		"/img/invite/buy-button.swf", "flashContent",
		"470", "38",
		swfVersionStr, xiSwfUrlStr,
		flashvars, params, attributes);
	// JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
	swfobject.createCSS("#flashContent", "display:block;text-align:left;");
}
function initComment(){
	// For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection.
	var swfVersionStr = "11.1.0";
	// To use express install, set to playerProductInstall.swf, otherwise the empty string.
	var xiSwfUrlStr = "/img/invite/playerProductInstall.swf";
	var flashvars = {};
	var params = {};
	params.quality = "high";
	params.bgcolor = "#000000";
	params.allowscriptaccess = "sameDomain";
	params.allowfullscreen = "true";
	var attributes = {};
	attributes.id = "button";
	attributes.name = "button";
	attributes.align = "middle";
	swfobject.embedSWF(
		"/img/invite/button0801.swf", "flashContent",
		"90", "45",
		swfVersionStr, xiSwfUrlStr,
		flashvars, params, attributes);
	// JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
	swfobject.createCSS("#flashContent", "display:inline-block;text-align:left");
}
/**
 * 评论模块
 */
var comments = {
	hasLoad:false,
	beforeFunction:null,
	box:null,
	scrollTop:null,
	windowH:null,
	docH:null,
	scrollBolen:false,
	commentHasLoad:true,
	init:function(){
		if(comments.hasLoad) return ;
		comments.windowH = $(window).innerHeight();
		$(window).resize(function(){
			comments.windowH = $(window).innerHeight();
			comments.commentscroll();
		});
	},
	load:function(page) {
		$.ajax({
			type:'GET',
			url:'/comment/list',
			data:'aid='+$('#KgcOpenProduct_product_id').val()+'&page='+page+'&ajax=1',
			beforeSend:function(){
				$('.showMore').closest('div').html('<p class="showMore">评论加载中...</p>');
			},
			success:function(html){
				var box = comments.box = $('.showMore').closest('div');
				box.html(html);
				//comments.scrollTop = $('.showMore').offset().top;
				//alert(comments.scrollTop);
				comments.scrollBolen = false;
				comments.hasLoad = true;
				//
			}
		});
	},
	commentscroll:function(){
		//if(!comments.commentHasLoad) return;
		//$(window).scroll(function(){ 
			comments.docH = Math.max($(document).height(),$("body").height());
            var showMore = $('.showMore');
			if(showMore.get(0)) comments.scrollTop = showMore.offset().top;
			var wh = comments.windowH;
			var dh = comments.docH;
			var selfTop = courses.selfTop;
			var bottom = parseInt(dh-comments.scrollTop);
			var h = parseInt(dh-wh-selfTop);
			var stoppage = parseInt($('.showMore a').attr('data-page'));
			if(stoppage>=3 || !stoppage) return;
			if(comments.scrollBolen) return;
			if(h<=bottom){
				comments.scrollBolen = true;
				setTimeout(function(){
					$('.showMore a').click();
				},100);
			}
		//});
	},
	showError:function(msg) {
		$('.post_tip_error').html(msg);
		$('.post_tip_error').fadeIn(30);
		setTimeout(function(){
			$('.post_tip_error').fadeOut(200);
		}, 2000);
	},
	initButton:function() {
		$('#postComment').attr('class','input acenter white right top10');
		$('#postComment').val('提交评价').attr('disabled',false);
	},
	initForm:function() {
		$('#KgcOpenComment_comment_content').val('');
		$('input[name=open_grade]').each(function(){
			if($(this).data('rating')) {
				$(this).rating('drain');
				$(this).data('rating').current = null;
				$(this).data('rating', $(this).data('rating'));
			}
		});
		comments.initButton();
		if(bdqn.dialog) bdqn.dialog.close();
	},
	submit:function(okCallback) {
		var v = $('#KgcOpenComment_comment_content').val();
		if($('input[name=open_grade]:checked').length==0) {
			comments.showError('请选择分数');
		} else if($.trim(v)=='') {
			comments.showError('评论内容不能为空');
		} else if($.trim(v).length<6) {
			comments.showError('字数不能小于6个字～');
		} else if(v.length>500) {
			comments.showError('字数不能超过500字');
		} else {
			var fm = $('#postComment').closest('form');
			if(typeof(comments.beforeFunction)!='function') {
				comments.beforeFunction = function(){
					$('#postComment').attr('class','input acenter white right top10 buttom5');
					$('#postComment').val('保存中...').attr('disabled',true);
				};
			}
			if($('#postComment').attr("disabled")) return;
			$.ajax({
				type:'POST',
				url:'/comment/post',
				data:fm.serialize(),
				beforeSend:comments.beforeFunction,
				dataType:'json',
				success:function(data){
					switch (data.code) {
						case 1:
							if($('.list-view .items').first().find('.post').size()>=20) {
								$('.list-view .items').first().find('.post').last().remove();
							}
							if($('.items .post').size()>0) {
								$('.items .post').eq(0).before(data.msg);
							} else {
								$('.items').html(data.msg);
							}
							comments.initForm();
							
							if(typeof(okCallback)=='function'){
								okCallback(data.integral);
							}else{
								getDialog(data.integral);
							}
							break;
						case -2:
							bdqn.login(data, comments.submit);
							comments.initButton();
							break;
						case 3:
							comments.showError(data.msg);
							comments.initForm();
							break;
						default:
							comments.showError(data.msg);
							comments.initForm();
							break;
					}
				}
			});
		}
	},
	tuiguang:function(){
		var tgDailog = $().dialog({id:'dialog_tg',width:520,height:300, title:'推广链接',noBg:true,afterClose:function(){
			$('#baidubutton2').hide();
		}});
		$.ajax({ 
			type: "POST",
			url: "/opt/invite", 
			data:"id="+$("#KgcOpenProduct_product_id").val()+"&id_title="+$("#content_title").val()+"&opt=course",
			dataType: "json",
			success: function(data){
				switch (data.code) {
					case 1:
						if(bdqn.dialog) bdqn.dialog.close();
						var param = '<div class="list-invite-box yq-sec1-href">';
						param += '<p class="list-invite-tip">以下是您的专属邀请链接，可以通过QQ或邮件发送给您的朋友</p>';
						param += '<div class="list-input-box"><input type="text" class="list-invite-input" value="'+data.msg+'" id="invite_text"/></div>';
						param += '<div class="list-invite-copy-box"><a href="javascript:void(0);" class="list-invite-copy" id="flashContent">复制链接</a></div>';
						param += '<div class="yq-share-box fix">';
						param += '<span class="share-text left f14">分享至：</span>';
						param += '<div class="share left" id="baidubutton1"></div></div></div>';
						window._bd_share_config.share[1].bdText = data.msg;
						tgDailog.open(param);
						init();
						$('#baidubutton2').css("position", "fixed");
						$('#baidubutton2').css("z-index", "10018");
						if($("#playDialog").get(0)){
							var top = $('#dialog_tg').offset().top-$("#playDialog").offset().top;
						}else{
							var top = $('#dialog_tg').offset().top;
						}
						var left = $('#dialog_tg').offset().left;
						$('#baidubutton2').css("top", top + 238 + "px");
						$('#baidubutton2').css("left", left + 100 + "px");
						$('#baidubutton2').show();
						break;
					case -2:
						bdqn.login(data, comments.tuiguang);
						break;
					default:
						dialog1.open('<p>'+data.msg+'</p>', 3000);
						break;
				}
		}});
		$(window).resize(function(){
			if($('#dialog_tg').get(0)){
				var offset = $('#dialog_tg').offset();
				$('#baidubutton2').css("top", offset.top + 230 + "px");
				$('#baidubutton2').css("left", offset.left + 100 + "px");
			}
		});
		
	}
};

/**
 * 笔记模块
 */
 var notes = {
	onlyMe:false,
	bar:null,
	loadMy:false,
	loadAll:false,
	defaultContent:'有想法？快快来记录吧~（限500字）',
	init:function(pid){
		if((notes.onlyMe && notes.loadMy) || (!notes.onlyMe && notes.loadAll)) {
			notes.showScrollBar();
			return ;
		}
		this.initForm($('.play-tab-con .note-area'),{pid:pid, content:this.defaultContent});
		this.load(1);
		// //点赞 挪到 comment.js 里去，解决其他页面笔记不能点赞问题
		$(document).off("click", ".note-zan")
		$(document).on("click", ".note-zan",function(e){
			var _this = $(e.target);
			if(_this.hasClass('note-zan-over')||_this.hasClass("note-zan-clicked-not-click-again")) return;
			_this.addClass("note-zan-clicked-not-click-again");//防止重复点赞
			var _click_dom = _this;
			var _click_id = _this.closest("li").find("input[name='id']").val();
			notes.opration(_click_dom,_click_id);
		});
	},
	load:function(page) {
		if(notes.onlyMe) {
			$.ajax({
				type:'GET',
				url:'/note/list',
				data:'pid='+pc.pid+'&me=1&page='+page+'&ajax=1',
				// async:((page>1)?true:false),
				beforeSend:function(){
					$('.play-tab-con .note-more').closest('.my-note-list').html('<p class="note-more">笔记加载中...</p>');
				},
				success:function(html){
					if(html=="-1"){
						dialog1.open("<p>你已退出，请重新登录</p>", 3000);
						// $("#playDialog").remove();
						window.location.reload();
					}else{
						if(page==1) {
							$('.play-tab-con .my-note-list').eq(0).html(html);
						} else {
							$('.play-tab-con .note-more').closest('.my-note-list').html(html);
						}
						notes.showScrollBar();
						notes.loadMy = true;
					}
				}
			});
		} else {
			$.ajax({
				type:'GET',
				url:'/note/list',
				data:'pid='+pc.pid+'&me=0&page='+page+'&ajax=1',
				// async:((page>1)?true:false),
				beforeSend:function(){
					$('.play-tab-con .note-more').closest('.all-note-list').html('<p class="note-more">笔记加载中...</p>');
				},
				success:function(html){
					if(html=="-1"){
						dialog1.open("<p>你已退出，请重新登录</p>", 3000);
						// $("#playDialog").remove();
						window.location.reload();
					}else{
						if(page==1) {
							$('.play-tab-con .all-note-list').eq(0).html(html);
						} else {
							$('.play-tab-con .note-more').closest('.all-note-list').html(html);
						}
						notes.showScrollBar();
						notes.loadAll = true;
					}
				}
			});
		}
	},
	initForm:function(dom, opts){
		var opt= $.extend({
			id:"",
			pid:"",
			subject:"",
			img:"",
			isPublic:1,
			content:""
		},opts);
		var checkStr = opt.isPublic==1?" checked":"";
		var imgShow = opt.img==""?" hide":"";
		$("form").removeClass("onlive");
		var html = '<form action="" class="onlive" name="form1" method="post">';
			html += '	<input type="hidden" name="id" value="'+opt.id+'" />';
			html += '	<input type="hidden" name="pid" value="'+opt.pid+'" />';
			html += '	<input type="hidden" name="subject" value="'+opt.subject+'" />';
			html += '	<input type="hidden" name="img" value="'+opt.img+'" />';
			html += '	<textarea class="p-note-area" name="content">'+opt.content+'</textarea>';
			html += '	<div class="area-bottom fix">';
			html += '	<div class="left area-bottom-l">';
			html += '		<a href="javascript:void(0);" title="截图" class="yui3-u p-screen"></a>';
			html += '		<input type="checkbox" id="set-open" name="isPublic" value="1" '+checkStr+' class="v-align" />';
			html += '		<label for="set-open" class="open-ornot v-align">公开</label>';
			html += '		<span class="p-screen-show'+imgShow+'">';
			html += '			<a href="javascript:void(0);" title="取消" class="right p-screen-hide"></a>';
			html += '			<span class="p-screen-corner"></span><span class="p-screen-box">';
			if(opt.img) {
				html += '<img src="'+opt.img+'.thumb.jpg" />'; 
			}
			html +=				'</span>';
			html += '		</span>';

			html += '	</div>';
			html += '	<div class="right">';
			if(opt.id) {
				html += '<button type="button" class="note-quit">取消</button>';
			}
			html += '	<button type="button" class="note-save">提交</button>';
			html += '   </div>';
			html += '	</div>';
             html += '		<p class="note-info"></p></form>';
		dom.html(html);
		if(!pc.onPlay){
			$(".p-screen").addClass("has-screen");
			$(".p-screen").attr("title","");
		}else{
			$(".p-screen").removeClass("has-screen");
			$(".p-screen").attr("title","截图");
		}
	},
	showScrollBar:function(){
		if(notes.bar == null && !$("#p-note-scroll").is(':visible'))return;
		var h = $(".course-title").outerHeight()+$("ul.ct-sec6").outerHeight();
		if(typeof(skyScroll)=='undefined') return;
		if(notes.bar) {
			$("#p-note-scroll").closest(".sky_warpper").siblings().hide();
			$("#p-note-scroll").closest(".sky_warpper").show();
			notes.bar.height = pc.height-h;
			notes.bar.recalculated();
		} else {
			$("#p-note-scroll").siblings().hide();
			notes.bar = skyScroll({ 
				target:"p-note-scroll",
				height:pc.height-h
			}); 
		}
		return this;
	},
	eidtNote:function(){
		//编辑笔记
		$(".item .note-edit").live("click", function(){
			var item=$(this).closest(".item");
			var id = item.find("input[name='id']").val();
			//var content = item.find(".note-text").html().replace(/<br>/g,"\r");
			var content = item.find("input[name='content']").val();
			var newItem = $("<li class=\"note-area edit-show\"></li>")
			var img = item.find("input[name='img']").val();
			var isPublic = item.find("input[name='isPublic']").val();
			item.hide().before(newItem);
			notes.initForm(newItem,{id:id, pid:pc.pid, content:content, img:img, isPublic:isPublic});
			notes.showScrollBar();
		});

		$(".note-area .note-quit").live("click", function(){
			var item=$(this).closest(".edit-show");
			item.hide().next().show();
			item.remove();
			notes.showScrollBar();
		});
	},
	textOVerflow:function(){
		//查看全部
		$(".click-text").live("click",function(e){
			e.stopPropagation();
			if($(this).hasClass("show-all")){
				var content = $(this).closest("li").find("input[name='content']").val();
				$(this).removeClass("show-all");
				$(this).prev().html(content.replace(/[\r|\n|\r\n]/g,"<br>"));
				$(this).text("收起 ∧");
			}else{
				var content_cut = $(this).closest("li").find("input[name='content_cut']").val();
				$(this).addClass("show-all");
				$(this).prev().html(content_cut);
				$(this).text("展开全部 ∨");
			}
			var id = $(".ct-sec6 li.playOn").attr("id");
			if(id=="p-note"){
				notes.showScrollBar();
			}else if(id=="p-ask"){
				ask.showScrollBar();
			}
		});
	},
	opration:function(_click_dom,_click_id) {
		$.post("/note/opration", {id:_click_id,opt:1},function(data){
			switch (data.code) {
				case 1:
					var newDiv = $("<div style='color:red;font-weight:bold;font-size:0px;line-height:0px;position:absolute;right:20px;bottom:25px;'>+1</div>");
					_click_dom.after(newDiv);
					newDiv.animate({fontSize:"16px",bottom:"42px"}, 450, "linear", function(){
						newDiv.fadeOut(150);
					});
					_click_dom.html("("+data.num+")");
					_click_dom.addClass("note-zan-over");
					if(bdqn.dialog) bdqn.dialog.close();
					break;
				case -2:
					bdqn.login(data, notes.opration);
					_click_dom.removeClass("note-zan-clicked-not-click-again");
					break;
				case -1:
					if(bdqn.dialog) bdqn.dialog.close();
					courses.loadNotes(1, 0);
					break;
				default:
					dialog1.open('<p>'+data.msg+'</p>', 3000);
					_click_dom.removeClass("note-zan-clicked-not-click-again");
					break;
			}
		}, 'json');
	}
 };

 /**
  * 问答模块
  */
  var ask = {
		onlyMe:false,
		bar:null,
		loadMy:false,
		loadAll:false,
		defaultContent:'有虾米疑问？让大家解答一下~（限500字）',
		init:function(pid){
			if((ask.onlyMe && ask.loadMy) || (!ask.onlyMe && ask.loadAll)) {
				ask.showScrollBar();
				return ;
			}
			this.initForm($('.ask-area'),{pid:pid, content:this.defaultContent});
			this.load(1);
		},
		load:function(page) {
			// if(ask.onlyMe)
			{
				var moreSelectorStr = (ask.onlyMe)?".play-tab-con .ask-more-me":".play-tab-con .ask-more-all";
				var listSelectorStr = (ask.onlyMe)?".play-tab-con .my-ask-list":".play-tab-con .all-ask-list";
				var pageInputIDStr = (ask.onlyMe)?"#me_page":"#all_page";
				var pageCountSelectorStr = (ask.onlyMe)?"#meCount":"#allCount";//这两个在返回的php中
				$.ajax({
					type:'GET',
					url:'/ask/list',
					data:{cid:pc.pid,me:(ask.onlyMe)?1:0,page:page,ajax:1,view:(ask.onlyMe)?"_play_me":"_play_all"},
					// async:((page>1)?true:false),
					beforeSend:function(){
						$(moreSelectorStr).html('问答加载中...');
					},
					success:function(html){
						var answer = $(".ask-tj-answer>a.tj-answer,.ask-tj-answer-me>a.tj-answer")//已存在的答案
						if(page==1) {
							$(listSelectorStr).eq(0).children(".all-note").html(html);
							$(pageInputIDStr).val('2');
						} else {
							//$('.ask-more').prev(".all-note").html(html);
							$(listSelectorStr).eq(0).children(".all-note").append(html);
						}
						var newAnswer = $(".ask-tj-answer>a.tj-answer,.ask-tj-answer-me>a.tj-answer").not(answer);
						for(var i=0,il=newAnswer.length;i<il;i++){
							var answerItem = newAnswer.eq(i);
							if(answerItem.height() > 54){answerItem.addClass("tj-ellipsis");}
						}
						if(html == '' || page >= $(pageCountSelectorStr).val()){
							$(moreSelectorStr).html('快去提出你的困惑吧');
						}else{
							$(moreSelectorStr).html('<a href="javascript:void(0);" data-page="2">查看更多</a>');
						}
						ask.showScrollBar();
						(ask.onlyMe)?ask.loadMy = true:ask.loadAll = true;
					}
				});
			}
		},
		initForm:function(dom, opts){
			var opt= $.extend({
				id:"",
				cid:"",
				pid:"",
				subject:"",
				qndNum:"",
				img:"",
				content:"",
				newcreate:true
			},opts);
			var imgShow = opt.img==""?" hide":"";
			opt.cid = opt.pid;
			$("form").removeClass("onlive");
			var html = '<form action="" class="onlive" name="form1" method="post">';
				html += '	<input type="hidden" name="id" value="'+opt.id+'" />';
				html += '	<input type="hidden" name="cid" value="'+opt.cid+'" />';
				html += '	<input type="hidden" name="pid" value="'+opt.pid+'" />';
				html += '	<input type="hidden" name="subject" value="'+opt.subject+'" />';
				html += '	<input type="hidden" name="qndNum" value="'+opt.qndNum+'" />';
				html += '	<input type="hidden" name="img" value="'+opt.img+'" />';
				html += '	<textarea class="p-note-area p-ask-area" name="content">'+opt.content+'</textarea>';
				html += '	<div class="area-bottom fix">';
				html += '	<div class="left area-bottom-l">';
				html += '		<a href="javascript:void(0);" title="截图" class="yui3-u p-screen"></a>';
				html += '		<label class="v-align">悬赏</label>';
				if(opt.newcreate){
					html += '		<input type="text" class="v-align ask-input" name="price" value="0"/><input type="text" style="display:none" name="price1"/>';
				}else{
					html += '		<input type="text" class="v-align ask-input" name="price" disabled value="'+opt.qndNum+'"/>';
				}
				html += '		<label class="v-align">K币，应答更快哦</label>';
				html += '		<span class="p-screen-show'+imgShow+'">';
				html += '			<a href="javascript:void(0);" title="取消" class="right p-screen-hide"></a>';
				html += '			<span class="p-screen-corner"></span><span class="p-screen-box">';
				if(opt.img) {
					html += '<img src="'+opt.img+'.thumb.jpg" />'; 
				}
				html +=				'</span>';
				html += '		</span>';
				html += '	</div>';
				html += '	<div class="right">';
				if(opt.id) {
					html += '<button type="button" class="ask-quit">取消</button>';
				}
				html += '	<button type="button" class="ask-save">提交</button>';
				html += '   </div>';
				html += '	</div>';
                html += '		<p class="note-info"></p></form>';
			dom.html(html);
			if(!pc.onPlay){
				$(".p-screen").addClass("has-screen");
				$(".p-screen").attr("title","");
			}else{
				$(".p-screen").removeClass("has-screen");
				$(".p-screen").attr("title","截图");
			}
		},
		showScrollBar:function(){
			if(ask.bar == null && !$("#p-ask-scroll").is(':visible'))return;
			var h = $(".course-title").outerHeight()+$("ul.ct-sec6").outerHeight();
			if(typeof(skyScroll)=='undefined') return;
			if(ask.bar) {
				$("#p-ask-scroll").closest(".sky_warpper").siblings().hide();
				$("#p-ask-scroll").closest(".sky_warpper").show();
				ask.bar.height = pc.height-h;
				ask.bar.recalculated();
			} else {
				$("#p-ask-scroll").siblings().hide();
				ask.bar = skyScroll({ 
					target:"p-ask-scroll",
					height:pc.height-h
				}); 
			}
			return this;
		},
		editAsk:function(){
			//编辑笔记
			$(".item .ask-edit").live("click", function(){
				var item=$(this).closest(".item");
				var id = item.find("input[name='id']").val();
				var content = item.find("input[name='content']").val();
				var newItem = $("<li class=\"ask-area edit-show\"></li>")
				var img = item.find("input[name='img']").val();
				var qndNum = item.find("input[name='qndcontent']").val();
				//var isPublic = item.find("input[name='isPublic']").val();
				item.hide().before(newItem);
				ask.initForm(newItem,{id:id, pid:pc.pid, content:content, img:img, qndNum:qndNum, newcreate:false});
				ask.showScrollBar();
			});
			$(".ask-area .ask-quit").live("click", function(){
				var item=$(this).closest(".edit-show");
				item.hide().next().show();
				item.remove();
				ask.showScrollBar();
			});
		}
  };

/**  截图点击出现大图  **/
 var playScreen = {
	mask : null,
	screenb : null,
	boxW : null,
	boxH : null,
	setShadow:function(){
		playScreen.mask = $("#playerMask");
		if(!playScreen.mask.get(0)){
			playScreen.mask = $('<div id="playerMask"></div>');
			$("#player-left").append(playScreen.mask);
		}
		playScreen.boxW = $("#player-left").width();
		playScreen.boxH = $("#player-left").height();
		playScreen.mask.width(playScreen.boxW);
		playScreen.mask.height(Math.max(playScreen.boxH,$(window).height()));
	},
	setBox:function(pram){
		var _screenB = $("#screenBox") ;
		if(!_screenB.get(0)){
			var _playScreen = playScreen;
			var _screenBStr = $('<div id="screenBox"><p class="img-hide-box"><a href="javascript:void(0);" id="screenHide" class="screenHide">关闭</a></p><div class="screenImgBox"><img src="" class="imgSrc"/></div></div>');
			$("#player-left").append(_screenBStr);
			_screenB = _playScreen.screenb = $("#screenBox");
			var img = $(".imgSrc");
			img.load(_playScreen.imgBoxWindowResizeHandle).error(_playScreen.imgBoxWindowResizeHandle)
		}
		$(".imgSrc").attr("src",pram);
	},
	imgBoxWindowResizeHandle:function (){
		var _playScreen = playScreen;
		var _img = $(".imgSrc");
		var _screenB = _playScreen.screenb;
		if(_screenB){
			_screenB.width(_img.width());
			var l =(_playScreen.boxW-_screenB.outerWidth())/2;
			var t =(_playScreen.boxH-_screenB.outerHeight())/2;
			_screenB.css({"left":l+"px","top":t+"px"});
		}
	},
	screenHide:function(){
		$("#screenHide").off("click").on("click",function(){
			var _playScreen = playScreen
			_playScreen.mask.hide();
			_playScreen.screenb.remove();
			$(window).off("resize",_playScreen.windowResizePlayScreenHandle)
		});
	},
	show:function(pram){
		playScreen.init(pram);
		playScreen.mask.show();
		playScreen.screenb.show();
	},
	init:function(pram){
		var _playScreen = playScreen
		_playScreen.setShadow();
		_playScreen.setBox(pram);
		_playScreen.screenHide();
		$(window).off("resize",_playScreen.windowResizePlayScreenHandle).on("resize",{pram:pram},_playScreen.windowResizePlayScreenHandle);
	},
	windowResizePlayScreenHandle:function(pram){
		var _playScreen = playScreen
		_playScreen.setShadow();
		_playScreen.imgBoxWindowResizeHandle();
	}
};

/**积分弹框**/
function getDialog(price){
	var getPrice = $(".dialog-get");
	var w = $(window).innerHeight();
	if(!$(".dialog-get").get(0)){
		getPrice = $('<div class="dialog-get dialog-get-jf"></div>');
		getPrice.css({"top":(w-88)/2+"px"});
		$("body").append(getPrice);
	}
	if((parseInt(price) == price)&& (price != 0)){
		getPrice.html('+'+price+' 积分');
		getPrice.fadeIn().fadeOut(3000);
	}
}

//回复评论弹出数据
function loadcomments(id,page) {
    var dom = $('#childcomment'+id);
	dom.prepend('<img src="/img/tx-loading.gif" />');
    $.post('/comment/reply', {cid:id,page:page}, function(data){
        if(data.code==1){
            dom.html(data.html);
			if(page>1) {
				var top = dom.offset().top - 90;
				$("html,body").animate({scrollTop:top},100);
			}
        }
    },'json');
}
/**邀请好友是否支持复制**/
function copyToClipBoard(){
	var _dom = $(".yq-sec1-href");
	offset=_dom.offset();
	_str=$('<div class="dialogScore"><p>复制成功！</p></div>');
	if(_dom.hasClass("list-invite-box")){
		_str.css({'top':offset.top+50,'left':offset.left+190});
	}else{
		_str.css({'top':offset.top+30,'left':offset.left+280});
	}
	$("body").append(_str);
	_str.fadeIn(600,function(){
		_str.fadeOut(2500,function(){
			_str.remove();
		});
	})
	return document.getElementById("invite_text").value;
}

function copyToClipBoard2(){
	var _dom = $(".inviteSec");
	offset=_dom.offset();
	_str=$('<div class="dialogScore"><p>复制成功！</p></div>');
	if(_dom.hasClass("list-invite-box")){
		_str.css({'top':offset.top+50,'left':offset.left+390});
	}else{
		_str.css({'top':offset.top+30,'left':offset.left+480});
	}
	$("body").append(_str);
	_str.fadeIn(600,function(){
		_str.fadeOut(2500,function(){
			_str.remove();
		});
	})
	return document.getElementById("invite_text2").value;
}

$(function(){

	/**
	 * @ 课程播放页 js
	 *  “目录”、“笔记”、“问答” 切换
	 *  我的笔记、所有笔记（我的问答、所有回答）切换
	 *  文本输入区
	 */

	//“目录”、“笔记”、“问答”切换
	notes.eidtNote();//编辑文本
	ask.editAsk();
	notes.textOVerflow();//文本截取
	//第一级tab切换
	$(".ct-sec6 li").live("click", function(){
		var id=$(this).attr("id"), bar;
		pc.tab = id;
		$(".play-box").hide();
		$("#"+id+"-scroll").show();
		$(this).siblings().removeClass("playOn");
		$(this).addClass("playOn");
		if(!pc.onPlay){
			$(".p-screen").addClass("has-screen");
			$(".p-screen").attr("title","");
		}else{
			$(".p-screen").removeClass("has-screen");
			$(".p-screen").attr("title","截图");
		}
		switch(id) {
			case "p-note":
				notes.init(pc.pid);
				break;
			case "p-ask":
				ask.init(pc.pid);
				break;
			case "p-ml":
			default:
				pc.showScrollBar();
				break;
		}
		$(".note-info").html("");
	});

	//第二级tab切换
	$(document).on("click", ".note-topTab a",function() {
		$(this).siblings().removeClass("note-top-on");
		$(this).addClass("note-top-on");
		var name = $(this).attr("name");
		$(".note-tab-main").find("."+name).siblings().hide();
		$(".note-tab-main").find("."+name).show();
		switch(name) {
			case "p-my-note":
				notes.onlyMe = true;
				notes.init(pc.pid);
				break;
			case "p-all-note":
				notes.onlyMe = false;
				notes.init(pc.pid);
				break;
			case "p-my-ask":
				ask.onlyMe = true;
				ask.init(pc.pid);
				break;
			case "p-all-ask":
				ask.onlyMe = false;
				ask.init(pc.pid);
				break;
			default:
				break;
		}
		$(".note-info").html("");
	});

	//文本输入区
	var naTextarea = "有想法？快快来记录吧~（限500字）";
	$(".p-note-area").live({
		"focus":function(){
			if($(this).hasClass("p-ask-area")){
				naTextarea = "有虾米疑问？让大家解答一下~（限500字）";

			}else{
				naTextarea = "有想法？快快来记录吧~（限500字）";
			}
			if($(this).val()==naTextarea)
				$(this).val("");
		},
		"blur":function(){
			if($.trim($(this).val())==""){
				if($(this).hasClass("p-ask-area")){
					naTextarea = "有虾米疑问？让大家解答一下~（限500字）";
				}else{
					naTextarea = "有想法？快快来记录吧~（限500字）";
				}
				$(this).val(naTextarea);
			}	
		}
	});
	/*
	$("textarea[name='content']").live("blur", function(){
		var content = $.trim($(this).val()); 
		var errorHtml = "笔记内容不能为空";
		if(content=="" || content==naTextarea) {
			if($(this).hasClass("p-ask-area")){
				errorHtml = "内容不能为空";
			}
			$(this).closest("form").find(".note-info").html("<span class='note-error'>"+errorHtml+"</span>");
			return ;
		}else if(content.length>500) {
			$(this).closest("form").find(".note-info").html("<span class='note-error'>字数超限</span>");
			return ;
		} else {
			$(this).closest("form").find(".note-info").html("");
		}
	});
	*/
	$("textarea[name='content']").live("focus", function(){
		$(this).closest("form").find(".note-info").html("");
	});

	//点击“截图”按钮
	$(".p-screen").live("click",function(){
		if(!pc.onPlay) return ;
		$("form").removeClass("onlive");
		$(this).closest("form").addClass("onlive");
		$(this).closest("form").find(".note-info").html("截图处理中");
		var player = document.getElementById("YoukePlayer");
		if(player && typeof(player.onSnapshotCMD)=="function") {
			player.onSnapshotCMD();
		} else {
			$(this).closest("form").find(".note-info").html("");
		}
	});
	//点击“截图”按钮之后 截图悬浮层中的“X”关闭按钮
	$(".p-screen-hide").live("click",function(){
		$(this).closest("form").find("input[name='img']").val("");
		$(this).closest(".p-screen-show").hide();
	});
	//点击“截图”按钮之后 截图悬浮层 截图图片----左侧显示大图
	$(".p-screen-box").live("click",function(){
		var src = $(this).find("img").attr("src");
		var subLen = src.indexOf(".thumb");
		if(subLen>0){
			var finalSrc = src.substring(0,subLen);//课工场图片链接
		}else{
			var finalSrc = src.replace("/198","/0");//腾讯云图片
		}
		playScreen.show(finalSrc);
	});
	//点击列表内容中的截图 图片放大
	$(".s-pScreen").live("click",function(){
		var src = $(this).find("img").attr("src");
		var subLen = src.indexOf(".thumb");
		var finalSrc = src.substring(0,subLen);
		var prevS = $(this).prev(".screen-big");
		if($(this).closest(".all-note-list").hasClass("detail-view-box") || $(this).closest("ul").hasClass("detail-na-main")){
			if(!prevS.get(0)){
				var bigIMg = $('<img src="'+finalSrc+'" class="screen-big"/>')
				bigIMg.insertBefore($(this));
			}else{
				prevS.show();
			}
			$(this).hide();
		}else{
			playScreen.show(finalSrc);
		}
	});
	//点击放大后的大图
	$(".screen-big").live("click",function(){
		$(this).next(".s-pScreen").show().end().hide();
	});
	//截图悬浮
	$(".s-pScreen").live('mouseenter', function(e){
		$(this).children().stop(true,true);
		$(this).children(".big-screen-mask").animate({opacity:0.2},400).next().animate({opacity:1},400);
	});
	$(".s-pScreen").live('mouseleave', function(e){
		$(this).children().stop(true,true);
		$(this).children(".big-screen-mask").animate({opacity:0},400).next().animate({opacity:0},400);
	});

	/**
	 * @以下为笔记所有js
	 * @“删除笔记” && “发布笔记”
	 */
	//删除笔记
	$(".note-del").live("click", function(){
		var item=$(this).closest(".item");
		item.siblings().find(".note-confirm").remove();
		if(item.find(".note-confirm")[0])	{
			item.find(".note-confirm").show();
		} else {
			item.prepend("<div class='note-confirm'><p class='del-note-text'>确定要删除该笔记吗？</p><p class='del-note'><button type='button' class='note-quit'>取消</button><button type='button' class='note-save'>确定</button></p></div>");
		}
	});
	//删除笔记 -- 取消
	$(".note-confirm .note-quit").live("click", function(){
		$(this).closest(".note-confirm").hide();
	});
	//删除笔记 -- 确定
	$(".note-confirm .note-save").live("click", function(){
		$(this).closest(".note-confirm").hide();
		var id=$(this).closest(".item").find("input[name='id']").val();
		var pid=$(this).closest(".item").find("input[name='product_id']").val();
		$.post("/note/delete?id="+id+'&pid='+pid,{},function(){
			notes.loadAll = false;
			notes.load(1);
		});
	});
	//发布笔记
	$(".note-area .note-save").live("click", function(){
		var _this = $(this);
		var _area = _this.closest(".note-area");
		var frm=_this.closest("form");
		$("form").removeClass("onlive");
		frm.addClass("onlive");
		var content = $.trim(frm.find("textarea[name='content']").val());
		var id=frm.find("input[name='id']").val();
		var pid=frm.find("input[name='pid']").val();
		var img=frm.find("input[name='img']").val();
		var ispublic=frm.find("input[name='isPublic']").val();
		if($("form.onlive").find("textarea[name='content']").hasClass("p-ask-area")){
			naTextarea = "有虾米疑问？让大家解答一下~（限500字）";

		}else{
			naTextarea = "有想法？快快来记录吧~（限500字）";
		}
		if(content=="" || content==naTextarea) {
			frm.find(".note-info").html("<span class='note-error'>笔记内容不能为空</span>");
			return ;
		}else if(content.length>500) {
			frm.find(".note-info").html("<span class='note-error'>字数超限</span>");
			return ;
		}else{
			frm.find(".note-info").html("");
		}
		frm.find("input[name='subject']").val(pc.video.subject);
		_this.html('稍后').addClass('note-saving').attr('disabled',true);
		$.post("/note/post", frm.serialize(), function(data){
			notes.loadMy = false;
            if (data.code !== "undefined" && data.code == 0) {//禁言返回信息
                frm.find(".note-info").html("<span class='note-error'>"+data.msg+"</span>");
            }else{
                if(id){
                    var item=_this.closest(".edit-show");
                    item.next().remove();
                    item.replaceWith(data.html);
                } else {
                	var $scrollBox = $("#p-note-scroll")
					if(data.html)$scrollBox.find(".my-note-list .all-note").eq(0).prepend(data.html);
					if(data.allHtml)$scrollBox.find(".all-note-list .all-note").eq(0).prepend(data.allHtml);
                    notes.initForm(_area,{pid:pid, content:notes.defaultContent});
                    //notes.init(pid);
                }
                notes.loadAll = false;
                notes.showScrollBar();
                getDialog(data.integral);
            }
		}, "json");
	});
	
	/**
	 * @问答所有js
	 * @“发布问答”
	 */
	//发布问答
	$(".ask-area .ask-save").live("click",function(){
		var _this = $(this);
		var _area = _this.closest(".ask-area");
		var frm=_this.closest("form");
		$("form").removeClass("onlive");
		frm.addClass("onlive");
		var content = $.trim(frm.find("textarea[name='content']").val());
		var id=frm.find("input[name='id']").val();
		var pid=frm.find("input[name='pid']").val();
		var img=frm.find("input[name='img']").val();
		var qndCon = frm.find("input[name='price']").val();
		if($("form.onlive").find("textarea[name='content']").hasClass("p-ask-area")){
			naTextarea = "有虾米疑问？让大家解答一下~（限500字）";

		}else{
			naTextarea = "有想法？快快来记录吧~（限500字）";
		}
		if(content=="" || content==naTextarea) {
			frm.find(".note-info").html("<span class='note-error'>内容不能为空</span>");
			return ;
		}else if(content.length>500) {
			frm.find(".note-info").html("<span class='note-error'>字数超限</span>");
			return ;
		}else{
			frm.find(".note-info").html("");
		}
		if(qndCon==""){
			frm.find(".note-info").html("<span class='note-error'>悬赏值不能为空</span>");
			frm.find("input[name='price']").focus();
			return ;
		}
		if(!qndCon.match(/^[0-9][0-9]*$/)){
			frm.find(".note-info").html("<span class='note-error'>悬赏值格式错误</span>");
			frm.find("input[name='price']").focus();
			return ;
		}
		frm.find("input[name='subject']").val(pc.video.subject);
		_this.html('稍后').addClass('note-saving').attr('disabled',true);
		$.post("/ask/post", frm.serialize(), function(data){
			if(data.code == 1){
				ask.loadMy = false;
				if(id){
					var item=_this.closest(".edit-show");
					item.next().remove();
					item.replaceWith(data.html);
				} else {
					var $scrollBox = $("#p-ask-scroll")
					if(data.html)$scrollBox.find(".my-ask-list .all-note").eq(0).prepend(data.html);
					if(data.allHtml)$scrollBox.find(".all-ask-list .all-note").eq(0).prepend(data.allHtml);
					ask.initForm(_area,{pid:pid, content:ask.defaultContent});
				}
				ask.loadAll = false;
				ask.showScrollBar();
				getDialog(data.integral);
			}else{
				frm.find(".note-info").html("<span class='note-error'>" + data.msg + "</span>");
				_this.html('提交').removeClass('note-saving').attr('disabled',false);
			}
		}, "json");
	});
	//"关注问题"悬浮出现
	$(".p-all-ask .all-note li").live({
		mouseenter:function(){
			$(this).siblings().find(".not-or-gz").hide();
			$(this).find(".not-or-gz").show();
		},
		mouseleave:function(){
			$(".p-all-ask .all-note li").find(".not-or-gz").hide();
		}
	});
	//关注问答
	$(".ask-gz").live('click',
		function(){
			var _this=$(this);
			$.post(
				"/ask/favorite",
				{question_id:$(this).attr('id'),status:1}, 
				function(json) { 
					if(json.code == 0){
	                	alert(json.msg);
	                }else{
	                	_this.removeClass("ask-gz").addClass("ask-ygz").text("已关注");
	                }
				},
				'json' 
			);
		}
	);
	
	//取消关注问答
	$(".ask-ygz").live('click',
		function(){
			var _this=$(this);
			$.post(
				"/ask/favorite",
				{question_id:$(this).attr('id'),status:0}, 
				function(json) { 
					if(json.code == 0){
	                	alert(json.msg);
	                }else{
	                	_this.removeClass("ask-ygz").addClass("ask-gz").text("关注");
	                }
				},
				'json' 
			);
		}
	);
	
	//播放页我的问答更多
	$(document).on('click',".ask-more-me a",
		function(){
			var page = $("#me_page").val();
			ask.onlyMe = true;
			ask.load(parseInt(page));
			$("#me_page").val(parseInt(page)+1);
		}
	);
	
	//播放页全部问答更多
	$(document).on('click',".ask-more-all a",
		function(){
			var page = $("#all_page").val();
			ask.onlyMe = false;
			ask.load(parseInt(page));
			$("#all_page").val(parseInt(page)+1);
		}
	);
	

	/**
	 * @ 课程详情页 js
	 *  “目录”、“评价”、“笔记”、“问答” 切换
	 *  
	 */

	 //“目录”、“评价”、“笔记”、“问答” 切换
	 /*
	 $(".tab-content").children().not(":first").hide();
	 $(".detail-note-tab a").noteTab({
		event:"click",
		tabClass:"detail-t-on"
	 });
	 */	
		
   /**详情页点击回复**/
	$(".list-hf").live("click",function(){
		$(".second-hf-main .list-hf-second").hide();
		$(".second-hf-box dl").each(function(){	
			if($(this).find("dt").size()==0){
				var parent = $(this).parent();
				parent.hide();
			}
		});
		if($(this).hasClass("agin-hf")) return;
		//$(".second-hf-main .list-hf-second").hide();
		var parent = $(this).closest(".ct-sec9").next();
		parent.find(".list-hf-second .comment-reply-q").hide();
		parent.find(".list-hf-second textarea[name='description']").attr("placeholder","说点什么吧");
		parent.find(".list-hf-second textarea[name='description']").val("");
		//parent.find(".list-hf-second .save-reply-comment").attr("data",$(this).attr("data"));
		parent.find(".list-hf-second .save-reply-comment").removeClass("edit-save");
		parent.find(".list-hf-second .comment-reply-q").hide();
		parent.find(".list-hf-second .save-reply-comment").attr("data",$(this).attr("data"));
		if(!parent.find(".second-hf-box").is(":visible")){
			parent.find(".second-hf-box").show();
		}
		parent.find(".list-hf-second").show();
		var top = parent.find(".list-hf-second").offset().top - 88;
		$("body,html").animate({scrollTop:top},600);
	});
	$(document).click(function(e){
		var target = $(e.target).closest(".second-hf-box");
		if(!target.get(0) && !$(e.target).is(".list-btm a")){
			$(".second-hf-main .list-hf-second").hide();
			$(".second-hf-box dl").each(function(){	
				if($(this).find("dt").size()==0){
					var parent = $(this).parent();
					parent.hide();
				}
			});
		}
	});
	$(".second-hf-box dt").live({
		mouseover:function(){
			$(this).find(".list-hf").show();
		},
		mouseout:function(){
			$(this).find(".list-hf").hide();
		}
	});

    //回复的回复
    $(".agin-hf").live("click",function(){
        var self = $(this);
        var dl = $(this).closest("dl");
        var dt = $(this).closest("dt");
		dl.next(".list-hf-second").show();
		var top = dl.next(".list-hf-second").offset().top - 88;
        var name = dt.find(".detail-name").text();
        dl.next(".list-hf-second").find("textarea").attr("placeholder", "回复 "+name).focus();
		dl.next(".list-hf-second").find("textarea").val("");
        dl.next(".list-hf-second").find(".save-reply-comment").removeClass("edit-save");
		dl.next(".list-hf-second").find(".comment-reply-q").hide();
		dl.next(".list-hf-second").find(".save-reply-comment").attr("data",$(this).attr("data"))
		$("body,html").animate({scrollTop:top},600);
    });

	$("textarea[name='description']").live("focus", function(){
		$(this).next().find(".error").html("");
	});
    //保存回复评论
    $(".save-reply-comment").live('click',function() {
		if($(this).hasClass("onClick") || $(this).hasClass("edit-save")) return;
        var self = $(this);
        self.addClass("onClick");
        var cid = self.attr("data");
		var obj =  self.closest(".second-hf-btm");
        var content = obj.prev().val();
		if(content=="" || $.trim(content)=='') {
			$(this).prev().html("内容不能为空");
			self.removeClass("onClick");
			return;
		}
		if(content.length>500) {
			$(this).prev().html("内容超限，不能大于500个字符");
			self.removeClass("onClick");
			return;
		}
        $.post('/comment/saveReply', {cid:cid,content:content}, function(data){
            if(data.code==1){
				if(bdqn.dialog) bdqn.dialog.close();
                self.attr("data",self.attr("index"));
				obj.prev().val('');
				obj.prev().attr("placeholder","说点什么吧");
                var index;
                if(obj.find(".pager").get(0)){
                    index = obj.find(".pager li.selected a").data("page");
                }else{
                    index = 1;
                }
                loadcomments(self.attr("index"),index);
				self.removeClass("onClick");
                
            }else if(data.code==-2){
                bdqn.login(data, function(result){
                    self.removeClass("onClick");
                    self.click();
                });
                bdqn.dialog.setOps({afterClose:function(){
                    self.removeClass("onClick");
                }});
            }else{
				self.prev().html(data.msg);
            }
        },'json');

    });

    //加载回复的回复
    $(".commentpage").live("click",function(){
        loadcomments($(this).data("id"), $(this).data("page"));
    });

    //推广
	$("#tuiguang").live('click', function(){
		if($(this).hasClass("white")){
			$("#player-comment,#loadingMask").hide();
		}
		comments.tuiguang();
	});

	//邀请好友‘复制’按钮
	/*$("#list-invite-copy").live("click",function(){
		var url = $("input.list-invite-input").val();
		copyToClipboard(url);	
	});
	//选中文本
	$("input.list-invite-input").live("click",function(){
		$(this).select();
	});*/

	//编辑
	$(".first-eidt").live("click",function(){
		$(".list-hf-second").hide();
		var parent = $(this).closest(".ct-sec9").next();
		if(parent.find("dl dt").size()==0){
			parent.find(".second-hf-box").show();
		}
		parent.find(".list-hf-second").show();
		var text = $(this).parent().prev();
		var html = text.children("p").text();
		parent.find("textarea[name='description']").attr("placeholder","说点什么吧");
		parent.find("textarea[name='description']").val(html);
		parent.find(".list-hf-second .comment-reply-q").show();
		parent.find(".list-hf-second .save-reply-comment").attr("data",$(this).data("id"));
		parent.find(".list-hf-second .save-reply-comment").addClass("edit-save");
		var top = parent.find(".list-hf-second").offset().top - 88;
		$("body,html").animate({scrollTop:top},600);
	});
	$(".wsq-edit-btn").live("click",function(){
		if($(this).hasClass("first-eidt")) return;
		$(".list-hf-second").hide();
		var parent = $(this).closest("dl").next();
		var html = $(this).parent().prev().text();
		parent.show();
		parent.find(".comment-reply-q").show();
		parent.find(".save-reply-comment").addClass("edit-save");
		parent.find(".save-reply-comment").attr("data",$(this).data("id"));
		parent.find("textarea[name='description']").attr("placeholder","说点什么吧");
		parent.find("textarea[name='description']").val(html);
		var top = parent.offset().top - 88;
		$("body,html").animate({scrollTop:top},600);
	});
	//取消
	$(".comment-reply-q").live("click",function(){
		var parent = $(this).closest(".second-hf-main").prev();
		var id = parent.find(".first-eidt").data("id");
		$(this).prev().attr("data",id).removeClass("edit-save");
		$(this).parent().prev().val("");
		$(this).parent().prev().attr("placeholder","说点什么吧");
		$(this).hide();
	});
	//编辑保存
	$(".edit-save").live("click",function(){
		if($(this).hasClass('note-saving')) return;
		var self = $(this);
		var obj =  self.closest(".second-hf-btm");
        var content = obj.prev().val();
		if(content=="") {
			$(this).prev().html("内容不能为空");
			self.removeClass("note-saving");
			return;
		}
		if(content.length>500) {
			$(this).prev().html("内容超限，不能大于500个字符");
			self.removeClass("note-saving");
			return;
		}
		var uid = $(this).attr("data");
		$(this).html('稍后').addClass('note-saving');
		$.post("/comment/editrepost",{id:uid,content:content},function(data){
			if(data.code == 1){
				var firstEdit = false;
				var dl = self.closest(".list-hf-second").prev();
				var parent = self.closest(".second-hf-main").prev();
				var id = parent.find(".first-eidt").data("id");
				dl.find("dt .wsq-edit-btn").each(function(){
					if($(this).data("id")==uid){
						$(this).parent().prev().html(content);
					}else{
						firstEdit = true;
					}
				});
				if(firstEdit){
					if(id==uid){
						parent.find(".list-detail-con p").html(content);
					}
				}
				self.attr("data",id).removeClass("edit-save");
				self.parent().prev().val("");
				self.next().hide();
				self.parent().prev().attr("placeholder","说点什么吧");
				self.html('保存').removeClass('note-saving');
			}else{
				self.prev().html((data.msg !== "undefind"?data.msg:"信息保存失败！"));
			}
		}, "json");
	});
	//编辑文本框
	$(".wsq-edit-main .edit-detail").live("focus",function(){
		$(this).next().find(".error").html("");
	});
	//关注
	$(".teach-no-focus").live("click",function(){
		var self = $(this);
		var tcid = self.attr('tid');
		$.post("/teacher/favorite",{'tcid':tcid},function(data){
			switch(data.code){
				case 1:
					if(bdqn.dialog)bdqn.dialog.close();
					var newDiv = $("<div style='color:red;font-weight:bold;font-size:0px;line-height:0px;position:absolute;right:20px;bottom:20px;'>+1</div>");
					self.append(newDiv);
					newDiv.animate({fontSize:"16px",bottom:"30px"}, 450, "linear", function(){
						newDiv.fadeOut(150,function(){
							self.addClass("teach-has-focus");
							self.removeClass("teach-no-focus");
							self.html("已关注("+data.num+")");
							//新收入任务首次关注老师完成领取奖励提示
							if(data.task ==1){
								setTimeout(function(){awardReceive.init(data.username);},1000);
							}
						});
					});
					break;
				case -2:
					bdqn.login(data,function(){
						self.click();
					});
					break;
				case -1:
					dialog1.open('<p>'+data.msg+'</p>', 3000);
					window.location.reload();
					break;
				default:
					dialog1.open('<p>'+data.msg+'</p>', 3000);
					break;
			}
		},"json");
	});
	var teaxhText;
	var sc_w;
	$(".teach-has-focus").live("mouseover",function(){
		teaxhText = $(this).text();
		$(this).text("取消关注");
	});
	$(".teach-has-focus").live("mouseout",function(){
		$(this).text(teaxhText);
	});
	//取消关注
	$(".teach-has-focus").live("click",function(){
		if($(this).hasClass("click")){
			return;
		}
		$(this).addClass("click");
		var self = $(this);
		var tcid = self.attr('tid');
		$.post("/teacher/CancelFavorite",{'tcid':tcid},function(data){
			switch(data.code){
				case 1:
					if(bdqn.dialog)bdqn.dialog.close();
					var newDiv = $("<div style='color:red;font-weight:bold;font-size:0px;line-height:0px;position:absolute;right:20px;bottom:20px;'>-1</div>");
					self.append(newDiv);
					newDiv.animate({fontSize:"16px",bottom:"30px"}, 450, "linear", function(){
						newDiv.fadeOut(150,function(){
							self.addClass("teach-no-focus");
							self.removeClass("click");
							self.removeClass("teach-has-focus");
							self.html("+ 关注("+data.num+")");
						});
					});
					break;
				default:
					self.removeClass("click");
					dialog1.open('<p>'+data.msg+'</p>', 3000);
					break;
			}
		},"json");
	});
	/**版块关注**/
	$(".collect-btn").live('click',function(){
		if($(this).hasClass('clicking')) return;
		var self = $(this);
		var id = $(this).attr("fid");
		$(this).addClass('clicking');
		$.post("/bbs/forum/favorite",{fid:id},function(data){
			switch(data.code){
				case 1:
					if(bdqn.dialog) bdqn.dialog.close();
					self.addClass("collect-btn-quit").text("已关注").removeClass("collect-btn");
					self.removeClass("clicking");
					break;
				case -2:
					bdqn.login(data, function(){
						self.removeClass("clicking");
						self.click();
					});
					bdqn.dialog.setOps({afterClose:function(){
						self.removeClass("clicking");
					}});
					break;
				case -1:
					if(bdqn.dialog) bdqn.dialog.close();
					self.addClass("collect-btn-quit").text("已关注").removeClass("collect-btn");
					self.removeClass("clicking");
					break;
				default:
					dialog1.open(data.msg, 3000);
					self.removeClass("clicking");
					break;
			}
		},'json');
		//$(this).addClass("collect-btn-quit").text("已关注").removeClass("collect-btn");
	});
	/**取消关注**/
	$(".collect-btn-quit").live('click',function(){
		if($(this).hasClass('oncollecting')) return;
		var self = $(this);
		var id = $(this).attr("fid");
		$(this).addClass('oncollecting');
		$.post('/bbs/forum/cancelFavorite', {fid:id,type:0}, function(data){
			if(data.code==1) {
				self.addClass("collect-btn").text("+ 关注").removeClass("collect-btn-quit");
				self.removeClass('oncollecting');
			}
		},'json');
		//$(this).addClass("collect-btn").text("关注").removeClass("collect-btn-quit");
	});
	/**取消关注悬浮**/
	$(".collect-btn-quit").live('mouseover',function(){
		$(this).text("取消关注");
	});
	$(".collect-btn-quit").live('mouseout',function(){
		$(this).text("已关注");
	});
});