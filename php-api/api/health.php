<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';

// Ping público (sin auth) usado por testAdminConnection() en el frontend.
vixy_json_response([
    'ok' => true,
    'service' => 'vhixy-central',
    'timestamp' => date('c'),
]);
