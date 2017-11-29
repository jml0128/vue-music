<?php

require dirname(__FILE__) . '/v2/MusicAPI.php';

$api = new MusicAPI();

// $keyword = '海阔天空';
// $song_id = 30089608;
// $album_id = 18896;
// $mv_id = 5341392;

$type = $_POST['type'];


if($type == 1){
	//返回搜索结果
	//传入参数（搜索内容，返回的条数，偏移量, 类型）
	$keyword = $_POST['keyword'];
	$num = $_POST['num'];
	$page = $_POST['page'];
	if(!$keyword){
		$keyword = '热门';
	}
	$result = $api->search($keyword,$num,$page);
	echo $result;
}else if($type == 2){
	//返回歌曲链接
	$song_id = $_POST['song_id'];
	$mp3url = $api->mp3url($song_id);
	print_r($mp3url);
}


//返回歌曲详情
// $detail = $api->detail($song_id);
// print_r($detail);

//返回歌曲链接
 // $mp3url = $api->mp3url($song_id);
 // print_r($mp3url);

//歌曲专辑（不可用）
// $albums = $api->albums($album_id, 30);
// print_r($albums);

//歌曲歌词
// $lyric = $api->lyric($song_id);
// print_r($lyric);

//歌曲MV (如果有)
// $mv = $api->mv($mv_id);
// print_r($mv);




