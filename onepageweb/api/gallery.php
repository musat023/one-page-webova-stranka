<?php
header('Content-Type: application/json');
// Galeri genellikle dilden bağımsızdır, ancak dil mantığını koruyalım.
$allowed_langs = ['cs', 'tr', 'en'];
$lang = $_GET['lang'] ?? 'cs'; 
$lang = strtolower($lang);

if (!in_array($lang, $allowed_langs)) {
    $lang = 'cs';
}

// NOT: Klasörünüzde sadece gallery.json var. Diğerlerini araması için:
$lang_suffix = $lang === 'cs' ? '' : "_" . ucfirst($lang); 
$filepath = "../data/gallery{$lang_suffix}.json"; 

$data = @file_get_contents($filepath);

// Dil uzantılı dosya yoksa, sadece gallery.json'ı yükle.
if ($data === false || empty($data)) {
    $default_filepath = "../data/gallery.json"; 
    $data = @file_get_contents($default_filepath);

    if ($data === false) {
        http_response_code(404);
        echo json_encode(["error" => "Gallery data not found.", "file_attempted" => $filepath]);
        exit();
    }
}

echo $data;
?>