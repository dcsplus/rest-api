<?php 

$secretKey = 'asdqqweqweasqweasgfsgqweqweasdeqwexasdqeqegaasd';

$uri = $_GET['url']; //already include time and application id

$postData = file_get_contents('php://input');

if (!empty($postData))
{
	parse_str($postData, $data);
	ksort($data);
    $hashData = $uri . '&' . http_build_query($data);
	$sha = sha1(urldecode($hashData) . $secretKey);
} 
else 
{
	$sha = sha1(urldecode($uri) . $secretKey);
}

// sleep(1);

exit($sha);