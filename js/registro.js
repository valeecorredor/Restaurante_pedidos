document.addEventListener('DOMContentLoaded', () => {
    const btnGuardar = document.querySelector('.btn-guardar');

    btnGuardar.addEventListener('click', async () => {
        const user = document.getElementById('user').value.trim();
        const name = document.getElementById('name').value.trim();
        const rol = document.getElementById('rol').value;
        const password = document.getElementById('password').value.trim();

        if (!user || !name || !rol || !password) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        const nuevoUsuario = {
            user,
            name,
            rol,
            password
        };

        try {
            // Asumiendo que la ruta de registro es /register según convenciones
            const response = await fetch('http://localhost:3005/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoUsuario)
            });

            if (response.ok) {
                alert('Usuario registrado con éxito. Puedes iniciar sesión ahora.');
                window.location.href = 'login.html';
            } else {
                const data = await response.json();
                alert(`Error al registrar: ${data.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Error de conexión con el backend.');
        }
    });
});
