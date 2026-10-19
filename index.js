const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ferrocables - Gestión de Rutas</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
  <header class="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 p-4">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center space-x-3">
        <div class="bg-blue-600 p-2.5 rounded-xl text-white flex items-center justify-center">
          <i class="fa-solid fa-industry text-2xl"></i>
        </div>
        <div>
          <span class="text-2xl font-extrabold tracking-wider text-white">FERROCABLES<span class="text-blue-500">®</span></span>
          <p class="text-xs text-slate-400">Sistema de Gestión de Rutas & Logística</p>
        </div>
      </div>
      <nav class="flex space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button onclick="switchTab('tab-admin')" id="btn-admin" class="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600">Admin</button>
        <button onclick="switchTab('tab-driver')" id="btn-driver" class="px-4 py-2 text-sm font-semibold rounded-lg text-slate-400">Conductor</button>
        <button onclick="switchTab('tab-monitor')" id="btn-monitor" class="px-4 py-2 text-sm font-semibold rounded-lg text-slate-400">Monitoreo</button>
      </nav>
    </div>
  </header>

  <main class="flex-grow max-w-7xl w-full mx-auto p-6">
    <!-- ADMIN -->
    <section id="tab-admin" class="space-y-6">
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h2 class="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-4">
          <i class="fa-solid fa-circle-plus text-blue-500 mr-2"></i> Crear Nueva Ruta (Ferrocables)
        </h2>
        <form onsubmit="event.preventDefault(); alert('Ruta guardada en Ferrocables');" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Fecha</label>
              <input type="date" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Conductor</label>
              <input type="text" placeholder="Nombre completo" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Placa Vehículo</label>
              <input type="text" placeholder="Ej. ABC-123" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white">
            </div>
          </div>
          <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
            <i class="fa-solid fa-floppy-disk mr-2"></i> Guardar Ruta
          </button>
        </form>
      </div>
    </section>

    <!-- CONDUCTOR -->
    <section id="tab-driver" class="hidden space-y-6">
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl max-w-xl mx-auto">
        <h2 class="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-4">
          <i class="fa-solid fa-truck-steer text-emerald-500 mr-2"></i> Panel Conductor
        </h2>
        <form onsubmit="event.preventDefault(); alert('Parada registrada');" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">ID Parada</label>
            <input type="number" placeholder="Ej. 1" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Hora Llegada</label>
              <input type="text" placeholder="08:30 AM" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Hora Salida</label>
              <input type="text" placeholder="09:15 AM" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white">
            </div>
          </div>
          <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-sm">
            Registrar Parada
          </button>
        </form>
      </div>
    </section>

    <!-- MONITOREO -->
    <section id="tab-monitor" class="hidden space-y-6">
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h2 class="text-lg font-bold text-white mb-4">
          <i class="fa-solid fa-chart-pie text-blue-500 mr-2"></i> Monitoreo Ferrocables
        </h2>
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <th class="p-3">ID</th><th class="p-3">Fecha</th><th class="p-3">Conductor</th><th class="p-3">Placa</th><th class="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-800">
              <td class="p-3 font-bold text-blue-400">#101</td>
              <td class="p-3">2026-10-19</td>
              <td class="p-3">Carlos Gómez</td>
              <td class="p-3">XYZ-789</td>
              <td class="p-3"><span class="px-2 py-1 rounded bg-emerald-950 text-emerald-400 text-xs font-bold">EN RUTA</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <script>
    function switchTab(tabId) {
      ['tab-admin', 'tab-driver', 'tab-monitor'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
      });
      document.getElementById(tabId).classList.remove('hidden');
    }
  </script>
</body>
</html>`;

app.get('/', (req, res) => {
  res.send(DASHBOARD_HTML);
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
