import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ClientEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        celular: '',
        direccion: '',
        fecha_alquiler: '',
        fecha_devolucion: '',
        dias: '',
        cantidad_cuerpos: '',
        precio_por_dia: '',
        descripcion: '',
        ruedas: '',
        tablas_extra: '',
        observaciones: ''
    });

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/clientes/${id}`);
                if (!response.ok) throw new Error('Error al obtener el cliente');
                const data = await response.json();

                const c = data.cliente;

                setClient({
                    nombre: c.nombre,
                    apellido: c.apellido,
                    dni: c.dni,
                    celular: c.telefono,
                    direccion: c.direccion,
                    fecha_alquiler: c.fecha_alquiler.split('T')[0],
                    fecha_devolucion: c.fecha_devolucion.split('T')[0],
                    dias: c.dias,
                    cantidad_cuerpos: c.cantidad_cuerpos,
                    precio_por_dia: c.precio_por_dia,
                    descripcion: c.descripcion || '',
                    ruedas: c.ruedas || '',
                    tablas_extra: c.tablas_extra || '',
                    observaciones: c.observaciones || ''
                });
            } catch (err) {
                console.error('Error al obtener el cliente', err);
            }
        };

        fetchClient();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/clientes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(client)
            });
            if (!response.ok) throw new Error('Error al editar el cliente');
            navigate('/list');
        } catch (err) {
            console.error('Error al editar el cliente', err);
        }
    };

    return (
        <form className="client-form" onSubmit={handleSubmit}>
            <h2>Editar Cliente</h2>

            {/* DATOS DEL CLIENTE */}
            <div className="form-group">
                <label>Nombre</label>
                <input name="nombre" value={client.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Apellido</label>
                <input name="apellido" value={client.apellido} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>DNI</label>
                <input name="dni" value={client.dni} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Celular</label>
                <input name="celular" value={client.celular} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Dirección de Alquiler</label>
                <input name="direccion" value={client.direccion} onChange={handleChange} required />
            </div>

            {/* DATOS DEL ALQUILER */}
            <h3>Datos del Alquiler</h3>

            <div className="form-group">
                <label>Días</label>
                <input type="number" name="dias" value={client.dias} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Fecha de Alquiler</label>
                <input type="date" name="fecha_alquiler" value={client.fecha_alquiler} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Fecha de Devolución</label>
                <input type="date" name="fecha_devolucion" value={client.fecha_devolucion} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Cantidad de Cuerpos</label>
                <input type="number" name="cantidad_cuerpos" value={client.cantidad_cuerpos} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Precio por Día</label>
                <input type="number" name="precio_por_dia" value={client.precio_por_dia} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Descripción</label>
                <textarea name="descripcion" value={client.descripcion} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Ruedas</label>
                <input name="ruedas" value={client.ruedas} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Tablas Extra</label>
                <input name="tablas_extra" value={client.tablas_extra} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Observaciones</label>
                <textarea name="observaciones" value={client.observaciones} onChange={handleChange} />
            </div>

            <button type="submit">Guardar Cambios</button>
        </form>
    );
}

export default ClientEdit;
