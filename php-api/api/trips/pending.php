<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/bootstrap.php';

vixy_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    vixy_json_error(405, 'method_not_allowed', 'Usa GET');
}

// La APP CONDUCTOR llama esto (polling cada pocos segundos) para ver viajes
// sin conductor asignado. Filtra opcionalmente por tipo de servicio y ciudad.
$serviceType = vixy_clean_string($_GET['serviceType'] ?? '', 20);
$cityArea = vixy_clean_string($_GET['cityArea'] ?? '', 120);

$pdo = vixy_db();

$sql = 'SELECT id, service_type, service_name, passenger_id, passenger_name_snapshot,
               pickup_address, pickup_city_area, pickup_lat, pickup_lng,
               dropoff_address, dropoff_city_area, dropoff_lat, dropoff_lng,
               fare_usd, fare_ves, created_at
        FROM vixy_trips
        WHERE status = "offered" AND driver_id IS NULL';
$params = [];

if (in_array($serviceType, ['moto', 'taxi', 'delivery'], true)) {
    $sql .= ' AND service_type = :service_type';
    $params['service_type'] = $serviceType;
}

if ($cityArea !== '') {
    $sql .= ' AND pickup_city_area = :city_area';
    $params['city_area'] = $cityArea;
}

$sql .= ' ORDER BY created_at ASC LIMIT 20';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

vixy_json_response([
    'ok' => true,
    'trips' => $stmt->fetchAll(),
]);
