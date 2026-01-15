<?php
// Tarayıcıya JSON verisi gönderildiğini belirtir
header('Content-Type: application/json');

// Güvenli dil listesi
$allowed_langs = ['cs', 'tr', 'en'];

// URL'den dil parametresini al, yoksa 'cs' (Çekçe) kullan
$lang = $_GET['lang'] ?? 'cs'; 
$lang = strtolower($lang); // Küçük harfe çevir

// İzin verilmeyen bir dil gelirse varsayılana düşür
if (!in_array($lang, $allowed_langs)) {
    $lang = 'cs';
}

// Dosya adı uzantısını belirle (cs için boş, diğerleri için _Tr veya _En)
// Projenizdeki dosya isimlendirmesi (örn: menu_Tr.json) büyük harf içerdiği için bu şekilde ayarlandı.
$lang_suffix = $lang === 'cs' ? '' : "_" . ucfirst($lang); 

// Dosya yolu. (PHP betiği `api` klasöründe, JSON dosyaları `data` klasöründe olduğu için `../data` kullanılır)
$filepath = "../data/menu{$lang_suffix}.json";

// Dosya içeriğini okumaya çalış
$data = @file_get_contents($filepath);

if ($data === false) {
    // İstenen dil dosyası (örn: menu_Tr.json) bulunamazsa, Çekçe'yi (varsayılan) dene
    $default_filepath = "../data/menu.json";
    $data = @file_get_contents($default_filepath);

    if ($data === false) {
        // Varsayılan dosya da bulunamazsa, hata döndür
        http_response_code(404); // 404 Not Found HTTP kodu gönder
        echo json_encode(["error" => "Menu data not found for any language.", "file_attempted" => $filepath]);
        exit();
    }
}

// JSON verisini çıktı olarak gönder
echo $data;
?>