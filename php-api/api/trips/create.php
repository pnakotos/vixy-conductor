<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    vixy_json_error(405, 'method_not_allowed', 'Usa POST');
}

// Este endpoint lo consume la APP DE PASAJERO para publicar una solicitud de
// viaje que luego será tomada por la app conductor (ver trips/pending.php y
// trips/accept.php).
$input = vixy_json_input();

$serviceType = vixy_clean_string($input['serviceType'] ?? '', 20);
$serviceName = vixy_clean_string($input['serviceName'] ?? '', 120);
$passengerUid = vixy_clean_string($input['passengerUid'] ?? '', 60);
$passengerName = vixy_clean_string($input['passengerName'] ?? '', 150);
$pickup = $input['pickupLocation'] ?? [];
$dropoff = $input['dropoffLocation'] ?? [];
$fareUsd = (float) ($input['fareUsd'] ?? 0);
$fareVes = (float) ($input['fareVes'] ?? 0);

if (!in_array($serviceType, ['moto', 'taxi', 'delivery'], true)) {
    vixy_json_error(422, 'validation_error', 'serviceType debe ser moto, taxi o delivery');
}

if ($passengerUid === '' || $fareUsd <= 0) {
    vixy_json_error(422, 'validation_error', 'passengerUid y fareUsd (> 0) son obligatorios');
}

$pickupLat = isset($pickup['lat']) ? (float) $pickup['lat'] : null;
$pickupLng = isset($pickup['lng']) ? (float) $pickup['lng'] : null;
$dropoffLat = isset($dropoff['lat']) ? (float) $dropoff['lat'] : null;
$dropoffLng = isset($dropoff['lng']) ? (float) $dropoff['lng'] : null;

if ($pickupLat === null || $pickupLng === null || $dropoffLat === null || $dropoffLng === null) {
    vixy_json_error(422, 'validation_error', 'pickupLocation y dropoffLocation requieren lat/lng');
}

$pdo = vixy_db();

// Upsert liviano del pasajero (caché) para poder enlazar el viaje.
$passengerStmt = $pdo->prepare(
    'INSERT INTO vixy_passengers (passenger_uid, full_name)
     VALUES (:uid, :name)
     ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)'
);
$passengerStmt->execute(['uid' => $passengerUid, 'name' => $passengerName !== '' ? $passengerName : 'Pasajero Vixy']);

$passengerIdStmt = $pdo->prepare('SELECT id FROM vixy_passengers WHERE passenger_uid = :uid LIMIT 1');
$passengerIdStmt->execute(['uid' => $passengerUid]);
$passengerId = $passengerIdStmt->fetchColumn();

$tripId = 'trip-' . bin2hex(random_bytes(8));

$insertStmt = $pdo->prepare(
    'INSERT INTO vixy_trips (
        id, service_type, service_name, passenger_id, passenger_name_snapshot,
        pickup_address, pickup_city_area, pickup_lat, pickup_lng,
        dropoff_address, dropoff_city_area, dropoff_lat, dropoff_lng,
        fare_usd, fare_ves, status, created_by_app
    ) VALUES (
        :id, :service_type, :service_name, :passenger_id, :passenger_name,
        :pickup_address, :pickup_city_area, :pickup_lat, :pickup_lng,
        :dropoff_address, :dropoff_city_area, :dropoff_lat, :dropoff_lng,
        :fare_usd, :fare_ves, "offered", "passenger-app"
    )'
);

$insertStmt->execute([
    'id' => $tripId,
    'service_type' => $serviceType,
    'service_name' => $serviceName !== '' ? $serviceName : ucfirst($serviceType),
    'passenger_id' => $passengerId ?: null,
    'passenger_name' => $passengerName !== '' ? $passengerName : null,
    'pickup_address' => vixy_clean_string($pickup['address'] ?? '', 255),
    'pickup_city_area' => vixy_clean_string($pickup['cityArea'] ?? '', 120),
    'pickup_lat' => $pickupLat,
    'pickup_lng' => $pickupLng,
    'dropoff_address' => vixy_clean_string($dropoff['address'] ?? '', 255),
    'dropoff_city_area' => vixy_clean_string($dropoff['cityArea'] ?? '', 120),
    'dropoff_lat' => $dropoffLat,
    'dropoff_lng' => $dropoffLng,
    'fare_usd' => $fareUsd,
    'fare_ves' => $fareVes,
]);

vixy_json_response([
    'ok' => true,
    'tripId' => $tripId,
    'status' => 'offered',
]);
