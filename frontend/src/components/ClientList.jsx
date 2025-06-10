import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function ClientList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);   //maneja estado de carga
    const [error, setError] = useState(null);

    useEffect(() =>{
        const fetchClients = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/clientes");
                if(!response.ok){
                    throw new Error('Error al obtener los clientes');
                }
                const data = await response.json();
                // Convertir las fechas antes de actualizar el estado
                const updatedClients = data.map(client => {
                    return {
                        ...client,
                        fecha_alquiler: new Date(client.fecha_alquiler).toISOString().split('T')[0],
                        fecha_devolucion: new Date(client.fecha_devolucion).toISOString().split('T')[0]
                    };
                });
                setClients(updatedClients);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching clientes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    if (loading) {
        return <p>Cargando clientes...</p>;
    }
    if (error) {
        return <p>Error al obtener los clientes: {error}</p>;
    }

    const handleEditar = (id) => {
        navigate(`/editar-cliente/${id}`);
    }

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                await fetch(`http://localhost:5000/api/clientes/${id}`, {
                    method: 'DELETE',
                });
                setClients(clients.filter(client => client.id !== id));
            } catch (err) {
                console.error('Error al eliminar el cliente', err);
            }
        }
    };

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Teléfono</th>
                        <th>Dirección de Alquiler</th>
                        <th>Día de Alquiler</th>
                        <th>Día de Devolución</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => ( 
                        <tr key={client.id}>
                            <td>{client.id}</td>
                            <td>{client.nombre}</td>
                            <td>{client.dni}</td>
                            <td>{client.celular}</td>
                            <td>{client.direccion}</td>
                            <td>{client.fecha_alquiler}</td>
                            <td>{client.fecha_devolucion}</td>
                            <td>
                                <button className="btn btn-link text-primary me-2"
                                    onClick={() => handleEditar(client.id)}
                                    title="Editar"
                                >
                                    <FontAwesomeIcon icon={faEdit} /> 
                                </button>
                                <button className="btn btn-link text-danger"
                                    onClick={() => handleEliminar(client.id)}
                                    title="Eliminar"
                                    >
                                    <FontAwesomeIcon icon={faTrashAlt} /> 
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClientList;