<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method === 'GET') {
    // Ambas apps (pasajero y conductor) hacen polling aquí para ver el
    // estado actual del viaje en tiempo casi real.
    $tripId = vixy_clean_string($_GET['id'] ?? '', 60);
    if ($tripId === '') {
        vixy_json_error(422, 'validation_error', 'id es obligatorio');
    }

    $pdo = vixy_db();
    $stmt = $pdo->prepare(
        'SELECT t.*, d.full_name AS driver_name, d.phone AS driver_phone, d.plate_number AS driver_plate
         FROM vixy_trips t
         LEFT JOIN vixy_drivers d ON d.id = t.driver_id
         WHERE t.id = :id LIMIT 1'
    );
    $stmt->execute(['id' => $tripId]);
    $trip = $stmt->fetch();

    if (!$trip) {
        vixy_json_error(404, 'trip_not_found', 'El viaje no existe');
    }

    vixy_json_response(['ok' => true, 'trip' => $trip]);
}

if ($method === 'POST') {
    // La app conductor reporta transiciones de estado del viaje en curso.
    $input = vixy_json_input();
    $tripId = vixy_clean_string($input['tripId'] ?? '', 60);
    $status = vixy_clean_string($input['status'] ?? '', 30);
    $cancelReason = vixy_clean_string($input['cancelReason'] ?? '', 255);

    $allowedStatuses = ['en_camino_pasajero', 'en_punto_recogida', 'en_trayecto_destino', 'completed', 'cancelled'];
    if ($tripId === '' || !in_array($status, $allowedStatuses, true)) {
        vixy_json_error(422, 'validation_error', 'tripId y status válidos son obligatorios');
    }

    $pdo = vixy_db();
    $stmt = $pdo->prepare(
        'UPDATE vixy_trips
            SET status = :status,
                cancel_reason = :cancel_reason,
                completed_at = CASE WHEN :status2 = "completed" THEN NOW() ELSE completed_at END
         WHERE id = :id'
    );
    $stmt->execute([
        'status' => $status,
        'cancel_reason' => $status === 'cancelled' && $cancelReason !== '' ? $cancelReason : null,
        'status2' => $status,
        'id' => $tripId,
    ]);

    if ($stmt->rowCount() === 0) {
        vixy_json_error(404, 'trip_not_found', 'El viaje no existe');
    }

    vixy_json_response(['ok' => true, 'tripId' => $tripId, 'status' => $status]);
}

vixy_json_error(405, 'method_not_allowed', 'Usa GET o POST');
