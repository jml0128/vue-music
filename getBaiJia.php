<?php
$postData = file_get_contents('php://input', true);
$obj=json_decode($postData) -> page;
function getUrlContent($url){
// 初始化一个curl会话
$ch = curl_init();
curl_setopt( $ch, CURLOPT_URL, $url);
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt( $ch, CURLOPT_REFERER, 'http://www.baidu.com');
curl_setopt( $ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 GTB5' );
curl_setopt( $ch, CURLOPT_POST, 0); //设置为POST方式
curl_setopt( $ch, CURLOPT_POSTFIELDS, array()); //数据传输
curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1 ); //解决重定向问题
curl_setopt( $ch, CURLOPT_COOKIE, 'redirectLogin=3;t=1766da7fa03df9fdb66af1ebaa160ecc;');
// 执行一个curl会话
$contents = curl_exec($ch);
// 返回一个保护当前会话最近一次错误的字符串
$error = curl_error($ch);
if($error){
echo 'Error: '.$error;
}
// 关闭一个curl会话
curl_close( $ch );
return $contents;
}
$page = $obj * 10;
$url='http://localhost:3000/search?keywords=海阔天空';
$result=getUrlContent($url);
if($result){
	print_r($result);
}else{
    echo "请求失败";
}
?>