<?php
header('Content-type:text/html;charset=utf-8');
$page = $_GET['page'];
require dirname(__FILE__).'/simple_html_dom.php';
$html = file_get_html('http://news.baidu.com/');
$news = array();
$newsList = array();
foreach($html->find('.hotnews strong a') as $article) {
	$item['href']= $article->href;
	$item['title']   = trim($article->plaintext);
	$news[] = $item;
 }
 foreach($html->find('.ulist a') as $article) {
	 if($article->href){
		$item['href']= $article->href;
		$item['title']   = trim($article->plaintext);
		$news[] = $item;
	 }
 }
 
 for($x=0;($news[$x+10*($page-1)] != [])&&$x<10;$x++) {
  $newsList[$x] = $news[$x+10*($page-1)];
}
print_r(json_encode($newsList,true));
// print_r($newsList);
?>