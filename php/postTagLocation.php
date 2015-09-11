<?php
header("Access-Control-Allow-Origin: *");


	$time = date("Y-m-d H:i:s");    
    $lat = $_POST['tagLatitude'];
    $long = $_POST['tagLongitude'];
    $tag = $_POST['tagID'];
    $file = $tag."_location.txt";
    $stringToAppend = $lat.",".$long;
    file_put_contents($file, $stringToAppend);
 
?>

