<template>
<div id="music-list">
		<input name="keywords" v-model="name" placeholder="请输入歌曲名">
		<button type="submit" v-on:click="search(name,num,0)"></button>
		<!-- <div>{{musicList}}</div> -->
	<ul>
		<li v-for="item in musicList" v-bind:data-id="item.id" style="height:20px;display:flex;" v-on:click="play(item.name,item.id)">
			<router-link :to="{path: '/3/'+item.id, query:{ name: item.name,songer:item.ar[0].name,alName:item.al.name}}" style="height:20px;display:flex;">
			<!-- <img v-bind:src="item.artists[0].img1v1Url"> -->
			<p>歌曲名：{{item.name}}</p>
			<p>演唱者：{{item.ar[0].name}}</p>
			<p>专辑名：{{item.al.name}}</p>
			</router-link>
		</li>
	</ul>
	{{page}}/{{max}}
	<div>
		<div v-on:click="prev(name,num,page-num)">上一页</div>
		<div v-on:click="next(name,num,page+num)">下一页</div>
	</div>
</div>
</template>



<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
		name: '',   //歌曲名称
		num: 23,    //每次获取歌曲数量
		page:0,     //页码（根据偏移量设置）
		max: 0,     //本次搜索所有结果的数量
		musicList : [], //歌曲列表
		cacheMusic: [''],   //用于存储获取的数据
		playList: []   //播放列表歌曲地址
    }
  },
  methods:{
	search: function(name,num,page){
		this.page = page;
		var music = getMusic(this.name,this.num,this.page)
		this.musicList = music.songs;
		this.max = music.songCount;
	},

	prev: function(name,num,page){
		var yema = this.page / this.num - 1;
		if(this.page <= 0){
			this.page = 0;
			return false;
		}
		this.cacheFn(yema,name,num,page);
		this.page -= this.num;
	},

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
  created: function(name,num,page){
	var music = getMusic(this.name,this.num,this.page);
	this.cacheMusic[0] = music.songs;
	this.musicList = music.songs;
	this.max = music.songCount;
  }
}
</script>