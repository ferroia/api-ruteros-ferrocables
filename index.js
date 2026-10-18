const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal que entrega la interfaz visual
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint de prueba de datos
app.get('/api/v1/ruteros', (req, res) => {
  res.json([
    {
      id: 1,
      fecha: "2026-10-18",
      conductor_nombre: "Carlos Gómez",
      vehiculo_placa: "XYZ-789",
      estado: "ASIGNADO",
      creado_en: "2026-10-18 21:45:50"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
