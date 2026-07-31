/**
 * Responding · ETH — backend en Google Sheets
 *
 * CÓMO USAR:
 * 1. Crea un Google Sheet nuevo (sheets.new)
 * 2. Extensiones → Apps Script → borra lo que haya y pega TODO este código
 * 3. Guardar (💾) → Implementar → Nueva implementación
 * 4. Tipo: "Aplicación web" · Ejecutar como: "Yo" · Acceso: "Cualquier persona"
 * 5. Implementar → autorizar permisos → copiar la URL que termina en /exec
 * 6. Pegar esa URL en el dashboard (botón de sincronización, arriba a la derecha)
 */

var SHEET_NAME = "registros";

function doGet() { return handle({}); }

function doPost(e) {
  var d = {};
  try { d = JSON.parse(e.postData.contents || "{}"); } catch (err) {}
  return handle(d);
}

function handle(d) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sh = getSheet();

    // 1) borrar registros
    var dels = (d.deletes || []).map(String);
    if (dels.length) {
      var vals = sh.getDataRange().getValues();
      var rows = [];
      for (var i = 1; i < vals.length; i++) {
        if (dels.indexOf(String(vals[i][0])) !== -1) rows.push(i + 1);
      }
      rows.reverse().forEach(function (r) { sh.deleteRow(r); });
    }

    // 2) agregar registros (sin duplicar por id)
    var adds = d.adds || [];
    if (adds.length) {
      var vals2 = sh.getDataRange().getValues();
      var ids = {};
      for (var j = 1; j < vals2.length; j++) ids[String(vals2[j][0])] = true;
      adds.forEach(function (ev) {
        if (!ev || !ev.id || ids[String(ev.id)]) return;
        sh.appendRow([
          String(ev.id), Number(ev.ts), String(ev.who || ""), String(ev.tipo || ""),
          ev.cuenta ? String(ev.cuenta) : "", ev.red ? String(ev.red) : "",
          Number(ev.cantidad) || 0, new Date(Number(ev.ts)), ev.texto ? String(ev.texto) : ""
        ]);
        ids[String(ev.id)] = true;
      });
    }

    // 3) devolver todos los registros
    var out = [];
    var vals3 = sh.getDataRange().getValues();
    for (var k = 1; k < vals3.length; k++) {
      var r = vals3[k];
      if (!r[0]) continue;
      out.push({
        id: String(r[0]), ts: Number(r[1]), who: String(r[2]), tipo: String(r[3]),
        cuenta: r[4] ? String(r[4]) : "", red: r[5] ? String(r[5]) : "",
        cantidad: Number(r[6]), texto: r[8] ? String(r[8]) : ""
      });
    }
    return json({ ok: true, events: out });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["id", "ts", "quien", "tipo", "cuenta", "red", "cantidad", "fecha", "texto"]);
    sh.setFrozenRows(1);
  } else if (sh.getLastColumn() < 9) {
    /* sheet creado antes de agregar la columna "texto": la completamos sin mover nada más */
    sh.getRange(1, 9).setValue("texto");
  }
  return sh;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
