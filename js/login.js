document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.querySelector('.btn-iniciar');

    btnIniciar.addEventListener('click', async () => {
        const user = document.getElementById('user').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!user || !password) {
            alert('Por favor, ingresa tu usuario y contraseña.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3005/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Asumimos que el backend retorna el rol del usuario en caso de éxito
                alert('Inicio de sesión exitoso');
                
                // Guardamos el usuario o estado en localStorage si es necesario
                localStorage.setItem('currentUser', user);
                localStorage.setItem('currentRole', data.user.rol || 'mesero');

                // Redirección según rol (Ajustar si el backend envía el rol con otro nombre)
                const rol = (data.user.rol || '').toLowerCase();
                if (rol === 'cajero') {
                    window.location.href = 'cajero.html';
                } else if (rol === 'chef') {
                    window.location.href = 'chef.html';
                } else {
                    // Por defecto o mesero
                    window.location.href = 'mesero.html';
                }
            } else {
                alert(`Error en el login: ${data.message || 'Credenciales incorrectas'}`);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Error al conectar con el servidor. Verifica que el backend esté en ejecución.');
        }
    });
});
