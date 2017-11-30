<template>
<div id="play-music">
	<div>歌曲名：{{name}}</div>
	<div>演唱者：{{songer}}</div>
	<div>所属专辑：{{alName}}</div>
	<audio v-bind:src="url" autoplay controls="controls">
		您的浏览器不支持 audio 标签。
	</audio>
</div>
</template>



<script>
export default {
  name: 'playmusic',
  data () {
    return {
		id: this.$route.params.id,
		url: '',
		name: this.$route.query.name,
		songer: this.$route.query.songer,
		alName: this.$route.query.alName
    }
  },
	created:function(){
		console.log(this.$route);
		this.url = playMusic(this.id);
		
	}
}
</script>