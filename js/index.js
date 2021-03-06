//获取歌曲，并将获取的数据返回(公用函数)
	function getMusic(name,count,page){
		var a = null;
		$.ajax({
		async:false,
		type:"POST",
		cache: true,
		data:{'keyword':name,'num':count,'page':page,'type':1},
		url:'api/',
		success: function(data){
			if(data){
				data = eval("("+data+")");
				a = data.result;
			}else{
				a = null;
			}
		}
		})
		return a;
	  }
	  
	  //获取歌曲播放地址
	  function playMusic(id){
		var a = null;
		$.ajax({
		async:false,
		type:"POST",
		cache: true,
		data:{'song_id':id,'type':2},
		url:'api/',
		success: function(data){
			if(data){
				data = eval("("+data+")");
				a = data.data[0].url;
			}else{
				a = null;
			}
		}
		})
		return a;
	  }
	  
	
	
	var app = new Vue({
	  el: '#app',
	  data: {
		name: '',   //歌曲名称
		num: 23,    //每次获取歌曲数量
		page:0,     //页码（根据偏移量设置）
		max: 0,     //本次搜索所有结果的数量
		musicList : [], //歌曲列表
		cacheMusic: [''],   //用于存储获取的数据
		playList: []   //播放列表歌曲地址
	  },
	  methods: {
		<!-- 搜索歌曲 -->
		search: function(name,num,page){
			this.page = page;
			var music = getMusic(this.name,this.num,this.page)
			this.musicList = music.songs;
			this.max = music.songCount;
		},
		<!-- 上一页 -->
		prev: function(name,num,page){
			var yema = this.page / this.num - 1;
			if(this.page <= 0){
				this.page = 0;
				return false;
			}
			this.cacheFn(yema,name,num,page);
			this.page -= this.num;
		},
		<!-- 下一页 -->
		next: function(name,num,page){
			var yema = this.page / this.num + 1;
			if((this.page + this.num) >= this.max){
				return false;
			}else{
				this.page += this.num;
			}
			this.cacheFn(yema,name,num,page);
		},
		play: function(name,id){
			var a = [name,playMusic(id)];
			this.playList.push(a);
			console.log(this.playList);
		},
		<!-- 将获取的数据缓存在数组里 -->
		cacheFn: function(i,name,num,page){
			//如果有缓存，则调用缓存，不通过接口获取数据
			if(!this.cacheMusic[i]){
				this.musicList = getMusic(name,num,page).songs;
				this.cacheMusic[i] = this.musicList;
			}else{
				this.musicList = this.cacheMusic[i];
			}
		}
	  },
	  <!-- 初始化 -->
	  created: function(name,num,page){
		var music = getMusic(this.name,this.num,this.page);
		this.cacheMusic[0] = music.songs;
		this.musicList = music.songs;
		this.max = music.songCount;
	  }
	})
	
	
	var app1 = new Vue({
		el: '#app1',
		data: {
			list:app.playList,
			index: '',
			url: '',
			status: $('audio')[0].ended
		},
		methods: {
			ended: function(){
				var timer = setInterval(function(){
					app1.index = app1.list.length;
					if(app1.list.length){
						app1.url = app1.list[app1.index-1][1];
					}
					if($('audio')[0].ended){
						app1.status = $('audio')[0].ended;
						
					}
				},10)
			}
		},
		created: function(){
			//监听歌曲是否结束
			this.ended()
		}
	})