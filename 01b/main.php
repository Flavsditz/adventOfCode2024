<?php
$myFile = fopen("tinput.txt", "r") or die("Unable to open file");

$x = fread($myFile, filesize("tinput.txt"));

$x = preg_split("/[^\d]+/", $x);

foreach ($x as &$y) {
	echo $y, " this \n ";
}

fclose($myFile);
