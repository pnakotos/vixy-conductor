<?php
declare(strict_types=1);

/**
 * Valida el header Authorization: Bearer <VIXY_INTERCONNECTION_KEY>
 * y, si viene, el checksum X-Security-Checksum generado por
 * `buildSecureHeaders()` en el frontend (src/utils/security.ts):
 *   base64("<timestampMs>:<últimos 6 caracteres de la clave>")
 * Se corta la petición con vixy_json_error() si algo no coincide.
 */
function vixy_require_auth(): void
{
    $configuredKey = getenv('VIXY_INTERCONNECTION_KEY') ?: '';

    if ($configuredKey === '') {
        vixy_json_error(500, 'server_misconfigured', 'VIXY_INTERCONNECTION_KEY no está configurada en el servidor');
    }

    $headers = function_exists('getallheaders') ? (getallheaders() ?: []) : [];
    $headers = array_change_key_case($headers, CASE_LOWER);

    $authHeader = $headers['authorization'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches) || !hash_equals($configuredKey, trim($matches[1]))) {
        vixy_json_error(401, 'unauthorized', 'Clave de interconexión inválida o ausente');
    }

    $checksum = $headers['x-security-checksum'] ?? '';
    if ($checksum === '') {
        return;
    }

    $decoded = base64_decode($checksum, true);
    if ($decoded === false || !str_contains($decoded, ':')) {
        vixy_json_error(401, 'unauthorized', 'Checksum de seguridad inválido');
    }

    [$timestampMs, $tokenTail] = explode(':', $decoded, 2);
    $ageMs = (int) round(microtime(true) * 1000) - (int) $timestampMs;

    if ($ageMs < 0 || $ageMs > 5 * 60 * 1000) {
        vixy_json_error(401, 'unauthorized', 'Checksum de seguridad expirado');
    }

    if (!hash_equals(substr($configuredKey, -6), $tokenTail)) {
        vixy_json_error(401, 'unauthorized', 'Checksum de seguridad no coincide con la clave');
    }
}

function vixy_json_error(int $status, string $errorCode, string $message): void
{
    vixy_json_response(['ok' => false, 'error' => $errorCode, 'message' => $message], $status);
}
