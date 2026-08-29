// URL base de nuestra API REST local
const URL_BASE = 'http://localhost:3005';

const contenedorPedidosChef = document.getElementById('chef-pedidos');

/**
 * Función principal para obtener y mostrar los pedidos del chef.
 */
async function obtenerPedidosChef() {
    try {
        // 1. Realizamos la petición GET al endpoint /chef
        const respuesta = await fetch(`${URL_BASE}/chef`);

        // 2. Verificamos si la respuesta del servidor es exitosa (código 200-299)
        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        // 3. Convertimos la respuesta a formato JSON (arreglo de pedidos)
        const pedidos = await respuesta.json();

        // 4. Limpiamos el contenedor en el DOM antes de mostrar los nuevos pedidos
        if (contenedorPedidosChef) {
            contenedorPedidosChef.innerHTML = '';

            // 5. Recorremos el arreglo de pedidos devuelto por la API y los renderizamos
            pedidos.forEach(pedido => {
                // Creamos un elemento div para cada pedido
                const divPedido = document.createElement('div');
                divPedido.classList.add('pedido-card');
                divPedido.innerHTML = `
                    <h3>Pedido #${pedido.id}</h3>
                    <p><strong>Estado:</strong> ${pedido.estado}</p>
                    <p><strong>Detalle:</strong> ${pedido.descripcion || 'Sin descripción'}</p>
                    
                    <!-- Botón para cambiar a "preparando" -->
                    <button onclick="cambiarEstadoPreparando(${pedido.id})">
                        Empezar a Preparar
                    </button>
                    
                    <!-- Botón para cambiar a "listo" (para entregar) -->
                    <button onclick="cambiarEstadoListo(${pedido.id})">
                        Marcar como Listo
                    </button>
                `;

                // Insertamos el nuevo div al final del contenedor principal
                contenedorPedidosChef.appendChild(divPedido);
            });
        } else {
            console.warn('No se encontró el contenedor con id="chef-pedidos" en el HTML.');
        }

    } catch (error) {
        console.error('Hubo un error de red al obtener los pedidos del chef:', error);
    }
}

/**
 * Función para actualizar el estado del pedido a "preparando".
 * Se expone en el ámbito global (window) para que el evento 'onclick'
 * declarado en el HTML pueda encontrarla y ejecutarla sin problemas.
 * 
 * @param {number} idPedido - El identificador numérico del pedido a actualizar.
 */
window.cambiarEstadoPreparando = async function (idPedido) {
    try {
        // 1. Configuramos las opciones de la petición PUT (método, cabeceras y cuerpo)
        const opciones = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            // 2. Enviamos el ID en formato JSON, según lo requerido por la API
            body: JSON.stringify({ id: idPedido })
        };

        // 3. Realizamos la petición al endpoint /preparando
        const respuesta = await fetch(`${URL_BASE}/preparando`, opciones);

        if (respuesta.ok) {
            console.log(`El pedido #${idPedido} ha pasado al estado: Preparando.`);

            // 4. Volvemos a solicitar y dibujar la lista de pedidos 
            // para que los cambios se reflejen de inmediato en la pantalla.
            obtenerPedidosChef();
        } else {
            console.error('Error desde el servidor al actualizar a "preparando"');
        }
    } catch (error) {
        console.error('Error de conexión al actualizar el pedido:', error);
    }
}

/**
 * Función para actualizar el estado del pedido a "listo" (para entregar al mesero).
 * Al igual que la anterior, se guarda en el objeto global "window".
 * 
 * @param {number} idPedido - El identificador del pedido.
 */
window.cambiarEstadoListo = async function (idPedido) {
    try {
        const opciones = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: idPedido })
        };

        // Llamamos al endpoint /listo
        const respuesta = await fetch(`${URL_BASE}/listo`, opciones);

        if (respuesta.ok) {
            console.log(`El pedido #${idPedido} ahora está Listo.`);

            // Refrescamos la vista llamando nuevamente a la función principal
            obtenerPedidosChef();
        } else {
            console.error('Error desde el servidor al actualizar a "listo"');
        }
    } catch (error) {
        console.error('Error de conexión al actualizar el pedido:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    obtenerPedidosChef();
});
