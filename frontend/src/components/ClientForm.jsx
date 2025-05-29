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

    
    const handleSubmit = (e) => {
        e.preventDefault();

        const client = {
            name,
            lastName,
            dni,
            cellphone,
            rentalAddress,
            days,
            rentalDate,
            returnDate
        };
        console.log("Cliente registrado: ", client);
        alert("Cliente registrado");
    }

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
                    Nombre:
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
            </div>
            <div className="form-group">
            <label>
                Apellido: 
                <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
            </div>
            <div className="form-group">
                <label>
                    DNI: 
                    <input id="dni" type="text" value={dni} onChange={(e) => setDni(e.target.value)} />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Celular: 
                    <input id="cellphone" type="tel" value={cellphone} onChange={(e) => setCellphone(e.target.value)} />
                </label>
            </div>
            {/* <div className="form-group vertical">
                <label htmlFor="direccion">
                    Dirección de Alquiler: 
                    <textarea id="direccion" rows="2" value={direccionAlquiler} onChange={(e) => setDireccionAlquiler(e.target.value)} />
                </label>
            </div> */}
            <div className="form-group">
                <label>
                    Dirección de Alquiler: 
                    <input id="rentalAddress" type="text" value={rentalAddress} onChange={(e) => setRentalAddress(e.target.value)} />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Días a alquilar: 
                    <input id="days" type="number" value={days} onChange={(e) => setDays(e.target.value)} />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Fecha de Alquiler:
                    <input id="rentalDate" type="date" value={rentalDate} onChange={(e) => setRentalDate(e.target.value)} />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Fecha de Devolucion:
                    <input id="returnDate" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} readOnly/>
                </label>
            </div>
            <button type="submit">Registrar</button>
        </form>
    )
}

export default ClientForm