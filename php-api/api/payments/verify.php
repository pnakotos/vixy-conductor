<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    vixy_json_error(405, 'method_not_allowed', 'Usa POST');
}

$input = vixy_json_input();

$driverCedula = vixy_clean_string($input['cedula'] ?? '', 20);
$referenceNumber = vixy_clean_string($input['referenceNumber'] ?? '', 60);
$method = vixy_clean_string($input['method'] ?? 'system', 20);
$amountUsd = (float) ($input['amountUsd'] ?? 0);
$amountVes = (float) ($input['amountVes'] ?? 0);
$bcvRate = isset($input['bcvRate']) ? (float) $input['bcvRate'] : null;

if ($driverCedula === '' || $amountUsd <= 0) {
    vixy_json_error(422, 'validation_error', 'cedula y amountUsd (> 0) son obligatorios');
}

$pdo = vixy_db();

$driverStmt = $pdo->prepare('SELECT id FROM vixy_drivers WHERE cedula = :cedula LIMIT 1');
$driverStmt->execute(['cedula' => $driverCedula]);
$driver = $driverStmt->fetch();

if (!$driver) {
    vixy_json_error(404, 'driver_not_found', 'Conductor no encontrado');
}

$transactionId = 'txn-' . bin2hex(random_bytes(8));

$insertStmt = $pdo->prepare(
    'INSERT INTO vixy_wallet_transactions
        (id, driver_id, type, amount_usd, amount_ves, bcv_rate_used, method, reference_number, description, status)
     VALUES
        (:id, :driver_id, "recharge", :amount_usd, :amount_ves, :bcv_rate, :method, :reference_number, :description, "pending")'
);

$insertStmt->execute([
    'id' => $transactionId,
    'driver_id' => $driver['id'],
    'amount_usd' => $amountUsd,
    'amount_ves' => $amountVes,
    'bcv_rate' => $bcvRate,
    'method' => in_array($method, ['pago_movil', 'zinli', 'binance', 'paypal', 'system'], true) ? $method : 'system',
    'reference_number' => $referenceNumber !== '' ? $referenceNumber : null,
    'description' => 'Recarga de saldo reportada desde app conductor',
]);

$logStmt = $pdo->prepare(
    'INSERT INTO vixy_sync_logs (app_source, endpoint, action, status, details)
     VALUES ("driver-app", "/api/payments/verify.php", "Auditoría de recarga", "pending", :details)'
);
$logStmt->execute([
    'details' => "Comprobante {$referenceNumber} (\${$amountUsd} USD) recibido para conciliación",
]);

vixy_json_response([
    'ok' => true,
    'message' => 'Comprobante recibido, pendiente de conciliación bancaria',
    'transactionId' => $transactionId,
]);
