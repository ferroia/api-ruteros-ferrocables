const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ruteros & Transporte</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col">
  <header class="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center space-x-3">
        <i class="fa-solid fa-truck-fast text-2xl text-blue-400"></i>
        <div>
          <h1 class="text-xl font-bold tracking-wide">Ruteros & Transporte</h1>
          <p class="text-xs text-slate-400">Gestión de Rutas y Seguimiento</p>
        </div>
      </div>
      <nav class="flex space-x-2 bg-slate-800 p-1 rounded-lg">
        <button onclick="switchTab('tab-admin')" id="btn-admin" class="px-4 py-2 text-sm font-medium rounded-md transition-colors text-white bg-blue-600 shadow">
          <i class="fa-solid fa-user-shield mr-1"></i> Admin
        </button>
        <button onclick="switchTab('tab-driver')" id="btn-driver" class="px-4 py-2 text-sm font-medium rounded-md transition-colors text-slate-300 hover:text-white">
          <i class="fa-solid fa-id-card mr-1"></i> Conductor
        </button>
        <button onclick="switchTab('tab-monitor')" id="btn-monitor" class="px-4 py-2 text-sm font-medium rounded-md transition-colors text-slate-300 hover:text-white">
          <i class="fa-solid fa-chart-line mr-1"></i> Monitoreo
        </button>
      </nav>
    </div>
  </header>

  <main class="flex-grow max-w-7xl w-full mx-auto px-4 py-6">
    <!-- VISTA ADMIN -->
    <section id="tab-admin" class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-bold text-slate-900 border-b pb-3 mb-4 flex items-center">
          <i class="fa-solid fa-plus-circle text-blue-600 mr-2"></i> Crear Nueva Ruta de Transporte
        </h2>
        <form id="admin-form" onsubmit="handleCreateRoute(event)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Fecha</label>
              <input type="date" id="route-date" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Nombre Conductor</label>
              <input type="text" id="driver-name" placeholder="Ej. Carlos Gómez" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Placa Vehículo</label>
              <input type="text" id="vehicle-plate" placeholder="Ej. XYZ-789" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
            </div>
          </div>
          <div class="border-t pt-4 mt-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-sm font-semibold text-slate-700">Paradas de la Ruta</h3>
              <button type="button" onclick="addStopRow()" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors border">
                <i class="fa-solid fa-plus mr-1"></i> Agregar Parada
              </button>
            </div>
            <div id="stops-container" class="space-y-3"></div>
          </div>
          <div class="flex justify-end pt-4">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md transition-colors text-sm">
              <i class="fa-solid fa-paper-plane mr-2"></i> Registrar Ruta Completa
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- VISTA CONDUCTOR -->
    <section id="tab-driver" class="hidden space-y-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-bold text-slate-900 border-b pb-3 mb-4 flex items-center">
          <i class="fa-solid fa-truck-ramp-box text-emerald-600 mr-2"></i> Registro de Paradas en Ruta
        </h2>
        <form id="driver-form" onsubmit="handleDriverUpdate(event)" class="space-y-4 max-w-xl">
          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">ID de Parada</label>
            <input type="number" id="stop-id" placeholder="Ej. 1" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Hora Llegada</label>
              <input type="text" id="arrival-time" placeholder="08:30 AM" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Hora Salida</label>
              <input type="text" id="departure-time" placeholder="09:15 AM" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Novedad / Observaciones</label>
            <textarea id="novelty" rows="3" placeholder="Entregado con éxito..." class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
          </div>
          <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg shadow-md transition-colors text-sm">
            <i class="fa-solid fa-check-double mr-2"></i> Actualizar Parada
          </button>
        </form>
      </div>
    </section>

    <!-- VISTA MONITOREO -->
    <section id="tab-monitor" class="hidden space-y-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-slate-900 flex items-center">
            <i class="fa-solid fa-list-check text-blue-600 mr-2"></i> Rutas Registradas
          </h2>
          <button onclick="fetchRoutes()" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg border">
            <i class="fa-solid fa-arrows-rotate mr-1"></i> Actualizar Listado
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Fecha</th>
                <th class="py-3 px-4">Conductor</th>
                <th class="py-3 px-4">Placa</th>
                <th class="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody id="routes-tbody"></tbody>
          </table>
        </div>
      </div>
    </section>
  </main>

  <script>
    const API_BASE = window.location.origin;

    function switchTab(tabId) {
      ['tab-admin', 'tab-driver', 'tab-monitor'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
      });
      document.getElementById(tabId).classList.remove('hidden');
      
      // Estilos de pestañas
      ['admin', 'driver', 'monitor'].forEach(name => {
        const btn = document.getElementById('btn-' + name);
        if ('tab-' + name === tabId) {
          btn.className = 'px-4 py-2 text-sm font-medium rounded-md transition-colors text-white bg-blue-600 shadow';
        } else {
          btn.className = 'px-4 py-2 text-sm font-medium rounded-md transition-colors text-slate-300 hover:text-white';
        }
      });

      if (tabId === 'tab-monitor') fetchRoutes();
    }

    function addStopRow() {
      const container = document.getElementById('stops-container');
      const row = document.createElement('div');
      row.className = 'grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border stop-row';
      row.innerHTML = \`
        <input type="text" placeholder="Nombre Cliente" required class="stop-client px-3 py-2 border rounded-lg text-sm">
        <input type="text" placeholder="Número Remisión / Factura" required class="stop-invoice px-3 py-2 border rounded-lg text-sm">
      \`;
      container.appendChild(row);
    }

    async function handleCreateRoute(e) {
      e.preventDefault();
      alert('Modo previsualización: Formulario de creación de ruta activo.');
    }

    async function handleDriverUpdate(e) {
      e.preventDefault();
      alert('Modo previsualización: Actualización de parada lista.');
    }

    async function fetchRoutes() {
      const tbody = document.getElementById('routes-tbody');
      tbody.innerHTML = \`
        <tr class="border-b hover:bg-slate-50">
          <td class="py-3 px-4 font-bold text-blue-600">#1</td>
          <td class="py-3 px-4">2026-10-19</td>
          <td class="py-3 px-4">Carlos Gómez</td>
          <td class="py-3 px-4">XYZ-789</td>
          <td class="py-3 px-4"><span class="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">EN RUTA</span></td>
        </tr>
      \`;
    }

    addStopRow();
  </script>
</body>
</html>`;

app.get('/', (req, res) => {
  res.send(DASHBOARD_HTML);
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
