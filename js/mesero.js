const API_URL = 'http://localhost:3005/api';

// ==================== CARGAR PEDIDOS MESERO ====================

async function cargarPedidosMesero() {
    const tbodyPorEntregar = document.querySelector('#PorEntregar tbody');
    const tbodyEntregado = document.querySelector('#Entregado tbody');

    try {
        const response = await fetch(`${API_URL}/mesero`);
        const resultado = await response.json();

        // La API devuelve { success, message, data: { porEntregar, entregado } }
        const porEntregar = resultado.data.porEntregar;
        const entregado = resultado.data.entregado;

        // Tabla: Por Entregar
        if (!porEntregar.length) {
            tbodyPorEntregar.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay pedidos por entregar</td></tr>';
        } else {
            tbodyPorEntregar.innerHTML = porEntregar.map(p => `
                <tr>
                    <td>${p.platillo}</td>
                    <td>${p.mesa}</td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="marcarEntregado(${p.id})">✅ Entregado</button>
                    </td>
                </tr>
            `).join('');
        }

        // Tabla: Entregado
        if (!entregado.length) {
            tbodyEntregado.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay pedidos entregados</td></tr>';
        } else {
            tbodyEntregado.innerHTML = entregado.map(p => `
                <tr>
                    <td>${p.platillo}</td>
                    <td>${p.mesa}</td>
                    <td><span class="badge bg-success">Entregado</span></td>
                </tr>
            `).join('');
        }

    } catch (error) {
        tbodyPorEntregar.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error al cargar pedidos</td></tr>';
        tbodyEntregado.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error al cargar pedidos</td></tr>';
        console.error('Error:', error);
    }
}

// ==================== MARCAR COMO ENTREGADO ====================

async function marcarEntregado(id) {
    try {
        const response = await fetch(`${API_URL}/entregado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (response.ok) {
            alert('✅ Pedido marcado como entregado');
            cargarPedidosMesero();
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

cargarPedidosMesero();

// Auto-refrescar cada 10 segundos
setInterval(cargarPedidosMesero, 10000);
