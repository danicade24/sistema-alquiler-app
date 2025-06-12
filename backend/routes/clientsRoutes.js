const pool = require('../db');

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const client = req.body;

  const {
    nombre,
    apellido,
    dni,
    celular,
    direccion,
    fecha_alquiler,
    fecha_devolucion,
    dias,
    cantidad_cuerpos,
    precio_por_dia,
    descripcion,
    ruedas,
    tablas_extra,
    observaciones,
  } = client;

  const dniParsed = parseInt(dni, 10);
  const diasParsed = parseInt(dias, 10);

  if (isNaN(dniParsed) || isNaN(diasParsed)) {
        return res.status(400).json({ error: 'DNI y días deben ser números válidos' });
    }

  try {
    // 1. Insertar en tabla clientes
    const insertCliente = await pool.query(
      `INSERT INTO clientes (nombre, apellido, dni, celular, direccion)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [nombre, apellido, dni, celular, direccion]
    );

    const clienteId = insertCliente.rows[0].id;

    // 2. Insertar en detalle_alquiler
    await pool.query(
      `INSERT INTO detalle_alquiler (
        cliente_id, fecha_alquiler, fecha_devolucion, dias,
        cantidad_cuerpos, precio_por_dia, descripcion,
        ruedas, tablas_extra, observaciones
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        clienteId, fecha_alquiler, fecha_devolucion, dias,
        cantidad_cuerpos, precio_por_dia, descripcion,
        ruedas, tablas_extra, observaciones
      ]
    );

    res.status(201).json({ message: "Cliente y alquiler registrados correctamente." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al registrar el cliente y su alquiler");
  }
});


router.get('/alquileres', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id AS cliente_id,
        c.nombre,
        c.dni,
        c.celular AS telefono,
        c.direccion,
        a.fecha_alquiler,
        a.fecha_devolucion,
        a.id AS alquiler_id,
        a.cantidad_cuerpos, 
        a.precio_por_dia,
        a.descripcion, a.ruedas, 
        a.tablas_extra, 
        a.observaciones
      FROM clientes c
      JOIN detalle_alquiler a ON a.cliente_id = c.id
      ORDER BY a.fecha_alquiler DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});


// router.post('/', async (req, res) => {
//     const { nombre, apellido, dni, celular, direccion, fecha_alquiler, fecha_devolucion, dias } = req.body;

//     if (!nombre || !apellido || !dni) {
//         res.status(400).send('Todos los campos son obligatorios');
//     }

//     const dniParsed = parseInt(dni, 10);
//     const diasParsed = parseInt(dias, 10);

//     if (isNaN(dniParsed) || isNaN(diasParsed)) {
//         return res.status(400).json({ error: 'DNI y días deben ser números válidos' });
//     }

//     try {
//         const result = await pool.query(
//             'INSERT INTO clientes (nombre, apellido, dni, celular, direccion, fecha_alquiler, fecha_devolucion, dias) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
//             [nombre, apellido, dniParsed, celular, direccion, fecha_alquiler, fecha_devolucion, diasParsed]
//         );
//         res.status(201).json({
//             message: "Cliente registrado exitosamente",
//             cliente: result.rows[0]
//         });
//         // res.status(201).json(result.rows[0]);
//     } catch (err) {
//         console.error('Error al insertar el cliente', err.message);
//         res.status(500).send('Error en el servidor');
//     }
// })


router.get('/contrato/:alquilerId', async (req, res) => {
  const alquilerId = req.params.alquilerId;

  try {
    const result = await pool.query(`
      SELECT 
        c.nombre, c.apellido, c.dni, c.celular, c.direccion,
        a.fecha_alquiler, a.fecha_devolucion, a.dias,
        a.cantidad_cuerpos, a.precio_por_dia,
        a.descripcion, a.ruedas, a.tablas_extra, a.observaciones
      FROM detalle_alquiler a
      JOIN clientes c ON a.cliente_id = c.id
      WHERE a.id = $1
    `, [alquilerId]);

    if (result.rows.length === 0) {
      return res.status(404).send('Alquiler no encontrado');
    }

    const datosContrato = result.rows[0];

    // Aquí podés generar el PDF usando librerías como pdfkit, puppeteer, etc.
    // O enviar los datos al frontend para que el frontend genere el PDF.

    res.json(datosContrato);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});



router.patch('/:id', async (req, res) => {
  const clienteId = req.params.id;
  const {
    nombre,
    apellido,
    dni,
    celular,
    direccion,
    fecha_alquiler,
    fecha_devolucion,
    dias,
    cantidad_cuerpos,
    precio_por_dia,
    descripcion,
    ruedas,
    tablas_extra,
    observaciones
  } = req.body;

  try {
    // 1. Actualizar cliente
    await pool.query(
      `UPDATE clientes
       SET nombre = $1, apellido = $2, dni = $3, celular = $4, direccion = $5
       WHERE id = $6`,
      [nombre, apellido, dni, celular, direccion, clienteId]
    );

    // 2. Actualizar detalle_alquiler
    await pool.query(
      `UPDATE detalle_alquiler
       SET fecha_alquiler = $1, fecha_devolucion = $2, dias = $3,
           cantidad_cuerpos = $4, precio_por_dia = $5, descripcion = $6,
           ruedas = $7, tablas_extra = $8, observaciones = $9
       WHERE cliente_id = $10`,
      [
        fecha_alquiler, fecha_devolucion, dias,
        cantidad_cuerpos, precio_por_dia, descripcion,
        ruedas, tablas_extra, observaciones,
        clienteId
      ]
    );

    res.json({ message: 'Cliente y alquiler actualizados correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al actualizar los datos');
  }
});



router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
         if (result.rows.length=== 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });

        }
        res.json({ message: `Se extrayeron los datos del cliente ${id}`, cliente: result.rows[0] });
    } catch (err) {
        console.error('Error al actualizar el cliente', err.message);
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