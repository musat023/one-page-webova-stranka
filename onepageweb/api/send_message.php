<?php
header('Content-Type: application/json');

// Sadece POST kabul et
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Geçersiz istek metodu.']);
    exit;
}

// Gerekli alanlar
foreach (['name', 'email', 'message'] as $f) {
    if (empty($_POST[$f])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Lütfen tüm alanları doldurun.']);
        exit;
    }
}

// Temizle
$name = htmlspecialchars(trim($_POST['name']));
$email = htmlspecialchars(trim($_POST['email']));
$message = htmlspecialchars(trim($_POST['message']));

// E-posta formatı kontrol
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Geçerli bir e-posta adresi girin.']);
    exit;
}

// Dosyaya yaz
$dir = __DIR__ . '/../messages';
$file = $dir . '/messages.txt';
if (!is_dir($dir)) mkdir($dir, 0755, true);

$line = date('Y-m-d H:i:s') . " | $name <$email>: $message\n";
file_put_contents($file, $line, FILE_APPEND | LOCK_EX);

echo json_encode(['success' => true, 'message' => 'Mesajınız kaydedildi.']);
?>