const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ruteros & Transporte</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen p-6">
  <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md border">
    <h1 class="text-2xl font-bold text-slate-900 mb-4"><i class="fa-solid fa-truck-fast text-blue-600"></i> Panel de Gestión de Rutas</h1>
    <div class="flex gap-4 mb-6 border-b pb-3">
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">Admin</button>
      <button class="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium">Conductor</button>
      <button class="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium">Monitoreo</button>
    </div>
    <p class="text-slate-600">Panel activo y cargado correctamente en Render.</p>
  </div>
</body>
</html>`;

// Responder en TODAS las rutas posibles
app.get('*', (req, res) => {
  res.send(HTML);
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
