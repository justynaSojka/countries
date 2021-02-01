<?php
    if ($_GET['question'] == 'countries') {
    	// create curl resource
        $ch = curl_init();

        // set url
        curl_setopt($ch, CURLOPT_URL, "https://restcountries.eu/rest/v2/all");

        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // $output contains the output string
        $output = curl_exec($ch);

        // close curl resource to free up system resources
        curl_close($ch);
        echo $output;

    }

    if ($_GET['question'] == 'wiki') {
        // create curl resource
        $ch = curl_init();

        // set url
        curl_setopt($ch, CURLOPT_URL, "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=1&explaintext=1&titles=" . $_GET['countryName']);

        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // $output contains the output string
        $output = curl_exec($ch);

        // close curl resource to free up system resources
        curl_close($ch);
        echo $output;

    }

    if ($_GET['question'] == 'emergency-numbers') {
        // create curl resource
        $ch = curl_init();

        // set url
        curl_setopt($ch, CURLOPT_URL, "http://emergencynumberapi.com/api/country/" . $_GET['code'] . "?fbclid=IwAR14OOa4Qwh3C3HyNwgJKxjki64UQEUK7h5xYM6lFY4WvD-Ow32Qw4fUJx0");

        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // $output contains the output string
        $output = curl_exec($ch);

        // close curl resource to free up system resources
        curl_close($ch);
        echo $output;

    }

    if ($_GET['question'] == 'holidays') {
            // create curl resource
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://public-holiday.p.rapidapi.com/" . date("Y") . "/" . $_GET['code'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "x-rapidapi-host: public-holiday.p.rapidapi.com",
                "x-rapidapi-key: 722cc82a9cmsh8fdd601323e6512p162336jsn52bbbeb52171"
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "cURL Error #:" . $err;
        } else {
            echo $response;
        }
    }

    if ($_GET['question'] == 'exchange') {
        	// create curl resource
        $ch = curl_init();

        // set url
        curl_setopt($ch, CURLOPT_URL, "https://openexchangerates.org/api/latest.json?app_id=dbf4bc35c49f4b3fb8698cc096a17bd7");

        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // $output contains the output string
        $output = curl_exec($ch);

        // close curl resource to free up system resources
        curl_close($ch);
        echo $output;

    }

    if ($_GET['question'] == 'weather') {
        // create curl resource
        $ch = curl_init();

        // set url
        curl_setopt($ch, CURLOPT_URL, "https://api.openweathermap.org/data/2.5/weather?q=" . $_GET['city'] . "&appid=5a11d0f2c7bc2739a7c2102f1864c92d&units=metric");

        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // $output contains the output string
        $output = curl_exec($ch);

        // close curl resource to free up system resources
        curl_close($ch);
        echo $output;
    }

    if ($_GET['question'] == 'weather_next_days') {
        // create curl resource
        $ch = curl_init();

        // set url
        curl_setopt($ch, CURLOPT_URL, "https://api.openweathermap.org/data/2.5/onecall?lat=" .  $_GET['lat'] . "&lon=" . $_GET['lon'] . 
                "&appid=5a11d0f2c7bc2739a7c2102f1864c92d&units=metric");

        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // $output contains the output string
        $output = curl_exec($ch);

        // close curl resource to free up system resources
        curl_close($ch);
        echo $output;
    }


    if ($_GET['question'] == 'covid-19') {
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://covid-19-data.p.rapidapi.com/country/code?code=" . $_GET['code'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "x-rapidapi-host: covid-19-data.p.rapidapi.com",
                "x-rapidapi-key: 722cc82a9cmsh8fdd601323e6512p162336jsn52bbbeb52171"
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "cURL Error #:" . $err;
        } else {
            echo $response;
        }
    }
