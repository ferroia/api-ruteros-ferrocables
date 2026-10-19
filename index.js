const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ferrocables - Gestión de Ruteros</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
  <!-- ENCABEZADO -->
  <header class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 p-4">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center space-x-3">
        <div class="bg-blue-600 p-2.5 rounded-xl text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
          <i class="fa-solid fa-industry text-2xl"></i>
        </div>
        <div>
          <span class="text-2xl font-extrabold tracking-wider text-white">FERROCABLES<span class="text-blue-500">®</span></span>
          <p class="text-xs text-slate-400">Asignación de Ruteros & Entregas</p>
        </div>
      </div>
      <nav class="flex space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button onclick="switchTab('tab-admin')" id="btn-admin" class="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 shadow-md">
          <i class="fa-solid fa-clipboard-list mr-1"></i> Crear Rutero
        </button>
        <button onclick="switchTab('tab-driver')" id="btn-driver" class="px-4 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-white">
          <i class="fa-solid fa-truck-steer mr-1"></i> Conductor
        </button>
        <button onclick="switchTab('tab-monitor')" id="btn-monitor" class="px-4 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-white">
          <i class="fa-solid fa-chart-pie mr-1"></i> Monitoreo
        </button>
      </nav>
    </div>
  </header>

  <!-- CONTENIDO PRINCIPAL -->
  <main class="flex-grow max-w-7xl w-full mx-auto p-6">
    <!-- PANEL ADMIN: CREAR RUTERO -->
    <section id="tab-admin" class="space-y-6">
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div class="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-file-circle-plus text-blue-500"></i> Asignación de Entregas (Rutero)
          </h2>
          <span class="text-xs bg-slate-800 text-blue-400 px-3 py-1 rounded-full border border-slate-700 font-mono">FERROCABLES LOGÍSTICA</span>
        </div>

        <form id="admin-rutero-form" onsubmit="event.preventDefault(); alert('Rutero de asignación creado con éxito');" class="space-y-6">
          <!-- DATOS GENERALES DE LA RUTA -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fecha de Despacho</label>
              <input type="date" required class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Conductor Asignado</label>
              <input type="text" placeholder="Nombre Conductor" required class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Placa Vehículo</label>
              <input type="text" placeholder="Ej. XYZ-789" required class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
            </div>
          </div>

          <!-- DETALLE DE ENTREGAS DEL RUTERO -->
          <div class="border-t border-slate-800 pt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <i class="fa-solid fa-boxes-packing text-amber-500"></i> Entregas Asignadas
              </h3>
              <button type="button" onclick="addEntregaRow()" class="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold px-4 py-2 rounded-xl transition-all border border-slate-700 flex items-center gap-1.5">
                <i class="fa-solid fa-plus"></i> Agregar Entrega
              </button>
            </div>

            <!-- CONTENEDOR DE ENTREGAS -->
            <div id="entregas-container" class="space-y-3"></div>
          </div>

          <div class="flex justify-end pt-4 border-t border-slate-800">
            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center gap-2">
              <i class="fa-solid fa-paper-plane"></i> Generar Rutero de Despacho
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- CONDUCTOR -->
    <section id="tab-driver" class="hidden space-y-6">
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl max-w-xl mx-auto">
        <h2 class="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-4">
          <i class="fa-solid fa-truck-steer text-emerald-500 mr-2"></i> Reporte del Conductor
        </h2>
        <form onsubmit="event.preventDefault(); alert('Estado actualizado');" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Número de Documento / Remisión</label>
            <input type="text" placeholder="Ej. FAC-10203" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white">
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
            Registrar Entrega
          </button>
        </form>
      </div>
    </section>

    <!-- MONITOREO -->
    <section id="tab-monitor" class="hidden space-y-6">
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h2 class="text-lg font-bold text-white mb-4">
          <i class="fa-solid fa-chart-pie text-blue-500 mr-2"></i> Control de Ruteros
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th class="p-3">ID Rutero</th>
                <th class="p-3">Fecha</th>
                <th class="p-3">Empresa (Cliente)</th>
                <th class="p-3">Tipo Doc.</th>
                <th class="p-3">N° Documento</th>
                <th class="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-800">
                <td class="p-3 font-bold text-blue-400">#RUT-001</td>
                <td class="p-3">2026-10-19</td>
                <td class="p-3">Constructora del Norte S.A.S.</td>
                <td class="p-3"><span class="px-2 py-0.5 rounded bg-blue-950 text-blue-400 text-xs border border-blue-800">Factura</span></td>
                <td class="p-3 font-mono">F-89210</td>
                <td class="p-3"><span class="px-2 py-1 rounded bg-emerald-950 text-emerald-400 text-xs font-bold">ASIGNADO</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>

  <script>
    function switchTab(tabId) {
      ['tab-admin', 'tab-driver', 'tab-monitor'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
      });
      document.getElementById(tabId).classList.remove('hidden');
      
      const tabNames = ['admin', 'driver', 'monitor'];
      tabNames.forEach(name => {
        const btn = document.getElementById('btn-' + name);
        if ('tab-' + name === tabId) {
          btn.className = 'px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 shadow-md';
        } else {
          btn.className = 'px-4 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-white';
        }
      });
    }

    function addEntregaRow() {
      const container = document.getElementById('entregas-container');
      const row = document.createElement('div');
      row.className = 'grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 items-center';
      row.innerHTML = \`
        <div class="md:col-span-5">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Empresa / Cliente</label>
          <input type="text" placeholder="Nombre de la empresa" required class="w-full bg-slate-900 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500">
        </div>
        <div class="md:col-span-3">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo Documento</label>
          <select required class="w-full bg-slate-900 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500">
            <option value="Factura">Factura</option>
            <option value="Remisión">Remisión</option>
          </select>
        </div>
        <div class="md:col-span-4">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Número de Documento</label>
          <input type="text" placeholder="Ej. F-1002 o REM-450" required class="w-full bg-slate-900 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500">
        </div>
      \`;
      container.appendChild(row);
    }

    // Agregar primera entrega por defecto
    addEntregaRow();
  </script>
</body>
</html>`;

app.get('/', (req, res) => {
  res.send(DASHBOARD_HTML);
});

app.listen(PORT, () => {
  console.log(`Servidor Ferrocables activo en puerto ${PORT}`);
});
