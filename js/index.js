var app = angular.module("myApp", ['ngRoute']); 




app.controller("weather", ['$scope','$http',function($scope,$http) {
	$scope.cityList = [
		{name:'重庆'},
		{name:'北京'},
		{name:'上海'},
		{name:'广州'},
		{name:'深圳'}
	];
	if(localStorage.city){
		$scope.weatherFlag = true;
		getWeather(localStorage.city)
	}else{
		$scope.weatherFlag = false;
	}
	//通过api接口调用天气，e为城市名称
	function getWeather(e){
		$http.get("http://wthrcdn.etouch.cn/weather_mini?city=" + e,{params:{act:'get'}})
		.success(function(json){
			$scope.weather = json.data.wendu;
			$scope.city = json.data.city;
		}).error(function(){
			console.log('温度获取失败，请稍后重试');
		});
	};
	//选择城市的弹出层，基于layer
	$scope.chooseCity = function(){
		layer.open({
		  type: 1,
		  title: '选择城市',
		  area: '7rem',
		  closeBtn:1,
		  shadeClose: true,
		  skin: 'layer-class',
		  content: $(".city-list")
		});
	};
	//选择城市获取天气
	$scope.subCity = function(e){
		$scope.weatherFlag = true;
		getWeather(e.item.name);
		localStorage.setItem('city',e.item.name);
		layer.closeAll(); 
	} 
}]);

app.controller("news", ['$scope','$http',function($scope,$http) {
	$scope.tpye = 'baidu';
	$scope.page  = 1;
	$scope.newsList = [];
	$scope.noMore = false;
	//首页分类
	$scope.navList = [
		{id:0,name:'头条',type:'baidu',className:'active'},
		{id:1,name:'娱乐',type:'ent',className:''},
		{id:2,name:'教育',type:'edu',className:''},
		{id:3,name:'科技',type:'tech',className:''},
		{id:4,name:'女人',type:'lady',className:''},
		{id:5,name:'旅游',type:'travel',className:''},
		{id:9,name:'股票',type:'gupiao',className:''},
		{id:6,name:'财经',type:'money',className:''},
		{id:7,name:'军事',type:'war',className:''},
		{id:8,name:'体育',type:'sport',className:''}
	];
	//选择不同的分类，获取不同的文章
	$scope.chooseNews = function(e){
		for(var i = 0;i < $scope.navList.length;i++){
			$scope.navList[i].className = '';
		}
		$scope.page  = 1;
		e.$parent.item.className = 'active';
		$scope.tpye = e.$parent.item.type;
		$scope.getArticle($scope.tpye,$scope.page);
		setTimeout(function(){
			return $scope.newsList;
		},1);
	}
	$scope.getArticle = function(e,v){
		//通过getBaiJia.php文件抓取百度百家号文章
		if(e == 'baidu'){
			$http.post('getBaiduHot/getBaiJia.php',{page:v})
			.success(function(json){
				if(v == 1){
					$scope.newsList = [];
				}
				var newsInfo = json.data.items;
				var flag = parseInt($scope.newsList.length);
				var newsLength = newsInfo.length;
				for(var i = flag;i < newsLength*v;i++){
					$scope.newsList[i] = {};
					$scope.newsList[i].title = newsInfo[i%newsLength].title;
					$scope.newsList[i].time = newsInfo[i%newsLength].updated_at;
					$scope.newsList[i].imgSrc = JSON.parse(newsInfo[i%newsLength].cover_images)[0].src;
				}
				if(json.length<9){
					$scope.noMore = false;
				}
			}).error(function(){
				console.log('文章获取失败，请稍后重试');
			});
		}
		// 通过网易接口获取新闻
		else{
			$http.get('http://wangyi.butterfly.mopaasapp.com/news/api?type='+e+'&page='+v+'&limit=10',{params:{act:'get'}})
			.success(function(json){
				if(v == 1){
					$scope.newsList = [];
				}
				var flag = parseInt($scope.newsList.length);
				for(var i = flag;i < json.list.length*v;i++){
					$scope.newsList[i] = {};
					$scope.newsList[i].id = json.list[i - 10 * (v-1)].id;
					$scope.newsList[i].title = json.list[i - 10 * (v-1)].title;
					$scope.newsList[i].imgSrc = json.list[i - 10 * (v-1)].imgurl;
					$scope.newsList[i].time = json.list[i - 10 * (v-1)].time;
				}
				if(json.length<9){
					$scope.noMore = false;
				}
			}).error(function(){
				console.log('文章获取失败，请稍后重试');
			});
		}
	}
	//当文章浏览到最底部，获取更多文章
	$scope.getMoreArticle = function(){
		var page = parseInt($scope.page);
		$scope.page  = $scope.page + 1;
		$scope.getArticle($scope.tpye,$scope.page);
	}
	//点击文章，阅读该文章详细内容
	$scope.readArticle = function(e){
		if(e.item.href){
			window.open(e.item.href,'_self');
		}else{
			window.open('newsContent.html?id=' + e.item.id + '&img=' + e.item.imgSrc,'_self');
		}
	}
	$scope.getArticle($scope.tpye,$scope.page);
	
	
	//文章滑动到底部时候，触发getMoreArticle函数，加载更多的新闻
	$(document).on("scrollstop",function(){
		var isBottom = document.body.scrollTop-document.getElementsByClassName('news')[0].scrollHeight;
		if(isBottom > -580){
			$scope.getMoreArticle();
		}
	});
}]);

//获取通过浏览器地址的传值
function getUrl(url){
	var Request = new Object();
	if(url.indexOf("?")!=-1)
	{
	var str = url.substr(1)　//去掉?号
	　　strs = str.split("&");
	for(var i=0;i<strs.length;i++)
	{
	 　 Request[strs[i ].split("=")[0]]=decodeURI(strs[ i].split("=")[1]);
	}
	}
	return Request;
}

//针对通过网易接口获取的文章id，查询该文章的详细内容
app.controller("newsCon", ['$scope','$http',function($scope,$http) {
	$scope.artcileId = getUrl(location.search).id;
	$scope.artcileImg = getUrl(location.search).img;
	$scope.artContent = '';
	$scope.artTitle = '';
	$scope.artOrigin = '';
	$scope.artTime = '';
	console.log($scope.artcileId);
	$http.get('http://wangyi.butterfly.mopaasapp.com/detail/api?simpleId=' + $scope.artcileId,{params:{act:'get'}})
    .success(function(json){
		console.log(typeof(json.content));
		$scope.artTitle = json.title;
		$scope.artTime = json.time;
		$('.art-content').html(json.content);
		$scope.artOrigin = json.from;
	}).error(function(){
		console.log('文章获取失败，请稍后重试');
	});
}]);

//轮播图控制器，基于swiper
app.controller("swiper", ['$scope',function($scope) {
    $scope.banner = [
		{url:'img/1.jpg',title:'我是轮播图1'},
		{url:'img/2.jpg',title:'我是轮播图2'}
	];
	//初始化banner图片
	setTimeout(function(){
		var mySwiper = new Swiper('.swiper-container', {
			autoplay: 5000,//可选选项，自动滑动
			loop:true,
			pagination : '.swiper-pagination',
			paginationType : 'custom',
			paginationCustomRender: function (swiper, current, total) {
				return current + '/' + total;
			},
			onSlideChangeEnd: function(swiper){
			//加入判断的原因为轮播图加入了loop属性
			zIndex = swiper.activeIndex - 1;
			if(zIndex>$scope.banner.length-1){
				zIndex = 0;
			}else if(zIndex<0){
				zIndex = $scope.banner.length-1;
			}
			$(".banner-title-name").text($scope.banner[zIndex].title);
			}
		})
	},1)
	
}]);

//页面底部导航
app.controller("footer", ['$scope',function($scope) {
    $scope.footerList = [
		{id:1,name:'首页',icon:'glyphicon-home',choose:'active',url:'index.html'},
		{id:2,name:'视频',icon:'glyphicon glyphicon-fire',choose:'',url:'hotVideo.html'},
		// {id:3,name:'植入',icon:'glyphicon glyphicon-edit',choose:'',url:'top.html'},
		{id:3,name:'我',icon:'glyphicon-user',choose:'',url:'me.html'}
	];
	$scope.changePage = function(e){
		window.open(e.item.url + '?pageId=' + e.item.id,'_self');
	}
	var pageId = getUrl(location.search).pageId
	if(pageId){
		for(var i = 0;i < $scope.footerList.length;i++){
			$scope.footerList[i].choose = '';
		}
		$scope.footerList[pageId - 1].choose = 'active';
	}else{
		
	}
}]);

//通过聚合平台的微信文章获取接口，获取热度较高的微信公众号文章
app.controller("hotArticle", ['$scope','$http',function($scope,$http) {
    $scope.hotArticle = [ ];
	if(!localStorage.hotArticle || timeOut('timeStart',1800)){
		$http.get('hotArticle.php',{params:{act:'get'}})
		.success(function(json){
			localStorage.setItem("hotArticle",JSON.stringify(json.result.list));
			for(var i = 0;i<eval(localStorage.hotArticle).length;i++){
				$scope.hotArticle[i] = eval(localStorage.hotArticle)[i];
			}
		}).error(function(){
			console.log('文章获取失败，请稍后重试');
		});
	}else{
		for(var i = 0;i<eval(localStorage.hotArticle).length;i++){
			$scope.hotArticle[i] = eval(localStorage.hotArticle)[i];
		}
	}
	
	$scope.read = function(e){
		window.open(e.item.url,'_self');
	}
}]);



//抓取百思不得姐的视频资源
app.controller("hotVideo", ['$scope','$http',function($scope,$http) {
	$scope.videoList = [];
	$http.post('getVideo/getVideo.php',{page:1})
	.success(function(json){
		console.log(json);
		for(var i = 0; i < json.length;i++){
			$scope.videoList[i] = {};
			$scope.videoList[i].title = json[i].title;
			$scope.videoList[i].src = json[i].src;
		}
	}).error(function(){
		console.log('文章获取失败，请稍后重试');
	});
	$scope.play = function(e){
		console.log(e.item.src);
		console.log(e.$index);
		var oVideo = document.createElement('embed');
		oVideo.setAttribute('src',e.item.src);
		oVideo.setAttribute('class','video-src');
		 document.getElementsByClassName('video-box')[e.$index].appendChild(oVideo);
		 document.getElementsByClassName('video-img')[e.$index].style.display = 'none';
		// console.log(e);
	};
}]);
//解决angularjs不能使用embed标签
app.directive('embedSrc', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var current = element;
      scope.$watch(function() { return attrs.embedSrc; }, function () {
        var clone = element
                      .clone()
                      .attr('src', attrs.embedSrc);
        current.replaceWith(clone);
        current = clone;
      });
    }
  };
});


//判断时间是否过期（超过一个小时）,过期为1，不过期为0
function timeOut(object,time){
	var nowTime=parseInt(new Date().getTime()/1000);
	var flag = 0;
	var oldTime = localStorage.getItem(object);
	if(oldTime){
		if(nowTime - oldTime > time){
			localStorage.setItem(object,parseInt(new Date().getTime()/1000));
			flag = 1;
			console.log(oldTime);
		}
	}else{
		localStorage.setItem(object,parseInt(new Date().getTime()/1000));
	}
	return flag;
}

//用户中心控制器
app.controller("user", ['$scope','$http',function($scope,$http) {
	$scope.con = localStorage.userCon;
	$scope.userName = localStorage.userName;
	if(localStorage.userOnline == undefined || timeOut('userStart',1800)){
		localStorage.setItem('userOnline','未登陆');
	}
	$scope.userOnline = localStorage.userOnline;
	$http.get("http://wthrcdn.etouch.cn/weather_mini?citykey=101040100",{params:{act:'get'}})
		.success(function(json){
			$scope.weather = json.data.wendu;
			$scope.city = json.data.city;
		}).error(function(){
			console.log('温度获取失败，请稍后重试');
		});
    $scope.login = function(){
		layer.open({
		  type: 1,
		  title: '登录',
		  area: '7rem',
		  closeBtn: 0,
		  shadeClose: true,
		  skin: 'layer-class',
		  content: $(".login-table")
		});
	};
	$scope.submitLogin = function(){
		$scope.sdata = {
			name:$('.name').val(),
			pwd:$('.password').val()
		};
		//console.log($scope.sdata);
		$.post('./data.php',$scope.sdata,function(d){
			if(d){
				$scope.userOnline = '已登陆';
				localStorage.userOnline = '已登陆';
				localStorage.setItem('userName',$scope.sdata.name);
				// window.open('./me.html','_self');
				location.reload();
			}else{
				layer.msg('账号或者密码错误', function(){
				//关闭后的操作
				});
			}
		})
	}
	$scope.userList = [
		{id:1,name:'我的消息',className:'glyphicon glyphicon-bullhorn',color:'#ff7f00',src:'myMsg'},
		{id:2,name:'我的收藏',className:'glyphicon glyphicon-star',color:'#f90b0b',src:'myLike'},
		{id:3,name:'历史足迹',className:'glyphicon glyphicon-time',color:'#00aaff',src:'history'},
		{id:4,name:'我要爆料',className:'glyphicon glyphicon-edit',color:'#1dc21e',src:'tipOff'},
		{id:5,name:'用户反馈',className:'glyphicon glyphicon-send',color:'#0046fe',src:'suggest'}
	];
	$scope.chooseMenu = function(e){
		$scope.con = e.item.name;
		localStorage.setItem('userCon',e.item.name);
	};
	$scope.backMe = function(){
		console.log('cs');
	};
	
}]);
//通过angularjs的路由功能实现个人中心的菜单选项
app.config(['$routeProvider', function($routeProvider){
		$routeProvider
		.when('/myMsg',{templateUrl:'./userCon.html'})
		.when('/myLike',{templateUrl:'./userCon.html'})
		.when('/history',{templateUrl:'./userCon.html'})
		.when('/tipOff',{templateUrl:'./userCon.html'})
		.when('/suggest',{templateUrl:'./userCon.html'})
		.otherwise({redirectTo:'/'});
	}]);


	
	
app.controller("cs", ['$scope','$http',function($scope,$http) {
	$scope.submitcs = function(){
$scope.sdata = {
			mobile:$('.csphone').val(),
			jifen:$('.csnum').val()
		};
		//console.log($scope.sdata);
		$.post('./cs.php',$scope.sdata,function(d){
			console.log(d);
	})}
}]);













