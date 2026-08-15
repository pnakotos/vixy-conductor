<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    vixy_json_error(405, 'method_not_allowed', 'Usa GET');
}

$pdo = vixy_db();
$stmt = $pdo->query("SELECT config_key, config_value FROM vixy_system_config");
$rows = $stmt->fetchAll();

$config = [];
foreach ($rows as $row) {
    $config[$row['config_key']] = $row['config_value'];
}

vixy_json_response([
    'ok' => true,
    'config' => $config,
]);
