<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method === 'POST') {
    // Cualquiera de las apps encola un comando dirigido a otra (appId destino).
    $input = vixy_json_input();
    $appId = vixy_clean_string($input['appId'] ?? '', 60);
    $command = vixy_clean_string($input['command'] ?? '', 80);
    $payload = $input['payload'] ?? [];

    if ($appId === '' || $command === '') {
        vixy_json_error(422, 'validation_error', 'appId y command son obligatorios');
    }

    $commandId = 'cmd-' . bin2hex(random_bytes(8));

    $pdo = vixy_db();
    $stmt = $pdo->prepare(
        'INSERT INTO vixy_commands_queue (id, app_id, command, payload, status)
         VALUES (:id, :app_id, :command, :payload, "pending")'
    );
    $stmt->execute([
        'id' => $commandId,
        'app_id' => $appId,
        'command' => $command,
        'payload' => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ]);

    vixy_json_response(['ok' => true, 'message' => 'command queued', 'commandId' => $commandId, 'appId' => $appId]);
}

if ($method === 'GET') {
    // Cada app hace polling de sus comandos pendientes (por ejemplo, "driver-app").
    $appId = vixy_clean_string($_GET['appId'] ?? '', 60);
    if ($appId === '') {
        vixy_json_error(422, 'validation_error', 'appId es obligatorio');
    }

    $pdo = vixy_db();

    $pdo->beginTransaction();
    $stmt = $pdo->prepare(
        'SELECT id, command, payload, created_at FROM vixy_commands_queue
         WHERE app_id = :app_id AND status = "pending"
         ORDER BY created_at ASC LIMIT 1 FOR UPDATE'
    );
    $stmt->execute(['app_id' => $appId]);
    $command = $stmt->fetch();

    if ($command) {
        $updateStmt = $pdo->prepare('UPDATE vixy_commands_queue SET status = "delivered", delivered_at = NOW() WHERE id = :id');
        $updateStmt->execute(['id' => $command['id']]);
        $command['payload'] = json_decode($command['payload'] ?? '{}', true);
    }
    $pdo->commit();

    vixy_json_response(['ok' => true, 'commands' => $command ? [$command] : []]);
}

vixy_json_error(405, 'method_not_allowed', 'Usa GET o POST');
