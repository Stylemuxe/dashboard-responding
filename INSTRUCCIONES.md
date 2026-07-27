# Responding · ETH — Instrucciones

Dashboard para registrar el responding de Andrea (mensajes y comentarios por cuenta y red)
y el seguimiento de Contact Center (mensajes que llegaron al WhatsApp y citas agendadas).

## Conectar Google Sheets (para que Andrea y Fabian vean lo mismo)

Solo se hace **una vez**, toma 3 minutos:

1. Crea un Google Sheet nuevo: entra a **sheets.new**
2. En el Sheet: **Extensiones → Apps Script**
3. Borra el código de ejemplo y pega **todo** el contenido de `apps_script.gs`
4. Guarda (💾) y luego: **Implementar → Nueva implementación**
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**  ← importante
5. Clic en **Implementar**, autoriza los permisos y **copia la URL** que termina en `/exec`
6. Abre el dashboard, clic en la **pastilla de sincronización** (arriba a la derecha),
   pega la URL y presiona **Guardar y sincronizar**

Listo: cada registro se escribe en el Sheet automáticamente y todos los dispositivos
con esa URL ven los mismos datos (se actualiza cada minuto y al volver a la pestaña).

> Andrea debe hacer el paso 6 en su dispositivo con la **misma URL** (mándasela por WhatsApp).

## Estado de la sincronización (pastilla del encabezado)

- 🟢 **Sync HH:MM** — todo sincronizado
- 🟡 **N por enviar** — hay registros esperando conexión (se envían solos al volver el internet)
- 🔴 **Sin conexión** — no se pudo llegar al Sheet (los datos NO se pierden, quedan en cola)
- ⚪ **Solo local** — sin Google Sheets configurado; los datos viven solo en ese navegador

## Publicar en GitHub Pages

El dashboard es un solo `index.html` sin dependencias: basta subir esta carpeta a un
repositorio y activar **Settings → Pages → Deploy from branch (main, /)**.
La URL queda como `https://TU-USUARIO.github.io/dashboard-responding/` — esa es la que
se le comparte a Andrea.

## Respaldos

En la pestaña **Historial**:
- **Exportar CSV** — para abrir en Excel / Google Sheets manualmente
- **Respaldo JSON** — copia completa de los datos; se puede **importar** en otro
  dispositivo (combina sin duplicar)
