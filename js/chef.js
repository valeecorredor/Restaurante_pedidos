const API_URL = 'http://localhost:3005/api';

// ==================== CARGAR PEDIDOS CHEF ====================

async function cargarPedidosChef() {
    const tbodyPorPreparar = document.querySelector('#PorPreparar tbody');
    const tbodyPreparando = document.querySelector('#Preparando tbody');

    try {
        const response = await fetch(`${API_URL}/chef`);
        const resultado = await response.json();

        // La API devuelve { success, message, data: { porPreparar, preparando } }
        const porPreparar = resultado.data.porPreparar;
        const preparando = resultado.data.preparando;

        // Tabla: Por Preparar
        if (!porPreparar.length) {
            tbodyPorPreparar.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay pedidos por preparar</td></tr>';
        } else {
            tbodyPorPreparar.innerHTML = porPreparar.map(p => `
                <tr>
                    <td>${p.platillo} <br><small class="text-muted">${p.observaciones || ''}</small></td>
                    <td>${p.mesa}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="cambiarEstado(${p.id}, 'preparando')">👨‍🍳 Preparar</button>
                    </td>
                </tr>
            `).join('');
        }

        // Tabla: Preparando
        if (!preparando.length) {
            tbodyPreparando.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay pedidos preparándose</td></tr>';
        } else {
            tbodyPreparando.innerHTML = preparando.map(p => `
                <tr>
                    <td>${p.platillo} <br><small class="text-muted">${p.observaciones || ''}</small></td>
                    <td>${p.mesa}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="cambiarEstado(${p.id}, 'listo')">✅ Terminado</button>
                    </td>
                </tr>
            `).join('');
        }

    } catch (error) {
        tbodyPorPreparar.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error al cargar pedidos</td></tr>';
        tbodyPreparando.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error al cargar pedidos</td></tr>';
        console.error('Error:', error);
    }
}

// ==================== CAMBIAR ESTADO ====================

async function cambiarEstado(id, endpoint) {
    try {
        // endpoint será 'preparando' o 'listo'
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (response.ok) {
            cargarPedidosChef();
        } else {
            const data = await response.json();
            alert('❌ Error: ' + (data.message || JSON.stringify(data)));
        }
    } catch (error) {
        alert('❌ Error de conexión');
        console.error('Error:', error);
    }
}

// ==================== INICIALIZACIÓN ====================

cargarPedidosChef();

// Auto-refrescar cada 10 segundos
setInterval(cargarPedidosChef, 10000);
