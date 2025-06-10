const pool = require('../db');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    // res.json({ message :'esta  es la ruta de usuarios'});
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Error en el servidor');
    }
})

router.post('/', async (req, res) => {
    const { nombre, apellido, dni, celular, direccion, fecha_alquiler, fecha_devolucion, dias } = req.body;

    if (!nombre || !apellido || !dni) {
        res.status(400).send('Todos los campos son obligatorios');
    }

    const dniParsed = parseInt(dni, 10);
    const diasParsed = parseInt(dias, 10);

    if (isNaN(dniParsed) || isNaN(diasParsed)) {
        return res.status(400).json({ error: 'DNI y días deben ser números válidos' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO clientes (nombre, apellido, dni, celular, direccion, fecha_alquiler, fecha_devolucion, dias) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
            [nombre, apellido, dniParsed, celular, direccion, fecha_alquiler, fecha_devolucion, diasParsed]
        );
        res.status(201).json({
            message: "Cliente registrado exitosamente",
            cliente: result.rows[0]
        });
        // res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al insertar el cliente', err.message);
        res.status(500).send('Error en el servidor');
    }
})

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const field = req.body;

    if (Object.keys(field).length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    const keys = Object.keys(field);
    const values = Object.values(field);

    const setQuery = keys.map((key, index) => `${key} = $${index + 1}`).join(', '); 

    try {
        const result = await pool.query(
            `UPDATE clientes SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        ); 

        if (result.rows.length=== 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });

        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar cliente', err.message);
        res.status(500).send('Error en el servidor');
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
    
        if (result.rows.length=== 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });

        }
        res.json({ message: 'Cliente eliminado', cliente: result.rows[0] });
    } catch (err) {
        console.error('Error al eliminar cliente', err.message);
        res.status(500).send('Error en el servidor');
    }
})

module.exports = router;