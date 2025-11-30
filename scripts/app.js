// scripts/app.js
class UserManager {
    constructor() {
        this.users = [];
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUsers();
    }

    bindEvents() {
        document.getElementById('user-form').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancel-btn').addEventListener('click', () => this.cancelEdit());
        document.getElementById('search-btn').addEventListener('click', () => this.searchUsers());
        document.getElementById('clear-search').addEventListener('click', () => this.clearSearch());
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchUsers();
        });
        document.getElementById('confirm-delete').addEventListener('click', () => this.confirmDelete());
        document.getElementById('cancel-delete').addEventListener('click', () => this.hideModal());
        
        // Cerrar modal haciendo click fuera
        document.getElementById('confirm-modal').addEventListener('click', (e) => {
            if (e.target.id === 'confirm-modal') {
                this.hideModal();
            }
        });
    }

    async loadUsers() {
        try {
            // Simulando llamada a la API
            const response = await fetch('/api/usuarios');
            this.users = await response.json();
            this.renderTable();
        } catch (error) {
            console.error('Error cargando usuarios:', error);
            // Datos de ejemplo para demo
            this.users = [
                { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123456789', edad: 30 },
                { id: 2, nombre: 'María García', email: 'maria@email.com', telefono: '987654321', edad: 25 },
                { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', telefono: '555555555', edad: 35 }
            ];
            this.renderTable();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            edad: parseInt(formData.get('edad')) || null
        };

        try {
            if (this.currentEditId) {
                // Actualizar usuario existente
                await this.updateUser(this.currentEditId, userData);
            } else {
                // Crear nuevo usuario
                await this.createUser(userData);
            }
            
            this.resetForm();
            this.loadUsers();
        } catch (error) {
            console.error('Error guardando usuario:', error);
            alert('Error al guardar el usuario');
        }
    }

    async createUser(userData) {
        // Simulando llamada a la API
        const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        const newUser = { id: newId, ...userData };
        this.users.push(newUser);
        
        // En una aplicación real:
        // const response = await fetch('/api/usuarios', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(userData)
        // });
        // return await response.json();
    }

    async updateUser(id, userData) {
        // Simulando llamada a la API
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...userData };
        }
        
        // En una aplicación real:
        // const response = await fetch(`/api/usuarios/${id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(userData)
        // });
        // return await response.json();
    }

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            document.getElementById('user-id').value = user.id;
            document.getElementById('nombre').value = user.nombre;
            document.getElementById('email').value = user.email;
            document.getElementById('telefono').value = user.telefono || '';
            document.getElementById('edad').value = user.edad || '';
            
            document.getElementById('form-title').textContent = 'Editar Usuario';
            document.getElementById('submit-btn').textContent = 'Actualizar';
            document.getElementById('cancel-btn').style.display = 'inline-block';
            
            this.currentEditId = id;
            
            // Scroll al formulario
            document.querySelector('.form-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }

    cancelEdit() {
        this.resetForm();
    }

    resetForm() {
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('form-title').textContent = 'Agregar Nuevo Usuario';
        document.getElementById('submit-btn').textContent = 'Guardar';
        document.getElementById('cancel-btn').style.display = 'none';
        this.currentEditId = null;
    }

    showDeleteModal(id) {
        this.currentDeleteId = id;
        document.getElementById('confirm-modal').style.display = 'block';
    }

    hideModal() {
        document.getElementById('confirm-modal').style.display = 'none';
        this.currentDeleteId = null;
    }

    async confirmDelete() {
        if (this.currentDeleteId) {
            try {
                await this.deleteUser(this.currentDeleteId);
                this.loadUsers();
                this.hideModal();
            } catch (error) {
                console.error('Error eliminando usuario:', error);
                alert('Error al eliminar el usuario');
            }
        }
    }

    async deleteUser(id) {
        // Simulando llamada a la API
        this.users = this.users.filter(u => u.id !== id);
        
        // En una aplicación real:
        // await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    }

    searchUsers() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
        if (!searchTerm) {
            this.renderTable(this.users);
            return;
        }

        const filteredUsers = this.users.filter(user => 
            user.nombre.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.telefono && user.telefono.includes(searchTerm))
        );
        
        this.renderTable(filteredUsers);
    }

    clearSearch() {
        document.getElementById('search-input').value = '';
        this.renderTable(this.users);
    }

    renderTable(users = this.users) {
        const tbody = document.getElementById('users-tbody');
        const countElement = document.getElementById('table-count');
        
        tbody.innerHTML = '';
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No se encontraron usuarios</td></tr>';
            countElement.textContent = '0 usuarios encontrados';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td>${user.telefono || '-'}</td>
                <td>${user.edad || '-'}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="userManager.editUser(${user.id})">Editar</button>
                    <button class="action-btn delete-btn" onclick="userManager.showDeleteModal(${user.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        countElement.textContent = `${users.length} usuario(s) encontrado(s)`;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.userManager = new UserManager();
});