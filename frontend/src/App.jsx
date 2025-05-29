import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import ClientForm from './components/ClientForm'
import ClientList from './components/ClientList'

function App() {
  return (
    <BrowserRouter>
    <>
    <div>
      <nav style={{ marginBottom: "5rem", display: "flex", justifyContent: "space-between"}}>
        <Link to="/">Home</Link>
        <Link to="/form">Registrar Cliente</Link>
        <Link to="/list">Lista de Clientes</Link>
      </nav>
    </div>
      <Routes>
        <Route path="/" element={
          <>
            <h1>Home</h1>
              <h2>Bienvendio a la aplicación</h2>
                <p>Esta es la página de inicio</p>
          </>
        } />
        <Route path="/form" element={
          <>
            <h1>Registrar Cliente</h1>
            <ClientForm />
          </>
        } />
        <Route path="/list" element={
          <>
            <h1>Lista de Clientes</h1>
            <ClientList />
          </>
        } />
      </Routes>
    </>
    </BrowserRouter>
  );
}

export default App
