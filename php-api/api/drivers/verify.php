<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    vixy_json_error(405, 'method_not_allowed', 'Usa POST');
}

$input = vixy_json_input();
$cedula = vixy_clean_string($input['cedula'] ?? '', 20);
$licenseNumber = vixy_clean_string($input['licenseNumber'] ?? '', 60);

if ($cedula === '') {
    vixy_json_error(422, 'validation_error', 'cedula es obligatoria');
}

$pdo = vixy_db();
$stmt = $pdo->prepare('SELECT id, is_approved, is_verified_by_vixy FROM vixy_drivers WHERE cedula = :cedula LIMIT 1');
$stmt->execute(['cedula' => $cedula]);
$driver = $stmt->fetch();

if (!$driver) {
    vixy_json_response([
        'ok' => true,
        'verified' => false,
        'approved' => false,
        'message' => 'Conductor no encontrado en vhixy.site',
    ]);
}

if ($licenseNumber !== '') {
    $docStmt = $pdo->prepare(
        "SELECT status FROM vixy_driver_documents
         WHERE driver_id = :driver_id AND document_number = :license_number
         ORDER BY updated_at DESC LIMIT 1"
    );
    $docStmt->execute(['driver_id' => $driver['id'], 'license_number' => $licenseNumber]);
    $doc = $docStmt->fetch();
    $licenseStatus = $doc['status'] ?? 'missing';
} else {
    $licenseStatus = null;
}

vixy_json_response([
    'ok' => true,
    'verified' => (bool) $driver['is_verified_by_vixy'],
    'approved' => (bool) $driver['is_approved'],
    'licenseStatus' => $licenseStatus,
]);
