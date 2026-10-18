const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');

async function initDB() {
  const SQL = await initSqlJs();
  let db;

  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }

  function saveDB() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }

  // Tabla 1: Cabecera del Rutero
  db.run(`
    CREATE TABLE IF NOT EXISTS ruteros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT NOT NULL,
      conductor_nombre TEXT NOT NULL,
      vehiculo_placa TEXT NOT NULL,
      estado TEXT DEFAULT 'ASIGNADO',
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla 2: Clientes / Paradas de la planilla
  db.run(`
    CREATE TABLE IF NOT EXISTS paradas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rutero_id INTEGER NOT NULL,
      cliente_nombre TEXT NOT NULL,
      numero_factura_remision TEXT NOT NULL,
      orden INTEGER DEFAULT 1,
      hora_llegada TEXT DEFAULT NULL,
      hora_salida TEXT DEFAULT NULL,
      novedad TEXT DEFAULT NULL,
      firma_cliente_url TEXT DEFAULT NULL,
      FOREIGN KEY (rutero_id) REFERENCES ruteros (id) ON DELETE CASCADE
    );
  `);

  saveDB();

  return {
    run: (sql, params = []) => {
      db.run(sql, params);
      saveDB();
      const res = db.exec("SELECT last_insert_rowid() as id");
      return { lastID: res[0]?.values[0][0] || null };
    },
    all: (sql, params = []) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const result = [];
      while (stmt.step()) {
        result.push(stmt.getAsObject());
      }
      stmt.free();
      return result;
    },
    get: (sql, params = []) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      let result = null;
      if (stmt.step()) {
        result = stmt.getAsObject();
      }
      stmt.free();
      return result;
    }
  };
}

module.exports = initDB;
