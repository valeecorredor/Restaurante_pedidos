const API_URL = 'http://localhost:3005/api';

// ==================== UTILIDADES ====================

// Parsear precio del formato display "$15.500" a número 15500
function parsePrecio(precioStr) {
    return parseInt(precioStr.replace(/[$.\s]/g, ''));
}

// Formatear número 15500 a formato display "$15.500"
function formatPrecio(precio) {
    return '$' + Number(precio).toLocaleString('es-CO');
}

// Color del badge según estado del pedido
function getEstadoColor(estado) {
    const colores = {
        'por preparar': 'secondary',
        'preparando': 'warning',
        'listo': 'info',
        'entregado': 'success'
    };
    return colores[estado] || 'secondary';
}

// ==================== CREAR PEDIDO ====================

document.querySelectorAll('.btn-pedido').forEach(btn => {
    btn.addEventListener('click', async function () {
        const form = this.closest('form');
        const menuDiv = form.closest('.menu');

        const platillo = form.querySelector('.platillo').value;
        const cliente = form.querySelector('.cliente').value.trim();
        const cantidad = parseInt(form.querySelector('.cantidad').value);
        const fecha = form.querySelector('.fecha').value;
        const observaciones = form.querySelector('.observaciones').value.trim();
        const mesa = parseInt(form.querySelector('.mesa').value);
        const precioSpan = menuDiv.querySelector('.precios');
        const precio = parsePrecio(precioSpan.textContent);

        // Validación de campos obligatorios
        if (!platillo || !cliente || !cantidad || !fecha || !mesa) {
            alert('⚠️ Por favor complete todos los campos obligatorios');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/pedido`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platillo, precio, mesa, cantidad, observaciones, cliente, fecha })
            });

            const data = await response.json();

            if (response.ok) {
                alert('✅ Pedido creado exitosamente');
                // Limpiar campos del formulario
                form.querySelector('.cliente').value = '';
                form.querySelector('.cantidad').value = '';
                form.querySelector('.observaciones').value = '';
                form.querySelector('.mesa').value = '';
            } else {
                alert('❌ Error al crear pedido: ' + (data.message || JSON.stringify(data)));
            }
        } catch (error) {
            alert('❌ Error de conexión con el servidor');
            console.error('Error:', error);
        }
    });
});

// ==================== LISTAR PEDIDOS ====================

async function cargarPedidos() {
    const tbody = document.getElementById('tablaPedidos');

    try {
        const response = await fetch(`${API_URL}/pedidos`);
        const pedidos = await response.json();

        if (!pedidos.length) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">No hay pedidos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = pedidos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.platillo}</td>
                <td>${p.cliente}</td>
                <td>${p.mesa}</td>
                <td>${p.cantidad}</td>
                <td>${formatPrecio(p.precio)}</td>
                <td>${p.fecha}</td>
                <td>${p.observaciones || ''}</td>
                <td><span class="badge bg-${getEstadoColor(p.estado)}">${p.estado || 'por preparar'}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="abrirEditar(${p.id})">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${p.id})">🗑️ Eliminar</button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center text-danger">Error al cargar pedidos</td></tr>';
        console.error('Error:', error);
    }
}

// ==================== EDITAR PEDIDO ====================

async function abrirEditar(id) {
    try {
        const response = await fetch(`${API_URL}/pedidos`);
        const pedidos = await response.json();
        const pedido = pedidos.find(p => p.id === id);

        if (!pedido) {
            alert('❌ Pedido no encontrado');
            return;
        }

        // Rellenar el modal con los datos del pedido
        document.getElementById('editarPedidoId').value = pedido.id;
        document.getElementById('editarPlatillo').value = pedido.platillo;
        document.getElementById('editarCliente').value = pedido.cliente;
        document.getElementById('editarMesa').value = pedido.mesa;
        document.getElementById('editarCantidad').value = pedido.cantidad;
        document.getElementById('editarPrecio').value = pedido.precio;
        document.getElementById('editarFecha').value = pedido.fecha;
        document.getElementById('editarObservaciones').value = pedido.observaciones || '';
        document.getElementById('editarEstado').value = pedido.estado || 'por preparar';

        // Abrir modal con Bootstrap 5
        const modal = new bootstrap.Modal(document.getElementById('modalEditarPedido'));
        modal.show();

    } catch (error) {
        alert('❌ Error al cargar el pedido');
        console.error('Error:', error);
    }
}

async function guardarCambios() {
    const pedido = {
        id: parseInt(document.getElementById('editarPedidoId').value),
        platillo: document.getElementById('editarPlatillo').value,
        cliente: document.getElementById('editarCliente').value,
        mesa: parseInt(document.getElementById('editarMesa').value),
        cantidad: parseInt(document.getElementById('editarCantidad').value),
        precio: parseInt(document.getElementById('editarPrecio').value),
        fecha: document.getElementById('editarFecha').value,
        observaciones: document.getElementById('editarObservaciones').value,
        estado: document.getElementById('editarEstado').value
    };

    try {
        const response = await fetch(`${API_URL}/pedido`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });

        if (response.ok) {
            alert('✅ Pedido actualizado exitosamente');
            // Cerrar modal y refrescar tabla
            const modalEl = document.getElementById('modalEditarPedido');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
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

// Interceptar openMenu para cargar pedidos al abrir la pestaña "Ver Pedidos"
const _openMenuOriginal = window.openMenu;
window.openMenu = function (evt, menuName) {
    _openMenuOriginal(evt, menuName);
    if (menuName === 'VerPedidos') {
        cargarPedidos();
    }
};
