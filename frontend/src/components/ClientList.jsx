import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faFile } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function ClientList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/alquileres");
                if (!response.ok) {
                    throw new Error('Error al obtener los clientes con alquileres');
                }
                const data = await response.json();
                const updatedClients = data.map(client => ({
                    ...client,
                    fecha_alquiler: new Date(client.fecha_alquiler).toISOString().split('T')[0],
                    fecha_devolucion: new Date(client.fecha_devolucion).toISOString().split('T')[0],
                }));
                setClients(updatedClients);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching alquileres:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const handleEditar = (id) => {
        navigate(`/editar-cliente/${id}`);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                await fetch(`http://localhost:5000/api/clientes/${id}`, {
                    method: 'DELETE',
                });
                setClients(clients.filter(client => client.cliente_id !== id));
            } catch (err) {
                console.error('Error al eliminar el cliente', err);
            }
        }
    };

    const handleGenerarPDF = (id) => {
        navigate(`/generar-pdf/${id}`);
    };

    if (loading) return <p>Cargando clientes...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>F. Alquiler</th>
                        <th>F. Devolución</th>
                        <th>Cuerpos</th>
                        <th>Precio/Día</th>
                        <th>Descripción</th>
                        <th>Extras</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.alquiler_id}>
                            <td>{client.cliente_id}</td>
                            <td>{client.nombre}</td>
                            <td>{client.dni}</td>
                            <td>{client.telefono}</td>
                            <td>{client.direccion}</td>
                            <td>{client.fecha_alquiler}</td>
                            <td>{client.fecha_devolucion}</td>
                            <td>{client.cantidad_cuerpos}</td>
                            <td>S/ {client.precio_por_dia}</td>
                            <td>{client.descripcion}</td>
                            <td>
                                {client.ruedas && "Ruedas, "}
                                {client.tablas_extra && "Tablas Extra, "}
                                {client.marcos_extra && "Marcos Extra"}
                            </td>
                            <td>
                                <button className="btn btn-link text-primary me-2" onClick={() => handleEditar(client.cliente_id)} title="Editar">
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="btn btn-link text-danger me-2" onClick={() => handleEliminar(client.cliente_id)} title="Eliminar">
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                                <button className="btn btn-link text-success" onClick={() => handleGenerarPDF(client.cliente_id)} title="PDF">
                                    <FontAwesomeIcon icon={faFile} />
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
