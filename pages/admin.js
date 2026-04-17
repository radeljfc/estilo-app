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
      nombre: "Nueva Tendencia",
      foto_portada: "",
      prendas: [{ id: Date.now(), nombre: "Producto", precio: 0, moneda: "USD", stock: { S:0, M:0, L:0, XL:0 } }]
    };
    setEstilos([...estilos, nuevo]);
  };

  const guardarEnNube = async () => {
    setLoading(true);
    try {
      // LIMPIEZA DE DATOS ANTES DE ENVIAR
      const datosParaGuardar = estilos.map(est => {
        const { id, ...resto } = est; // Quitamos el ID para que Supabase lo cree solo
        return resto;
      });

      // 1. Borramos lo anterior
      await supabase.from('estilos').delete().neq('nombre', 'limpieza_total');
      
      // 2. Insertamos lo nuevo sin enviar IDs manuales
      const { error } = await supabase.from('estilos').insert(datosParaGuardar);
      
      if (error) throw error;
      alert("✅ ¡Cambios publicados con éxito!");
      cargarDatos(); // Recargamos para ver los nuevos IDs asignados
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center', color:'#000'}}>Sincronizando con VESTA Master...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', backgroundColor: '#fff', color: '#000', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '900' }}>VESTA ADMIN</h1>
        <button onClick={guardarEnNube} style={{ backgroundColor: '#000', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>
          PUBLICAR CAMBIOS
        </button>
      </header>

      <button onClick={agregarEstilo} style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '12px', border: '1px solid #000', background: 'none', fontWeight: 'bold' }}>
        + Crear Nuevo Estilo
      </button>

      {estilos.map((estilo, idx) => (
        <div key={idx} style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
          <input 
            style={{ fontSize: '18px', fontWeight: 'bold', width: '100%', border: 'none', marginBottom: '10px' }}
            value={estilo.nombre}
            onChange={(e) => {
              const copia = [...estilos];
              copia[idx].nombre = e.target.value;
              setEstilos(copia);
            }}
          />
          <input 
            placeholder="URL de la imagen"
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #eee', fontSize: '12px' }}
            value={estilo.foto_portada}
            onChange={(e) => {
              const copia = [...estilos];
              copia[idx].foto_portada = e.target.value;
              setEstilos(copia);
            }}
          />
          <button onClick={() => setEstilos(estilos.filter((_, i) => i !== idx))} style={{ color: 'red', background: 'none', border: 'none', fontSize: '12px', marginTop: '10px' }}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
