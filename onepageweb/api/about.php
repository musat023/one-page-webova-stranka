<?php
header('Content-Type: application/json');
$allowed_langs = ['cs', 'tr', 'en'];
$lang = $_GET['lang'] ?? 'cs'; 
$lang = strtolower($lang);

if (!in_array($lang, $allowed_langs)) {
    $lang = 'cs';
}

$lang_suffix = $lang === 'cs' ? '' : "_" . ucfirst($lang); 
$filepath = "../data/about{$lang_suffix}.json"; 

$data = @file_get_contents($filepath);

if ($data === false) {
    $default_filepath = "../data/about.json"; 
    $data = @file_get_contents($default_filepath);

    if ($data === false) {
        http_response_code(404);
        echo json_encode(["error" => "About data not found for any language.", "file_attempted" => $filepath]);
        exit();
    }
}

echo $data;
?>