import { useEffect, useState } from "react";

function ClientForm() {
    const currentDay = new Date().toISOString().split('T')[0];

    // Estados: Cliente
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dni, setDni] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [rentalAddress, setRentalAddress] = useState("");

    // Estados: Fechas
    const [days, setDays] = useState("");
    const [rentalDate, setRentalDate] = useState(currentDay);
    const [returnDate, setReturnDate] = useState("");

    // Estados: Detalle de alquiler
    const [cantidadCuerpos, setCantidadCuerpos] = useState("");
    const [precioPorDia, setPrecioPorDia] = useState(5);
    const [descripcion, setDescripcion] = useState("");
    const [ruedas, setRuedas] = useState(0);
    const [tablasExtra, setTablasExtra] = useState(0);
    const [observaciones, setObservaciones] = useState("");

    // Calcular fecha de devolución automáticamente
    useEffect(() => {
        if (days && rentalDate) {
            const date = new Date(rentalDate);
            date.setDate(date.getDate() + parseInt(days));
            setReturnDate(date.toISOString().split('T')[0]);
        }
    }, [days, rentalDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const client = {
            nombre: name,
            apellido: lastName,
            dni,
            celular: cellphone,
            direccion: rentalAddress,
            fecha_alquiler: rentalDate,
            fecha_devolucion: returnDate,
            dias: parseInt(days),
            cantidad_cuerpos: parseInt(cantidadCuerpos),
            precio_por_dia: parseFloat(precioPorDia) || 5,
            descripcion,
            ruedas: parseInt(ruedas) || 0,
            tablas_extra: parseInt(tablasExtra) || 0,
            observaciones,
        };

        try {
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

            alert(data.message || "Cliente registrado exitosamente");

            // Limpiar formulario
            setName("");
            setLastName("");
            setDni("");
            setCellphone("");
            setRentalAddress("");
            setDays("");
            setRentalDate(currentDay);
            setReturnDate("");
            setCantidadCuerpos("");
            setPrecioPorDia("");
            setDescripcion("");
            setRuedas("");
            setTablasExtra("");
            setObservaciones("");
        } catch (error) {
            console.error("Error al crear el cliente:", error);
            alert("Hubo un error al crear el cliente");
        }
    };

    return (
        <form className="client-form" onSubmit={handleSubmit}>
            <div className="form-title">
                <h3>Datos del Cliente</h3>
            </div>
            <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Apellido</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>DNI</label>
                <input type="text" value={dni} onChange={e => setDni(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Celular</label>
                <input type="tel" value={cellphone} onChange={e => setCellphone(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Dirección de Alquiler</label>
                <input type="text" value={rentalAddress} onChange={e => setRentalAddress(e.target.value)} required />
            </div>

            <div className="form-title">
                <h3>Fechas del Alquiler</h3>
            </div>

            <div className="form-group">
                <label>Días a Alquilar</label>
                <input type="number" value={days} onChange={e => setDays(e.target.value)} min="1" required />
            </div>
            <div className="form-group">
                <label>Fecha de Alquiler</label>
                <input type="date" value={rentalDate} onChange={e => setRentalDate(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Fecha de Devolución</label>
                <input type="date" value={returnDate} readOnly />
            </div>

            <div className="form-title">
                <h3>Detalle del Alquiler</h3>
            </div>
            <div className="form-group">
                <label>Cantidad de Cuerpos</label>
                <input type="number" value={cantidadCuerpos} onChange={e => setCantidadCuerpos(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Precio por Día</label>
                <input type="number" value={precioPorDia} onChange={e => setPrecioPorDia(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Descripción</label>
                {/* <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} /> */}
                <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Ruedas</label>
                <input type="number" value={ruedas} onChange={e => setRuedas(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Tablas Extra</label>
                <input type="number" value={tablasExtra} onChange={e => setTablasExtra(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Observaciones</label>
                {/* <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} /> */}
                <input type="text" value={observaciones} onChange={e => setObservaciones(e.target.value)} />
            </div>

            <button type="submit">Registrar</button>
        </form>
    );
}

export default ClientForm;