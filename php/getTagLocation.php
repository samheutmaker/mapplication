<?php
header("Access-Control-Allow-Origin: *");

    $tag = $_POST['tagSearch'];
    $file = $tag."_location.txt";
    if(file_exists($file)) {
	 	$tagLocationText = file_get_contents($file); 
	 	echo $tagLocationText;
	 } else {
	 	echo '';
	 }


	
   
?>

