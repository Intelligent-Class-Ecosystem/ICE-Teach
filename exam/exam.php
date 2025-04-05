<?php
header('Content-Type: application/json');

// 输入验证
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['status' => 'error', 'message' => 'Method Not Allowed']));
}

if (!isset($_POST['time']) || !preg_match('/^\d{14}-\d{14}$/', $_POST['time'])) {
    http_response_code(400);
    exit(json_encode(['status' => 'error', 'message' => 'Invalid time format']));
}

// 文件配置
$storagePath = __DIR__.'/date/exam';
$filename = $storagePath.'/time.txt';

try {
    // 创建目录
    if (!file_exists($storagePath)) {
        if (!mkdir($storagePath, 0755, true)) {
            throw new Exception('无法创建存储目录');
        }
    }

    // 写入文件
    if (file_put_contents($filename, $_POST['time'].PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
        throw new Exception('文件写入失败');
    }

    echo json_encode(['status' => 'success']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>