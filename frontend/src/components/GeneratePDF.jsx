import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function GeneratePDF() {
  const { id } = useParams();
  // const [client, setClient] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clientes/${id}`);
        if(!response.ok){
            throw new Error('Error al obtener los clientes');
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
        console.error("Error al cargar el cliente", err);
      }
    };

    fetchClient();
  }, [id]);

  useEffect(() => {
    if (client) {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("CONTRATO DE ALQUILER", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
      doc.text(`Cliente: ${client.nombre} ${client.apellido}`, 20, 50);
      doc.text(`DNI: ${client.dni}`, 20, 60);
      doc.text(`Teléfono: ${client.celular}`, 20, 70);
      doc.text(`Dirección: ${client.direccion}`, 20, 80);
      doc.text(`Alquiler: ${client.fecha_alquiler}`, 20, 90);
      doc.text(`Devolución: ${client.fecha_devolucion}`, 20, 100);
      doc.text(`Días: ${client.dias}`, 20, 110);
      // Tabla de productos
        autoTable(doc, {
        startY: 120,
        head: [['Cantidad', 'Descripción', 'Precio/día', 'Subtotal']],
        body:  [[client.cantidad, client.descripcion, `S/. ${client.precio}`, `S/. ${client.cantidad * client.precio}`]],
        styles: { fontSize: 10 },
        });

        window.open(doc.output('bloburl'), '_blank');

    //   doc.save(`contrato_${client.nombre}.pdf`);

      setTimeout(() => {
        window.history.back(); // Vuelve atrás después de descargar
      }, 1000);
    }
  }, [client]);

  return <p>Generando contrato PDF...</p>;
}

export default GeneratePDF;


// // Tabla de productos
//     autoTable(doc, {
//       startY: 90,
//       head: [['Cantidad', 'Descripción', 'Precio/día', 'Subtotal']],
//       body: datos.productos.map(item => [
//         item.cantidad,
//         item.descripcion,
//         `S/. ${item.precio}`,
//         `S/. ${item.cantidad * item.precio}`
//       ]),
//       styles: { fontSize: 10 },
//     });