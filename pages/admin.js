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
    // Clave configurada en Vercel o vesta2026 por defecto
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "vesta2026"; 
    
    if (passwordInput === adminPass) {
      setIsAuthenticated(true);
    } else {
      alert("Contraseña incorrecta.");
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
      // Mantenemos la eliminación del ID para que Supabase lo cree solo
      const estilosLimpios = estilos.map(({ id, ...resto }) => resto);

      await supabase.from('estilos').delete().neq('nombre', 'borrar_todo_si_existe');
      const { error } = await supabase.from('estilos').insert(estilosLimpios);
      
      if (error) throw error;
      alert("✅ ¡Inventario VESTA actualizado con éxito!");
      cargarDatos();
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PANTALLA DE ACCESO (FONDO BLANCO) ---
  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', color: '#000', fontFamily: 'system-ui' }}>
        <h1 style={{ fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>VESTA MASTER</h1>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '30px', textTransform: 'uppercase' }}>Acceso Restringido</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '280px' }}>
          <input 
            type="password" 
            placeholder="Contraseña Maestra"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: '15px', borderRadius: '12px', border: '1px solid #000', marginBottom: '15px', textAlign: 'center', fontSize: '16px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#000', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            ENTRAR AL PANEL
          </button>
        </form>
      </div>
    );
  }

  // --- PANEL DE ADMINISTRACIÓN ---
  if (loading && isAuthenticated) return <div style={{padding: '50px', textAlign: 'center', color: '#000', fontFamily: 'system-ui'}}>Sincronizando con VESTA Master...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', backgroundColor: '#f9f9f9', minHeight: '100vh', color: '#000' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Panel Maestro</h1>
        <button onClick={guardarEnNube} style={{ backgroundColor: '#0070f3', color: '#fff', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? "Guardando..." : "PUBLICAR CAMBIOS"}
        </button>
      </header>

      <button onClick={agregarEstilo} style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '12px', border: '2px dashed #0070f3', background: '#fff', color: '#0070f3', fontWeight: 'bold', cursor: 'pointer' }}>
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
              placeholder="https://images.unsplash.com/..."
              onChange={(e) => {
                const copia = [...estilos];
                copia[idx].foto_portada = e.target.value;
                setEstilos(copia);
              }}
            />
          </div>

          <h3 style={{ fontSize: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '15px', marginBottom: '15px' }}>Inventario de Prendas:</h3>
          {estilo.prendas && estilo.prendas.map((prenda, pIdx) => (
            <div key={pIdx} style={{ padding: '15px', backgroundColor: '#fcfcfc', borderRadius: '12px', marginBottom: '15px', border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <input placeholder="Nombre" value={prenda.nombre} style={{padding:'8px'}} onChange={(e) => {
                  const copia = [...estilos];
                  copia[idx].prendas[pIdx].nombre = e.target.value;
                  setEstilos(copia);
                }} />
                <input placeholder="Precio" type="number" value={prenda.precio} style={{padding:'8px'}} onChange={(e) => {
                  const copia = [...estilos];
                  copia[idx].prendas[pIdx].precio = e.target.value;
                  setEstilos(copia);
                }} />
                <select value={prenda.moneda} style={{padding:'8px'}} onChange={(e) => {
                  const copia = [...estilos];
                  copia[idx].prendas[pIdx].moneda = e.target.value;
                  setEstilos(copia);
                }}>
                  <option value="USD">USD</option>
                  <option value="PEN">PEN</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fff', padding: '10px', borderRadius: '8px' }}>
                {['S', 'M', 'L', 'XL'].map(talla => (
                  <div key={talla} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>{talla}</div>
                    <input 
                      type="number" 
                      style={{ width: '45px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '4px' }} 
                      value={prenda.stock[talla]} 
                      onChange={(e) => {
                        const copia = [...estilos];
                        copia[idx].prendas[pIdx].stock[talla] = parseInt(e.target.value) || 0;
                        setEstilos(copia);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div style={{display:'flex', justifyContent:'space-between', marginTop: '10px'}}>
            <button onClick={() => {
               const copia = [...estilos];
               if(!copia[idx].prendas) copia[idx].prendas = [];
               copia[idx].prendas.push({ id: Date.now(), nombre: "Nueva Prenda", precio: 0, moneda: "USD", stock: {S:0, M:0, L:0, XL:0} });
               setEstilos(copia);
            }} style={{ fontSize: '13px', color: '#0070f3', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+ Añadir Prenda</button>
            
            <button onClick={() => {
               setEstilos(estilos.filter((_, i) => i !== idx));
            }} style={{ fontSize: '13px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar Estilo</button>
          </div>
        </div>
      ))}
    </div>
  );
}
