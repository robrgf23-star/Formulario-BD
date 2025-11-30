// backend/routes/usuarios.js
const express = require('express');
const router = express.Router();

// Datos de ejemplo (en una app real usarías una BD)
let usuarios = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123456789', edad: 30 },
    { id: 2, nombre: 'María García', email: 'maria@email.com', telefono: '987654321', edad: 25 },
    { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', telefono: '555555555', edad: 35 }
];

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', (req, res) => {
    res.json(usuarios);
});

// POST /api/usuarios - Crear nuevo usuario
router.post('/', (req, res) => {
    const { nombre, email, telefono, edad } = req.body;
    
    // Validaciones básicas
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son obligatorios' });
    }

    // Verificar si el email ya existe
    if (usuarios.some(u => u.email === email)) {
        return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const nuevoUsuario = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        nombre,
        email,
        telefono: telefono || null,
        edad: edad || null
    };
    
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const { nombre, email, telefono, edad } = req.body;
    
    // Validaciones básicas
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son obligatorios' });
    }

    // Verificar si el email ya existe en otro usuario
    if (usuarios.some(u => u.email === email && u.id !== id)) {
        return res.status(400).json({ error: 'El email ya está registrado en otro usuario' });
    }
    
    usuarios[index] = { 
        ...usuarios[index], 
        nombre, 
        email, 
        telefono: telefono || null, 
        edad: edad || null 
    };
    
    res.json(usuarios[index]);
});

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    usuarios = usuarios.filter(u => u.id !== id);
    res.status(204).send();
});

module.exports = router;