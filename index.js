const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend desde las carpetas 'público' o 'public'
app.use(express.static(path.join(__dirname, 'público')));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para evitar pantallas en blanco o errores 500
app.get('/', (req, res) => {
  const publicPath = path.join(__dirname, 'público', 'index.html');
  res.sendFile(publicPath, (err) => {
    if (err) {
      res.status(200).send('<h2>Servidor de Ferrocables activo y funcionando correctamente</h2>');
    }
  });
});

// Comprobación de estado del servicio
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Captura de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global para evitar que el servidor caiga
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(500).json({ error: 'Error en el servidor', details: err.message });
});

// Puerto dinámico asignado por Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de Ferrocables corriendo en el puerto ${PORT}`);
});

// Prevenir caídas por excepciones imprevistas
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));

