import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const router = useRouter();
  const [estilos, setEstilos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function obtenerEstilos() {
      const { data, error } = await supabase.from('estilos').select('*');
      if (error) console.error("Error cargando estilos:", error);
      else setEstilos(data || []);
      setLoading(false);
    }
    obtenerEstilos();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: '-apple-system, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '900', letterSpacing: '-1px', margin: '0' }}>VESTA</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>IA Virtual Fitting Room</p>
      </header>

      <section>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Tendencias Disponibles</h2>
        
        {loading ? (
          <p>Cargando probador...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {estilos.map((estilo) => (
              <div 
                key={estilo.id} 
                onClick={() => router.push(`/probar?estilo=${estilo.id}`)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <img 
                  src={estilo.foto_portada} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '20px' }} 
                  alt={estilo.nombre}
                />
                <div style={{
                  position: 'absolute', bottom: '15px', left: '15px', color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', opacity: 0.8 }}>TENDENCIA</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>{estilo.nombre}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Acceso rápido al Admin para ti (puedes quitarlo después) */}
      <footer style={{ marginTop: '50px', textAlign: 'center' }}>
        <button 
          onClick={() => router.push('/admin')}
          style={{ background: 'none', border: 'none', color: '#ccc', fontSize: '12px' }}
        >
          Acceso Administrador
        </button>
      </footer>
    </div>
  );
}
