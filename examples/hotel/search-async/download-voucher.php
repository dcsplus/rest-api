<?php

$appid = 'application1_test';
$secretKey = 'asdqqweqweasqweasgfsgqweqweasdeqwexasdqeqegaasd';

$orderid = 781;
$serviceid = 759;

$timestamp = time();

// here you must use the token you've generated through your workflow
$token = gettoken($appid, $secretKey, $timestamp);

$endpoint = 'https://trippublic.dcsplus.net/dynapack/clients/bitusi/public/index.php/orders/'.$orderid.'/services/'.$serviceid.'/documents?action=download&applicationId='.$appid.'&timestamp='.$timestamp;
$sha = sha1(urldecode($endpoint) . $secretKey);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $endpoint);
curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
// curl_setopt($ch, CURLOPT_POST, TRUE); /* to be used if post method required */
// curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method); /* to be used if other method are required instead of post or get/ ex: patch, delete */
curl_setopt($ch, CURLOPT_ENCODING, '');
$headers = array(
	"Content-Type: application/x-www-form-urlencoded",
	'Connection: Keep-Alive',
	'x-hash:'. $sha,
    'Authorization:' .$token
);

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$res = curl_exec($ch);
curl_close($ch);

/*
	if you get {"Status":403,"Message":"You are not allowed to access order with id 781"} means you are not using the right token 
	INFO there are some security restrictions so the voucher can be only downloaded:
		- by the user who owns the order (user is identified by token) 
		- or with the same token used to create order
*/
echo $res;

exit();


function gettoken($appid ,$secretKey, $timestamp)
{
	$endpoint = 'https://trippublic.dcsplus.net/dynapack/clients/bitusi/public/index.php/en/authentication/token/generate?applicationId='.$appid.'&timestamp='.$timestamp;

	$sha = sha1(urldecode($endpoint) . $secretKey);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $endpoint);
	curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_ENCODING, '');
	$headers = array(
		'x-hash:'. $sha,
	);

	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	$res = curl_exec($ch);
	curl_close($ch);

	$obj = json_decode($res,true);

	return $obj['Object']['Value'];
}


