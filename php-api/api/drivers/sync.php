<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    vixy_json_error(405, 'method_not_allowed', 'Usa POST');
}

$input = vixy_json_input();

$cedula = vixy_clean_string($input['cedula'] ?? '', 20);
$fullName = vixy_clean_string($input['fullName'] ?? '', 150);
$phone = vixy_clean_string($input['phone'] ?? '', 30);
$email = vixy_clean_string($input['email'] ?? '', 150);
$plate = vixy_clean_string($input['plate'] ?? '', 20);
$city = vixy_clean_string($input['city'] ?? '', 100);
$online = !empty($input['online']);
$approved = array_key_exists('approved', $input) ? (bool) $input['approved'] : true;

if ($cedula === '' || $fullName === '') {
    vixy_json_error(422, 'validation_error', 'cedula y fullName son obligatorios');
}

$pdo = vixy_db();
$stmt = $pdo->prepare(
    'INSERT INTO vixy_drivers (cedula, full_name, phone, email, plate_number, city, is_active_online, is_approved, last_seen_at)
     VALUES (:cedula, :full_name, :phone, :email, :plate, :city, :online, :approved, NOW())
     ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        phone = VALUES(phone),
        email = VALUES(email),
        plate_number = VALUES(plate_number),
        city = VALUES(city),
        is_active_online = VALUES(is_active_online),
        is_approved = VALUES(is_approved),
        last_seen_at = NOW()'
);

$stmt->execute([
    'cedula' => $cedula,
    'full_name' => $fullName,
    'phone' => $phone,
    'email' => $email !== '' ? $email : null,
    'plate' => $plate !== '' ? $plate : null,
    'city' => $city !== '' ? $city : null,
    'online' => $online ? 1 : 0,
    'approved' => $approved ? 1 : 0,
]);

$logStmt = $pdo->prepare(
    'INSERT INTO vixy_sync_logs (app_source, endpoint, action, status, details)
     VALUES (:app_source, :endpoint, :action, :status, :details)'
);
$logStmt->execute([
    'app_source' => 'driver-app',
    'endpoint' => '/api/drivers/sync.php',
    'action' => 'Sincronización de perfil de conductor',
    'status' => 'success',
    'details' => "Conductor {$cedula} sincronizado (placa {$plate})",
]);

vixy_json_response([
    'ok' => true,
    'message' => 'Conductor sincronizado correctamente',
]);
