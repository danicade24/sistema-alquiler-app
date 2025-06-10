import { useEffect, useState } from "react";

function ClientList() {
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClientList;