<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    vixy_json_error(405, 'method_not_allowed', 'Usa POST');
}

$input = vixy_json_input();

$tripId = vixy_clean_string($input['id'] ?? '', 60);
$fareUsd = (float) ($input['fareUsd'] ?? 0);
$commissionUsd = (float) ($input['commissionFeeUsd'] ?? 0);
$driverNetUsd = (float) ($input['driverNetEarningsUsd'] ?? max(0, $fareUsd - $commissionUsd));
$paymentMethod = vixy_clean_string($input['paymentMethod'] ?? '', 40);
$status = vixy_clean_string($input['status'] ?? 'completed', 30);

if ($tripId === '' || $fareUsd <= 0) {
    vixy_json_error(422, 'validation_error', 'id y fareUsd (> 0) son obligatorios');
}

$allowedStatuses = ['offered', 'accepted', 'en_camino_pasajero', 'en_punto_recogida', 'en_trayecto_destino', 'completed', 'cancelled'];
if (!in_array($status, $allowedStatuses, true)) {
    $status = 'completed';
}

$pdo = vixy_db();
$stmt = $pdo->prepare(
    'UPDATE vixy_trips
        SET fare_usd = :fare_usd,
            commission_fee_usd = :commission_usd,
            driver_net_earnings_usd = :driver_net_usd,
            payment_method = :payment_method,
            status = :status,
            completed_at = CASE WHEN :status2 = "completed" THEN NOW() ELSE completed_at END
     WHERE id = :id'
);

$stmt->execute([
    'fare_usd' => $fareUsd,
    'commission_usd' => $commissionUsd,
    'driver_net_usd' => $driverNetUsd,
    'payment_method' => $paymentMethod !== '' ? $paymentMethod : null,
    'status' => $status,
    'status2' => $status,
    'id' => $tripId,
]);

if ($stmt->rowCount() === 0) {
    vixy_json_error(404, 'trip_not_found', 'El viaje no existe (créalo primero desde la app pasajero)');
}

$logStmt = $pdo->prepare(
    'INSERT INTO vixy_sync_logs (app_source, endpoint, action, status, details)
     VALUES ("driver-app", "/api/trips/ledger.php", "Registro de comisión 10%", "success", :details)'
);
$logStmt->execute([
    'details' => "Viaje #{$tripId} (\${$fareUsd} USD) - comisión \${$commissionUsd} USD",
]);

vixy_json_response([
    'ok' => true,
    'message' => 'Comisión registrada en el libro contable central',
]);
