<?php
header("Access-Control-Allow-Origin: *");
	
    $tag = $_POST['deleteTag'];
    $file = $tag."_location.txt";
    unlink($file);
 
?>