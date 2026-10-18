require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDB = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_CODE = process.env.ADMIN_CODE || "CLAVE_ADMIN_2026";
let db;

function authAdmin(req, res, next) {
  const authHeader = req.headers['x-admin-code'];
  if (!authHeader || authHeader !== ADMIN_CODE) {
    return res.status(401).json({ error: "Acceso denegado. Código de administrador incorrecto." });
  }
  next();
}

// 1. Crear nuevo rutero (ADMIN)
app.post('/api/v1/admin/ruteros', authAdmin, async (req, res) => {
  try {
    const { fecha, conductor_nombre, vehiculo_placa, paradas } = req.body;

    const result = await db.run(
      `INSERT INTO ruteros (fecha, conductor_nombre, vehiculo_placa) VALUES (?, ?, ?)`,
      [fecha, conductor_nombre, vehiculo_placa]
    );

    const ruteroId = result.lastID;

    if (paradas && Array.isArray(paradas)) {
      for (let i = 0; i < paradas.length; i++) {
        const p = paradas[i];
        await db.run(
          `INSERT INTO paradas (rutero_id, cliente_nombre, numero_factura_remision, orden) VALUES (?, ?, ?, ?)`,
          [ruteroId, p.cliente_nombre, p.numero_factura_remision, i + 1]
        );
      }
    }

    res.status(201).json({ 
      mensaje: "Rutero asignado correctamente", 
      rutero_id: ruteroId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Consultar lista de ruteros
app.get('/api/v1/ruteros', async (req, res) => {
  try {
    const { fecha } = req.query;
    let query = `SELECT * FROM ruteros`;
    let params = [];

    if (fecha) {
      query += ` WHERE fecha = ?`;
      params.push(fecha);
    }

    const ruteros = await db.all(query, params);
    res.json(ruteros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Consultar un rutero especifico con paradas
app.get('/api/v1/ruteros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rutero = await db.get(`SELECT * FROM ruteros WHERE id = ?`, [id]);
    if (!rutero) return res.status(404).json({ error: "El rutero no existe" });

    const paradas = await db.all(`SELECT * FROM paradas WHERE rutero_id = ? ORDER BY orden ASC`, [id]);
    res.json({ ...rutero, paradas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Actualizar parada (CONDUCTOR)
app.patch('/api/v1/paradas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hora_llegada, hora_salida, novedad, firma_cliente_url } = req.body;

    const parada = await db.get(`SELECT * FROM paradas WHERE id = ?`, [id]);
    if (!parada) return res.status(404).json({ error: "La parada/cliente no existe" });

    await db.run(
      `UPDATE paradas SET 
        hora_llegada = COALESCE(?, hora_llegada),
        hora_salida = COALESCE(?, hora_salida),
        novedad = COALESCE(?, novedad),
        firma_cliente_url = COALESCE(?, firma_cliente_url)
      WHERE id = ?`,
      [hora_llegada, hora_salida, novedad, firma_cliente_url, id]
    );

    res.json({ mensaje: "Parada actualizada con exito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
initDB().then((database) => {
  db = database;
  app.listen(PORT, () => {
    console.log(`Servidor activo localmente en http://localhost:${PORT}`);
  });
});
