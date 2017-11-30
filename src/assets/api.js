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