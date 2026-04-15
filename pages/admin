import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminVesta() {
  const [estilos, setEstilos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    const { data } = await supabase.from('estilos').select('*');
    setEstilos(data || []);
    setLoading(false);
  }

  const agregarEstilo = () => {
    const nuevo = {
      id: Date.now(),
      nombre: "Nuevo Estilo",
      foto_portada: "",
      prendas: [{ id: 1, nombre: "Prenda 1", precio: 0, moneda: "USD", stock: { S:0, M:0, L:0, XL:0 }, foto: "" }]
    };
    setEstilos([...estilos, nuevo]);
  };

  const guardarEnNube = async () => {
    setLoading(true);
    // Borramos lo anterior y guardamos lo nuevo (simplificado)
    await supabase.from('estilos').delete().neq('id', 0); 
    await supabase.from('estilos').insert(estilos);
    alert("¡Inventario actualizado globalmente!");
    setLoading(false);
  };

  if (loading) return <p>Cargando panel maestro...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>VESTA Admin</h1>
        <button onClick={guardarEnNube} style={{ backgroundColor: '#0070f3', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>
          PUBLICAR CAMBIOS
        </button>
      </header>

      <button onClick={agregarEstilo} style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '10px', border: '2px dashed #ccc', background: 'none' }}>
        + Crear Nuevo Estilo (Tendencia)
      </button>

      {estilos.map((estilo, idx) => (
        <div key={estilo.id} style={{ background: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <input 
            style={{ fontSize: '20px', fontWeight: 'bold', border: 'none', width: '100%', marginBottom: '10px' }}
            value={estilo.nombre}
            onChange={(e) => {
              const copia = [...estilos];
              copia[idx].nombre = e.target.value;
              setEstilos(copia);
            }}
          />
          
          <label style={{ fontSize: '12px', color: '#888' }}>URL Foto Portada:</label>
          <input 
            style={{ width: '100%', padding: '8px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #eee' }}
            value={estilo.foto_portada}
            onChange={(e) => {
              const copia = [...estilos];
              copia[idx].foto_portada = e.target.value;
              setEstilos(copia);
            }}
          />

          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Prendas y Stock:</h3>
          {estilo.prendas.map((prenda, pIdx) => (
            <div key={prenda.id} style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input placeholder="Nombre prenda" value={prenda.nombre} onChange={(e) => {
                  const copia = [...estilos];
                  copia[idx].prendas[pIdx].nombre = e.target.value;
                  setEstilos(copia);
                }} />
                <input placeholder="Precio" type="number" value={prenda.precio} onChange={(e) => {
                  const copia = [...estilos];
                  copia[idx].prendas[pIdx].precio = e.target.value;
                  setEstilos(copia);
                }} />
                <select value={prenda.moneda} onChange={(e) => {
                  const copia = [...estilos];
                  copia[idx].prendas[pIdx].moneda = e.target.value;
                  setEstilos(copia);
                }}>
                  <option value="USD">USD</option>
                  <option value="PEN">PEN</option>
                  <option value="MXN">MXN</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {['S', 'M', 'L', 'XL'].map(talla => (
                  <div key={talla} style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{talla}</span>
                    <input 
                      type="number" 
                      style={{ width: '40px', display: 'block', textAlign: 'center' }} 
                      value={prenda.stock[talla]} 
                      onChange={(e) => {
                        const copia = [...estilos];
                        copia[idx].prendas[pIdx].stock[talla] = parseInt(e.target.value);
                        setEstilos(copia);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => {
             const copia = [...estilos];
             copia[idx].prendas.push({ id: Date.now(), nombre: "Nueva Prenda", precio: 0, moneda: "USD", stock: {S:0, M:0, L:0, XL:0}, foto: "" });
             setEstilos(copia);
          }} style={{ fontSize: '12px', color: '#0070f3', background: 'none', border: 'none' }}>+ Añadir otra prenda a este estilo</button>
        </div>
      ))}
    </div>
  );
}
