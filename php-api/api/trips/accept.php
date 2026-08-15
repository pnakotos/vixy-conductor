<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    vixy_json_error(405, 'method_not_allowed', 'Usa POST');
}

// La APP CONDUCTOR llama esto para tomar un viaje ofertado. Usa
// SELECT ... FOR UPDATE dentro de una transacción para que, si dos
// conductores intentan aceptar el mismo viaje "en simultáneo", solo el
// primero gane y el segundo reciba trip_already_taken.
$input = vixy_json_input();
$tripId = vixy_clean_string($input['tripId'] ?? '', 60);
$driverCedula = vixy_clean_string($input['driverCedula'] ?? '', 20);

if ($tripId === '' || $driverCedula === '') {
    vixy_json_error(422, 'validation_error', 'tripId y driverCedula son obligatorios');
}

$pdo = vixy_db();

$driverStmt = $pdo->prepare('SELECT id FROM vixy_drivers WHERE cedula = :cedula LIMIT 1');
$driverStmt->execute(['cedula' => $driverCedula]);
$driver = $driverStmt->fetch();

if (!$driver) {
    vixy_json_error(404, 'driver_not_found', 'Conductor no encontrado');
}

try {
    $pdo->beginTransaction();

    $lockStmt = $pdo->prepare('SELECT id, driver_id, status FROM vixy_trips WHERE id = :id FOR UPDATE');
    $lockStmt->execute(['id' => $tripId]);
    $trip = $lockStmt->fetch();

    if (!$trip) {
        $pdo->rollBack();
        vixy_json_error(404, 'trip_not_found', 'El viaje no existe');
    }

    if ($trip['status'] !== 'offered' || $trip['driver_id'] !== null) {
        $pdo->rollBack();
        vixy_json_error(409, 'trip_already_taken', 'El viaje ya fue tomado por otro conductor');
    }

    $updateStmt = $pdo->prepare(
        'UPDATE vixy_trips SET driver_id = :driver_id, status = "accepted", accepted_at = NOW() WHERE id = :id'
    );
    $updateStmt->execute(['driver_id' => $driver['id'], 'id' => $tripId]);

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    vixy_json_error(500, 'accept_failed', 'No se pudo asignar el viaje');
}

vixy_json_response([
    'ok' => true,
    'tripId' => $tripId,
    'status' => 'accepted',
]);
