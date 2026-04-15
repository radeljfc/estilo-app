import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const router = useRouter();
  const [estilos, setEstilos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false); // Estado para el flujo

  useEffect(() => {
    async function obtenerEstilos() {
      const { data, error } = await supabase.from('estilos').select('*');
      if (error) console.error(error);
      else setEstilos(data || []);
      setLoading(false);
    }
    obtenerEstilos();
  }, []);

  const manejarEmpezar = () => {
    setMostrarCatalogo(true);
    // Pequeño delay para que la animación de scroll funcione tras mostrar el div
    setTimeout(() => {
      document.getElementById('catalogo-seccion').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{ padding: '0', fontFamily: '-apple-system, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* 1. BIENVENIDA (Siempre visible al inicio) */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        padding: '0 25px',
        background: 'radial-gradient(circle at center, #fff 0%, #f8f9fa 100%)'
      }}>
        <h1 style={{ fontSize: '64px', fontWeight: '900', letterSpacing: '-3px', margin: '0', color: '#000' }}>VESTA</h1>
        <div style={{ width: '40px', height: '2px', backgroundColor: '#0070f3', margin: '20px 0' }}></div>
        <p style={{ color: '#666', fontSize: '18px', maxWidth: '300px', lineHeight: '1.6', marginBottom: '40px' }}>
          La revolución del probador virtual. <br/><strong>IA que viste tu realidad.</strong>
        </p>
        
        {!mostrarCatalogo && (
          <button 
            onClick={manejarEmpezar}
            style={{ 
              backgroundColor: '#000', 
              color: '#fff', 
              padding: '18px 45px', 
              borderRadius: '15px', 
              border: 'none', 
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onPointerDown={(e) => e.target.style.transform = 'scale(0.95)'}
            onPointerUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            Comenzar Experiencia
          </button>
        )}
      </section>

      {/* 2. CATÁLOGO DINÁMICO (Se revela al presionar el botón) */}
      {mostrarCatalogo && (
        <main id="catalogo-seccion" style={{ 
          padding: '60px 20px', 
          minHeight: '100vh',
          animation: 'fadeIn 1s ease-in'
        }}>
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '30px', textAlign: 'center' }}>Selecciona una Tendencia</h2>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Sincronizando con el armario virtual...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px', maxWidth: '500px', margin: '0 auto' }}>
              {estilos.map((estilo) => (
                <div 
                  key={estilo.id} 
                  onClick={() => router.push(`/probar?estilo=${estilo.id}`)}
                  style={{ 
                    cursor: 'pointer', 
                    borderRadius: '30px', 
                    overflow: 'hidden', 
                    position: 'relative', 
                    height: '350px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                >
                  <img 
                    src={estilo.foto_portada} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt={estilo.nombre}
                  />
                  <div style={{
                    position: 'absolute', bottom: '0', left: '0', right: '0',
                    padding: '30px', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                    color: '#fff'
                  }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{estilo.nombre}</p>
                    <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '5px' }}>Toca para probar con IA →</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <footer style={{ marginTop: '80px', textAlign: 'center', opacity: 0.2 }}>
             <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', fontSize: '12px' }}>CONFIGURACIÓN</button>
          </footer>
        </main>
      )}
    </div>
  );
}
