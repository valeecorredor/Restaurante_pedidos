const API_URL = 'http://localhost:3005/api';

// Color del badge según estado del pedido
function getEstadoColor(estado) {
    const colores = {
        'por preparar': 'secondary',
        'preparar': 'secondary',
        'preparando': 'warning',
        'listo': 'info',
        'entregar': 'info',
        'entregado': 'success'
    };
    return colores[estado] || 'secondary';
}

// ==================== CARGAR PEDIDOS ====================

async function cargarPedidos() {
    const tbody = document.querySelector('#PorPreparar tbody');

    try {
        const response = await fetch(`${API_URL}/pedidos`);
        const pedidos = await response.json();

        if (!pedidos.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay pedidos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = pedidos.map(p => `
            <tr>
                <td>${p.platillo}</td>
                <td>${p.mesa}</td>
                <td><span class="badge bg-${getEstadoColor(p.estado)}">${p.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${p.id})">🗑️ Eliminar</button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar pedidos</td></tr>';
        console.error('Error:', error);
    }
}

// ==================== ELIMINAR PEDIDO ====================

async function eliminarPedido(id) {
    if (!confirm('¿Está seguro que desea eliminar este pedido?')) return;

    try {
        const response = await fetch(`${API_URL}/pedido`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (response.ok) {
            alert('✅ Pedido eliminado');
            cargarPedidos();
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

// Cargar pedidos al iniciar la página
cargarPedidos();

// Auto-refrescar cada 10 segundos
setInterval(cargarPedidos, 10000);
