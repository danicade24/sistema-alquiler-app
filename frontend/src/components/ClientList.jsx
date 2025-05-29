import { useEffect, useState } from "react";

function ClientList() {
    const [clients, setClients] = useState([]);

    useEffect(() =>{
        const simulatedData = [
            { id: 1, name: "Juan", dni: "12345678", cellphone: "987654321", rentalAddress: "Calle 123", rentalDay: "2022-01-01", returnDay: "2022-01-05" },
            { id: 2, name: "Ana", dni: "87654321", cellphone: "912345678" , rentalAddress: "Calle 456", rentalDay: "2022-01-02", returnDay: "2022-01-06" },
        ];
        setClients(simulatedData);
    }, []);

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
                            <td>{client.name}</td>
                            <td>{client.dni}</td>
                            <td>{client.cellphone}</td>
                            <td>{client.rentalAddress}</td>
                            <td>{client.rentalDay}</td>
                            <td>{client.returnDay}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClientList;