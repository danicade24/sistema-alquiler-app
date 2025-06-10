import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
        dias: ''
    });

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/clientes/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener el cliente');
                }
                const data = await response.json();
                console.log(data);
                setClient({
                    nombre: data.cliente.nombre,
                    apellido: data.cliente.apellido,
                    dni: data.cliente.dni,
                    celular: data.cliente.celular,
                    direccion: data.cliente.direccion,
                    fecha_alquiler: data.cliente.fecha_alquiler.split('T')[0], // Formatea fecha si es necesario
                    fecha_devolucion: data.cliente.fecha_devolucion.split('T')[0],
                    dias: data.cliente.dias
                });
            } catch (err) {
                console.error('Error al obtener el cliente', err);
            }
        };
        fetchClient();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient( prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/clientes/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(client)
            });
            if (!response.ok) {
                throw new Error('Error al editar el cliente');
            }
            navigate('/list');
        } catch (err) {
            console.error('Error al editar el cliente', err);
        }
    };

    return (
       <form className="client-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="nombre" 
                        value={client.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Apellido</label>
                <input type="text" className="form-control" name="apellido" 
                        value={client.apellido} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">DNI</label>
                <input type="text" className="form-control" name="dni" 
                        value={client.dni} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Celular</label>
                <input type="text" className="form-control" name="celular" 
                        value={client.celular} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Dirección a Alquilar</label>
                <input type="text" className="form-control" name="direccion" 
                        value={client.direccion} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Dias a Alquilar</label>
                <input type="number" className="form-control" name="dias" 
                        value={client.dias} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Fecha de Alquiler</label>
                <input type="date" className="form-control" name="fecha_alquiler" 
                        value={client.fecha_alquiler} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Fecha de Devolución</label>
                <input id="returnDate" type="date" 
                    value={client.fecha_devolucion} onChange={handleChange} required />
            </div>
            <button type="submit">Guardar Cambios</button>
        </form>
    );
}

export default ClientEdit