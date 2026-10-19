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
  <style>
    input, select, textarea { text-transform: uppercase !important; }
    ::placeholder { text-transform: uppercase !important; }
    input[type="date"] { color-scheme: dark; }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) brightness(1.8); cursor: pointer; }
  </style>
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
          <i class="fa-solid fa-user-shield mr-1"></i> Admin
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
  <main class="flex-grow max-w-7xl w-full mx-auto p-6 space-y-8">
    
    <!-- SECCIÓN ADMINISTRADOR -->
    <section id="tab-admin" class="space-y-8">
      
      <!-- GESTIÓN DE CONDUCTORES -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div class="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-id-card text-blue-500"></i> Gestión de Conductores
          </h2>
          <span class="text-xs bg-slate-800 text-blue-400 px-3 py-1 rounded-full border border-slate-700 font-mono">BASE DE DATOS</span>
        </div>

        <!-- FORMULARIO CONDUCTOR -->
        <form id="form-conductor" onsubmit="handleGuardarConductor(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <input type="hidden" id="edit-index" value="-1">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Nombre del Conductor</label>
            <input type="text" id="cond-nombre" placeholder="Nombre completo" onkeyup="this.value = this.value.toUpperCase();" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Placa de Vehículo</label>
            <input type="text" id="cond-placa" placeholder="Ej. XYZ-789" onkeyup="this.value = this.value.toUpperCase();" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Teléfono / Celular</label>
            <input type="text" id="cond-telefono" placeholder="300 000 0000" onkeyup="this.value = this.value.toUpperCase();" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
          </div>
          <div class="flex items-end gap-2">
            <button type="submit" id="btn-save-cond" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-user-plus"></i> Guardar
            </button>
            <button type="button" onclick="resetFormConductor()" id="btn-cancel-cond" class="hidden bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2 rounded-xl text-sm border border-slate-700">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </form>

        <!-- TABLA CONDUCTORES -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th class="p-3">Nombre</th>
                <th class="p-3">Placa</th>
                <th class="p-3">Teléfono</th>
                <th class="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody id="tbody-conductores" class="divide-y divide-slate-800"></tbody>
          </table>
        </div>
      </div>

      <!-- ASIGNACIÓN DE RUTERO -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div class="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-file-circle-plus text-blue-500"></i> Asignación de Entregas (Rutero)
          </h2>
          <span class="text-xs bg-slate-800 text-blue-400 px-3 py-1 rounded-full border border-slate-700 font-mono">FERROCABLES LOGÍSTICA</span>
        </div>

        <form id="admin-rutero-form" onsubmit="handleGuardarRutero(event)" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Fecha de Despacho</label>
              <input type="date" id="rutero-fecha" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Conductor Asignado</label>
              <select id="rutero-conductor" onchange="actualizarPlacaConductor()" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="">-- SELECCIONAR CONDUCTOR --</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Placa Vehículo</label>
              <input type="text" id="rutero-placa" placeholder="AUTOCOMPLETADO" readonly class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 font-bold focus:outline-none">
            </div>
          </div>

          <div class="border-t border-slate-800 pt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <i class="fa-solid fa-boxes-packing text-amber-500"></i> Entregas Asignadas al Rutero
              </h3>
              <button type="button" onclick="addEntregaRow()" class="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold px-4 py-2 rounded-xl transition-all border border-slate-700">
                + Agregar Entrega
              </button>
            </div>
            <div id="entregas-container" class="space-y-3"></div>
          </div>

          <div class="flex justify-end pt-4 border-t border-slate-800">
            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2">
              <i class="fa-solid fa-paper-plane"></i> Generar Rutero de Despacho
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- SECCIÓN CONDUCTOR -->
    <section id="tab-driver" class="hidden space-y-6">
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl max-w-2xl mx-auto">
        <div class="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-truck-steer text-emerald-500"></i> Panel de Control del Conductor
          </h2>
          <span class="text-xs bg-slate-800 text-emerald-400 px-3 py-1 rounded-full border border-slate-700 font-mono">MIS PEDIDOS</span>
        </div>

        <div class="mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="w-full md:w-2/3">
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Selecciona tu Nombre</label>
            <select id="select-driver-login" onchange="cargarPedidosConductor()" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500">
              <option value="">-- SELECCIONAR CONDUCTOR --</option>
            </select>
          </div>
          <div class="w-full md:w-1/3 text-right">
            <button onclick="cargarPedidosConductor()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
              <i class="fa-solid fa-arrows-rotate"></i> Consultar
            </button>
          </div>
        </div>

        <!-- CONTENEDOR DE PEDIDOS ASIGNADOS -->
        <div id="driver-pedidos-list" class="space-y-4">
          <p class="text-xs text-slate-500 text-center py-6">Selecciona tu nombre arriba para ver tus pedidos asignados.</p>
        </div>
      </div>
    </section>

    <!-- SECCIÓN MONITOREO -->
    <section id="tab-monitor" class="hidden space-y-6">
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i class="fa-solid fa-chart-pie text-blue-500"></i> Control y Monitoreo de Ruteros
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th class="p-3">ID Rutero</th>
                <th class="p-3">Fecha</th>
                <th class="p-3">Conductor</th>
                <th class="p-3">Placa</th>
                <th class="p-3">N° Pedidos</th>
                <th class="p-3">Estado</th>
              </tr>
            </thead>
            <tbody id="tbody-ruteros-monitor" class="divide-y divide-slate-800"></tbody>
          </table>
        </div>
      </div>
    </section>
  </main>

  <script>
    // DATOS EN MEMORIA LOCAL Y PERSISTENCIA
    let conductores = JSON.parse(localStorage.getItem('fc_conductores')) || [
      { nombre: 'CARLOS GÓMEZ', placa: 'XYZ-789', telefono: '3001234567' },
      { nombre: 'ANDRÉS LÓPEZ', placa: 'MNO-456', telefono: '3109876543' }
    ];

    let ruteros = JSON.parse(localStorage.getItem('fc_ruteros')) || [];

    function guardarConductoresLS() {
      localStorage.setItem('fc_conductores', JSON.stringify(conductores));
      renderConductores();
      poblarSelectoresConductores();
    }

    function guardarRuterosLS() {
      localStorage.setItem('fc_ruteros', JSON.stringify(ruteros));
      renderRuterosMonitor();
    }

    // GESTIÓN CONDUCTORES
    function renderConductores() {
      const tbody = document.getElementById('tbody-conductores');
      tbody.innerHTML = '';
      if (conductores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-xs text-slate-500 text-center">No hay conductores registrados.</td></tr>';
        return;
      }
      conductores.forEach((c, idx) => {
        tbody.innerHTML += \`
          <tr class="hover:bg-slate-800/50 transition-colors">
            <td class="p-3 font-bold text-slate-200">\${c.nombre}</td>
            <td class="p-3 font-mono text-blue-400">\${c.placa}</td>
            <td class="p-3 text-slate-400">\${c.telefono}</td>
            <td class="p-3 text-right space-x-2">
              <button onclick="editarConductor(\${idx})" class="text-blue-400 hover:text-blue-300 p-1"><i class="fa-solid fa-pen-to-square"></i></button>
              <button onclick="eliminarConductor(\${idx})" class="text-rose-400 hover:text-rose-300 p-1"><i class="fa-solid fa-trash-can"></i></button>
            </td>
          </tr>
        \`;
      });
    }

    function handleGuardarConductor(e) {
      e.preventDefault();
      const idx = parseInt(document.getElementById('edit-index').value);
      const nombre = document.getElementById('cond-nombre').value.trim().toUpperCase();
      const placa = document.getElementById('cond-placa').value.trim().toUpperCase();
      const telefono = document.getElementById('cond-telefono').value.trim().toUpperCase();

      if (idx === -1) {
        conductores.push({ nombre, placa, telefono });
      } else {
        conductores[idx] = { nombre, placa, telefono };
      }

      resetFormConductor();
      guardarConductoresLS();
    }

    function editarConductor(idx) {
      const c = conductores[idx];
      document.getElementById('edit-index').value = idx;
      document.getElementById('cond-nombre').value = c.nombre;
      document.getElementById('cond-placa').value = c.placa;
      document.getElementById('cond-telefono').value = c.telefono;
      document.getElementById('btn-save-cond').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Actualizar';
      document.getElementById('btn-cancel-cond').classList.remove('hidden');
    }

    function eliminarConductor(idx) {
      if (confirm('¿Deseas eliminar a este conductor?')) {
        conductores.splice(idx, 1);
        guardarConductoresLS();
      }
    }

    function resetFormConductor() {
      document.getElementById('form-conductor').reset();
      document.getElementById('edit-index').value = -1;
      document.getElementById('btn-save-cond').innerHTML = '<i class="fa-solid fa-user-plus"></i> Guardar';
      document.getElementById('btn-cancel-cond').classList.add('hidden');
    }

    function poblarSelectoresConductores() {
      const selRutero = document.getElementById('rutero-conductor');
      const selDriverLogin = document.getElementById('select-driver-login');
      
      let options = '<option value="">-- SELECCIONAR CONDUCTOR --</option>';
      conductores.forEach(c => {
        options += \`<option value="\${c.nombre}">\${c.nombre} (\${c.placa})</option>\`;
      });

      selRutero.innerHTML = options;
      selDriverLogin.innerHTML = options;
    }

    function actualizarPlacaConductor() {
      const nombreSel = document.getElementById('rutero-conductor').value;
      const cond = conductores.find(c => c.nombre === nombreSel);
      document.getElementById('rutero-placa').value = cond ? cond.placa : '';
    }

    // ENTREGAS DEL RUTERO
    function addEntregaRow() {
      const container = document.getElementById('entregas-container');
      const row = document.createElement('div');
      row.className = 'grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 items-center entrega-item';
      row.innerHTML = \`
        <div class="md:col-span-5">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Empresa / Cliente</label>
          <input type="text" placeholder="Nombre de la empresa" onkeyup="this.value = this.value.toUpperCase();" required class="input-cliente w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500">
        </div>
        <div class="md:col-span-3">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo Documento</label>
          <select required class="select-tipo w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500">
            <option value="FACTURA">FACTURA</option>
            <option value="REMISIÓN">REMISIÓN</option>
          </select>
        </div>
        <div class="md:col-span-3">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Número de Documento</label>
          <input type="text" placeholder="Ej. F-1002 o REM-450" onkeyup="this.value = this.value.toUpperCase();" required class="input-doc w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500">
        </div>
        <div class="md:col-span-1 text-center pt-3 md:pt-0">
          <button type="button" onclick="this.closest('.entrega-item').remove()" class="text-rose-400 hover:text-rose-300 p-2"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      \`;
      container.appendChild(row);
    }

    function handleGuardarRutero(e) {
      e.preventDefault();
      const fecha = document.getElementById('rutero-fecha').value;
      const conductor = document.getElementById('rutero-conductor').value;
      const placa = document.getElementById('rutero-placa').value;

      const items = document.querySelectorAll('.entrega-item');
      if (items.length === 0) {
        alert('Debes agregar al menos una entrega al rutero.');
        return;
      }

      const entregas = [];
      items.forEach(item => {
        entregas.push({
          cliente: item.querySelector('.input-cliente').value,
          tipoDoc: item.querySelector('.select-tipo').value,
          numDoc: item.querySelector('.input-doc').value,
          estado: 'PENDIENTE'
        });
      });

      const nuevoRutero = {
        id: 'RUT-' + Math.floor(1000 + Math.random() * 9000),
        fecha,
        conductor,
        placa,
        entregas
      };

      ruteros.push(nuevoRutero);
      guardarRuterosLS();

      document.getElementById('admin-rutero-form').reset();
      document.getElementById('entregas-container').innerHTML = '';
      addEntregaRow();

      alert('RUTERO N° ' + nuevoRutero.id + ' ASIGNADO EXITOSAMENTE A ' + conductor);
    }

    // PANEL CONDUCTOR
    function cargarPedidosConductor() {
      const nombreCond = document.getElementById('select-driver-login').value;
      const container = document.getElementById('driver-pedidos-list');
      container.innerHTML = '';

      if (!nombreCond) {
        container.innerHTML = '<p class="text-xs text-slate-500 text-center py-6">Selecciona tu nombre arriba para ver tus pedidos asignados.</p>';
        return;
      }

      const misRuteros = ruteros.filter(r => r.conductor === nombreCond);

      if (misRuteros.length === 0) {
        container.innerHTML = '<div class="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center text-slate-400 text-sm">No tienes ruteros ni pedidos asignados por el momento.</div>';
        return;
      }

      misRuteros.forEach(r => {
        let htmlEntregas = '';
        r.entregas.forEach((ent, idx) => {
          htmlEntregas += \`
            <div class="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <p class="text-sm font-bold text-white">\${ent.cliente}</p>
                <p class="text-xs text-slate-400">\${ent.tipoDoc}: <span class="font-mono text-blue-400">\${ent.numDoc}</span></p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">\${ent.estado}</span>
              </div>
            </div>
          \`;
        });

        container.innerHTML += \`
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
              <span class="text-xs font-bold text-blue-400">\${r.id} | Fecha: \${r.fecha}</span>
              <span class="text-xs text-slate-400">Placa: \${r.placa}</span>
            </div>
            <div class="space-y-2">\${htmlEntregas}</div>
          </div>
        \`;
      });
    }

    // MONITOREO
    function renderRuterosMonitor() {
      const tbody = document.getElementById('tbody-ruteros-monitor');
      tbody.innerHTML = '';

      if (ruteros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-xs text-slate-500 text-center">No hay ruteros creados aún.</td></tr>';
        return;
      }

      ruteros.forEach(r => {
        tbody.innerHTML += \`
          <tr class="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
            <td class="p-3 font-bold text-blue-400">\${r.id}</td>
            <td class="p-3 text-slate-300">\${r.fecha}</td>
            <td class="p-3 text-white font-semibold">\${r.conductor}</td>
            <td class="p-3 font-mono text-slate-300">\${r.placa}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-bold">\${r.entregas.length} ENTREGAS</span></td>
            <td class="p-3"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">ASIGNADO</span></td>
          </tr>
        \`;
      });
    }

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

      if (tabId === 'tab-driver') cargarPedidosConductor();
    }

    // INICIALIZACIÓN
    renderConductores();
    poblarSelectoresConductores();
    addEntregaRow();
    renderRuterosMonitor();
  </script>
</body>
</html>`;

app.get('/', (req, res) => {
  res.send(DASHBOARD_HTML);
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
