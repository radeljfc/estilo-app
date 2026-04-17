import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

// Conexión a la base de datos
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const router = useRouter();
  const [estilos, setEstilos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga las tendencias desde Supabase al iniciar
  useEffect(() => {
    async function obtenerEstilos() {
      const { data, error } = await supabase.from('estilos').select('*');
      if (error) console.error("Error cargando estilos:", error);
      else setEstilos(data || []);
      setLoading(false);
    }
    obtenerEstilos();
  }, []);

  const iniciarExperiencia = () => {
    const catalogo = document.getElementById('catalogo-real');
    if (catalogo) {
      catalogo.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#000', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      
      {/* SECCIÓN 1: BIENVENIDA ORIGINAL (ESTILO MINIMALISTA) */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: '900', 
          letterSpacing: '-3px', 
          margin: '0',
          color: '#000'
        }}>VESTA</h1>
        
        <p style={{ 
          color: '#666', 
          fontSize: '14px', 
          textTransform: 'uppercase', 
          letterSpacing: '4px', 
          marginTop: '10px' 
        }}>Virtual Fitting Room</p>

        <div style={{ width: '30px', height: '2px', backgroundColor: '#000', margin: '30px 0' }}></div>

        <p style={{ 
          fontSize: '18px', 
          maxWidth: '300px', 
          lineHeight: '1.6', 
          color: '#333',
          marginBottom: '40px' 
        }}>
          Bienvenido a la nueva era de la moda. 
          <span style={{ fontWeight: 'bold', display: 'block' }}>Tu probador inteligente con IA.</span>
        </p>

        <button 
          onClick={iniciarExperiencia}
          style={{ 
            backgroundColor: '#000', 
            color: '#fff', 
            padding: '18px 45px', 
            borderRadius: '50px', 
            border: 'none', 
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}
        >
          Probar Estilos
        </button>
      </section>

      {/* SECCIÓN 2: CATÁLOGO DINÁMICO (TUS NUEVAS FUNCIONES) */}
      <main id="catalogo-real" style={{ padding: '60px 20px', backgroundColor: '#fff' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '30px', textAlign: 'center' }}>Selecciona tu Tendencia</h2>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Sincronizando armario...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
            {estilos.map((estilo) => (
              <div 
                key={estilo.id} 
                onClick={() => router.push(`/probar?estilo=${estilo.id}`)}
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: '20px', 
                  overflow: 'hidden', 
                  position: 'relative', 
                  height: '280px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
              >
  <img 
  src={estilo.foto_portada || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'} 
  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'; }}
  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
  alt={estilo.nombre}
/>

                <div style={{
                  position: 'absolute', bottom: '0', left: '0', right: '0',
                  padding: '15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: '#fff'
                }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0' }}>{estilo.nombre}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SI NO HAY ESTILOS EN EL ADMIN */}
        {estilos.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed #ccc', borderRadius: '20px' }}>
            <p style={{ color: '#999' }}>No hay estilos publicados aún.</p>
          </div>
        )}
      </main>

      {/* FOOTER DISCRETO */}
      <footer style={{ padding: '60px 20px', textAlign: 'center', opacity: 0.2 }}>
        <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', fontSize: '10px', cursor: 'pointer' }}>MASTER ADMIN</button>
      </footer>
    </div>
  );
}
