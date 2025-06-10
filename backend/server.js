const express = require('express');
const clientsRoutes = require('./routes/clientsRoutes');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

//middleware para manejar json
app.use(express.json());

//usar para las rutas
app.use('/api/clientes', clientsRoutes);

// agregamos ruta ed prueba
app.get('/', (req, res) => {
    res.send('Backend en funcionamiento');
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
