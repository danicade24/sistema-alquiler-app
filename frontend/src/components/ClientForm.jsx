import { useEffect, useState } from "react";

function ClientForm() {
    const currentDay = new Date().toISOString().split('T')[0];  //dara el formato 'yyyy-MM-dd'
    
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dni, setDni] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [rentalAddress, setRentalAddress] = useState("");
    const [days, setDays] = useState("");
    const [rentalDate, setRentalDate] = useState(currentDay);
    const [returnDate, setReturnDate] = useState("");

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const client = {
            nombre: name,
            apellido: lastName,
            dni: dni,
            celular: cellphone,
            direccion: rentalAddress,
            fecha_alquiler: rentalDate,
            fecha_devolucion: returnDate,
            dias: parseInt(days),
        };

        try {
            //conectamos con el backend
            const response = await fetch("http://localhost:5000/api/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(client),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error del servidor");
            }

            alert(data.message);

            // limpiamos el formulario
            setName("");
            setLastName("");
            setDni("");
            setCellphone("");
            setRentalAddress("");
            setDays("");
            setRentalDate(currentDay);
            setReturnDate("");
        } catch (error) {
            console.error("Error al crear el cliente:", error);
            alert("Error al crear el cliente");
        }
    }

    //se usa para calcular la fecha de devolucion
    useEffect(() => {
        if (days && rentalDate) {
            const date = new Date(rentalDate);
            date.setDate(date.getDate() + parseInt(days));
            setReturnDate(date.toISOString().split('T')[0]);
        }
    }, [days, rentalDate]);

    return (
        <form className="client-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>
                    Nombre
                </label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
            <label>
                Apellido
            </label>
                <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>
                    DNI
                </label>
                    <input id="dni" type="text" value={dni} onChange={(e) => setDni(e.target.value)} />
            </div>
            <div className="form-group">
                <label>
                    Celular 
                </label>
                    <input id="cellphone" type="tel" value={cellphone} onChange={(e) => setCellphone(e.target.value)} />
            </div>
            {/* <div className="form-group vertical">
                <label htmlFor="direccion">
                    Dirección de Alquiler: 
                    <textarea id="direccion" rows="2" value={direccionAlquiler} onChange={(e) => setDireccionAlquiler(e.target.value)} />
                </label>
            </div> */}
            <div className="form-group">
                <label>
                    Dirección de Alquilar 
                </label>
                    <input id="rentalAddress" type="text" value={rentalAddress} onChange={(e) => setRentalAddress(e.target.value)} />
            </div>
            <div className="form-group">
                <label>
                    Días a alquilar
                </label>
                    <input id="days" type="number" value={days} onChange={(e) => setDays(e.target.value)} />
            </div>
            <div className="form-group">
                <label>
                    Fecha de Alquiler
                </label>
                    <input id="rentalDate" type="date" value={rentalDate} onChange={(e) => setRentalDate(e.target.value)} />
            </div>
            <div className="form-group">
                <label>
                    Fecha de Devolucion
                </label>
                    <input id="returnDate" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} readOnly/>
            </div>
            <button type="submit">Registrar</button>
        </form>
    )
}

export default ClientForm