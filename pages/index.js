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

  useEffect(() => {
    async function obtenerEstilos() {
      const { data, error } = await supabase.from('estilos').select('*');
      if (error) console.error(error);
      else setEstilos(data || []);
      setLoading(false);
    }
    obtenerEstilos();
  }, []);

  return (
    <div style={{ padding: '0', fontFamily: '-apple-system, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* SECCIÓN DE BIENVENIDA (HERO) */}
      <section style={{ 
        padding: '60px 25px', 
        textAlign: 'center', 
        background: 'linear-gradient(to bottom, #f8f9fa, #fff)',
        borderBottom: '1px solid #f0f0f0' 
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', margin: '0', color: '#000' }}>VESTA</h1>
        <p style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', marginTop: '10px', textTransform: 'uppercase' }}>
          Tu Probador Virtual con IA
        </p>
        <p style={{ color: '#666', fontSize: '16px', maxWidth: '300px', margin: '20px auto', lineHeight: '1.5' }}>
          Descubre cómo te queda la moda antes de comprarla. Sube tu foto y personaliza tu estilo.
        </p>
        
        <button 
          onClick={() => {
            document.getElementById('tendencias').scrollIntoView({ behavior: 'smooth' });
          }}
          style={{ 
            backgroundColor: '#000', 
            color: '#fff', 
            padding: '15px 35px', 
            borderRadius: '50px', 
            border: 'none', 
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
        >
          Empezar a Probar
        </button>
      </section>

      {/* SECCIÓN DE TENDENCIAS (Lo que traemos de Supabase) */}
      <main id="tendencias" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', margin: 0 }}>Tendencias</h2>
          <span style={{ fontSize: '12px', color: '#0070f3', fontWeight: 'bold' }}>{estilos.length} DISPONIBLES</span>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#ccc' }}>Cargando catálogo maestro...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {estilos.map((estilo) => (
              <div 
                key={estilo.id} 
                onClick={() => router.push(`/probar?estilo=${estilo.id}`)}
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  position: 'relative', 
                  height: '250px', 
                  backgroundColor: '#eee' 
                }}
              >
                <img 
                  src={estilo.foto_portada || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt={estilo.nombre}
                />
                <div style={{
                  position: 'absolute', bottom: '0', left: '0', right: '0',
                  padding: '15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: '#fff'
                }}>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>{estilo.nombre}</p>
                  <p style={{ fontSize: '10px', opacity: 0.8, margin: '0' }}>Probar Ahora →</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SI NO HAY NADA EN LA BASE DE DATOS */}
        {estilos.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '25px', border: '2px dashed #eee' }}>
            <p style={{ color: '#999', fontSize: '14px' }}>Configura tus estilos en el panel de administrador para comenzar.</p>
          </div>
        )}
      </main>

      {/* FOOTER DISCRETO */}
      <footer style={{ padding: '60px 20px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', color: '#ccc', letterSpacing: '2px' }}>VESTA © 2026 | AI FASHION TECH</p>
        <button 
          onClick={() => router.push('/admin')} 
          style={{ background: 'none', border: 'none', color: '#eee', fontSize: '10px', marginTop: '20px' }}
        >
          ADMIN ACCESS
        </button>
      </footer>
    </div>
  );
}
