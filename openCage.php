<?php
    // create curl resource
    $ch = curl_init();

    // set url
    curl_setopt($ch, CURLOPT_URL, "https://api.opencagedata.com/geocode/v1/json?q=" . $_GET['lat'] . "+" . $_GET['lng'] . "&key=48240f58e8e845d7a42548ec188f4109");

    //return the transfer as a string
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    // $output contains the output string
    $output = curl_exec($ch);

    // close curl resource to free up system resources
    curl_close($ch);
    echo $output;
?>