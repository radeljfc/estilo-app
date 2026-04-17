import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminVesta() {
  const [estilos, setEstilos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => { 
    if (isAuthenticated) cargarDatos(); 
  }, [isAuthenticated]);

  async function cargarDatos() {
    setLoading(true);
    const { data, error } = await supabase.from('estilos').select('*');
    if (error) console.error(error);
    setEstilos(data || []);
    setLoading(false);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    // Compara con la variable que configuraremos en Vercel
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "vesta2026"; 
    
    if (passwordInput === adminPass) {
      setIsAuthenticated(true);
    } else {
      alert("Contraseña incorrecta. Acceso denegado.");
    }
  };

  const agregarEstilo = () => {
    const nuevo = {
      nombre: "Nueva Tendencia",
      foto_portada: "",
      prendas: [{ id: Date.now(), nombre: "Producto 1", precio: 0, moneda: "USD", stock: { S:0, M:0, L:0, XL:0 } }]
    };
    setEstilos([...estilos, nuevo]);
  };

  const guardarEnNube = async () => {
    setLoading(true);
    try {
      const estilosLimpios = estilos.map(({ id, ...resto }) => resto);
      await supabase.from('estilos').delete().neq('nombre', 'borrar_todo_si_existe');
      const { error } = await supabase.from('estilos').insert(estilosLimpios);
      if (error) throw error;
      alert("✅ ¡Inventario VESTA actualizado!");
      cargarDatos();
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PANTALLA DE ACCESO (LOGIN) ---
  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff', fontFamily: 'system-ui' }}>
        <h1 style={{ letterSpacing: '5px', marginBottom: '30px' }}>VESTA ADMIN</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '280px' }}>
          <input 
            type="password" 
            placeholder="Contraseña Maestra"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: '15px', borderRadius: '10px', border: 'none', marginBottom: '15px', textAlign: 'center', fontSize: '16px' }}
          />
          <button type="submit" style={{ padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
            ENTRAR
          </button>
        </form>
      </div>
    );
  }

  // --- PANEL MAESTRO (SOLO SE VE SI ESTÁ AUTENTICADO) ---
  if (loading && isAuthenticated) return <div style={{padding: '50px', textAlign: 'center'}}>Conectando con el servidor VESTA...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', backgroundColor: '#f9f9f9', minHeight: '100vh', color: '#000' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Panel Maestro</h1>
        <button onClick={guardarEnNube} style={{ backgroundColor: '#0070f3', color: '#fff', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>
          PUBLICAR CAMBIOS
        </button>
      </header>

      <button onClick={agregarEstilo} style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '12px', border: '2px dashed #0070f3', background: '#fff', color: '#0070f3', fontWeight: 'bold' }}>
        + Crear Nuevo Estilo
      </button>

      {estilos.map((estilo, idx) => (
        <div key={idx} style={{ background: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>NOMBRE DE LA TENDENCIA:</label>
            <input 
              style={{ fontSize: '18px', fontWeight: 'bold', border: '1px solid #eee', width: '100%', padding: '10px', borderRadius: '8px', marginTop: '5px' }}
              value={estilo.nombre}
              onChange={(e) => {
                const copia = [...estilos];
                copia[idx].nombre = e.target.value;
                setEstilos(copia);
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>URL IMAGEN DE PORTADA:</label>
            <input 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #eee', marginTop: '5px' }}
              value={estilo.foto_portada}
              onChange={(e) => {
                const copia = [...estilos];
                copia[idx].foto_portada = e.target.value;
                setEstilos(copia);
              }}
            />
          </div>

          <div style={{display:'flex', justifyContent:'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '15px'}}>
             <p style={{fontSize: '13px', color: '#666'}}>{estilo.prendas?.length || 0} prendas en este estilo</p>
             <button onClick={() => setEstilos(estilos.filter((_, i) => i !== idx))} style={{ color: 'red', background: 'none', border: 'none' }}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
