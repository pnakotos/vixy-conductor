# Play Store Release Checklist

## Estado actual del build

- Application ID: `com.vixy.driver`
- Version name: `1.0.2`
- Version code: `3`
- Artefacto Play Store: `android/app/build/outputs/bundle/release/app-release.aab`
- Comando de release: `npm run android:release:play`
- Firma Android: externa al repo mediante `VIXY_ANDROID_KEYSTORE_PROPERTIES`
- JDK validado para release: `21`

## Configuracion de release ya corregida

- La app ya no sale con `debugMode` activado por defecto.
- La app ya no incluye una clave de interconexion hardcodeada en cliente.
- El backend por defecto de release ya no apunta a `127.0.0.1`.
- Las variables de entorno para cliente Vite quedaron normalizadas con prefijo `VITE_`.

## Variables recomendadas para la build final

Define estas variables antes de la build final si vas a publicar con backend real:

```bash
VITE_ADMIN_BASE_URL="https://vhixy.site"
VITE_INTERCONNECTION_KEY=""
VITE_DEBUG_MODE="false"
VITE_APP_NAME="Vixy Driver"
VITE_APP_SUBTITLE="Servicios y movilidad en Venezuela"
VITE_APP_LOGO_URL="/images/vixy-brand.svg"
```

## Permisos Android detectados en el codigo actual

- `android.permission.INTERNET`

No aparecen declarados en Android hoy:

- ubicacion precisa
- ubicacion en segundo plano
- camara
- microfono
- contactos
- SMS
- telefono
- almacenamiento multimedia
- notificaciones push

## Declaraciones Play Console sugeridas segun el codigo actual

### App access

- Si la cuenta del revisor necesita credenciales, prepara un usuario de prueba funcional.
- Si no existe backend real de autenticacion todavia, no marques flujos que dependan de login real.

### Ads

- Marca `No` si la app no muestra anuncios.

### Data safety

Segun el codigo actual, la app maneja o persiste estos datos de conductor:

- nombre completo
- telefono
- email
- cedula
- placa del vehiculo
- ciudad
- estado del conductor
- historial de transacciones
- historial de viajes

Tambien se sincronizan estos datos de viajes si el flujo se usa de forma real:

- nombre del pasajero
- direccion de origen
- direccion de destino
- metodo de pago
- monto del viaje

Declaracion conservadora recomendada en Play Console:

- Personal info: `Name`, `Email address`, `Phone number`
- Financial info: `Financial info` o `Purchase history` solo si las recargas y transacciones son reales en produccion
- App info and performance: `No`, salvo que agregues analytics o crash reporting
- Location: `No` para permisos/dispositivo hoy, pero revisa esto antes de publicar si luego conectas GPS real del conductor o rutas reales persistidas

### Data sharing

- Si Firebase y el backend administrativo reciben datos reales de conductor o viaje, marca que esos datos se comparten con proveedores/servicios externos segun tu arquitectura real.
- Si aun es un demo o simulador sin operacion real, no declares capacidades que el backend no usa todavia.

### Content rating

- Completa el cuestionario como app de movilidad/utilidad.

### Target audience

- Normalmente `18+` para una app de conductores, salvo que tu modelo legal indique otra cosa.

## Bloqueos o tareas pendientes fuera del build

- Necesitas una politica de privacidad publica. No hay un archivo o URL de politica de privacidad en este repo.
- Verifica en Play Console si realmente recolectas datos personales y financieros en produccion; esa declaracion debe coincidir exactamente con el backend real.
- Si vas a usar ubicacion real del conductor, debes agregar permisos Android, consentimiento claro y actualizar Data safety.
- Si vas a usar notificaciones push, debes integrar FCM real, agregar los archivos/configuracion faltantes y revisar el permiso de notificaciones segun la version objetivo.
- Si el login actual es solo local/demo, no lo presentes como autenticacion de produccion en la ficha de la tienda.

## Revision funcional antes de subir el AAB

- Instalar el APK release en un dispositivo fisico.
- Verificar apertura sin pantalla en blanco.
- Verificar login/registro del conductor.
- Verificar sincronizacion con Firebase.
- Verificar conectividad con backend administrativo real.
- Verificar cartera y recargas sin datos falsos visibles para usuario final.
- Verificar que no aparezcan banners o datos de debug.
- Verificar icono, nombre visible y branding final.

## Entrega a Play Store

1. Ejecuta `npm run android:release:play`.
2. Sube `android/app/build/outputs/bundle/release/app-release.aab` a la pista interna.
3. Completa `Data safety`, `App access`, `Content rating` y `Target audience`.
4. Agrega politica de privacidad y ficha de la tienda.
5. Prueba la pista interna antes de promocionar a produccion.

## Nota importante

El build ya es valido y firmado, pero Play Store puede rechazar la app si la ficha declara menos datos de los que realmente procesa tu backend.