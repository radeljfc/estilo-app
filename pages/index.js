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
      const { data } = await supabase.from('estilos').select('*');
      setEstilos(data || []);
      setLoading(false);
    }
    obtenerEstilos();
  }, []);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: '-apple-system, sans-serif' }}>
      
      {/* SECCIÓN 1: BIENVENIDA (FONDO NEGRO - EL QUE TE GUSTA) */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        padding: '0 30px'
      }}>
        <h1 style={{ fontSize: '72px', fontWeight: '900', letterSpacing: '-4px', margin: '0' }}>VESTA</h1>
        <div style={{ height: '4px', width: '60px', backgroundColor: '#fff', margin: '30px 0' }}></div>
        <p style={{ fontSize: '20px', maxWidth: '320px', lineHeight: '1.4', marginBottom: '50px' }}>
          Bienvenido a la nueva era de la moda. 
          <span style={{ fontWeight: 'bold', display: 'block', marginTop: '10px' }}>Tu probador inteligente con IA.</span>
        </p>
        <button 
          onClick={() => document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' })}
          style={{ backgroundColor: '#fff', color: '#000', padding: '20px 50px', border: 'none', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}
        >
          Iniciar Experiencia
        </button>
      </section>

      {/* SECCIÓN 2: CATÁLOGO (FONDO BLANCO - DINÁMICO) */}
      <main id="catalogo" style={{ padding: '80px 20px', backgroundColor: '#fff', color: '#000', minHeight: '100vh' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '40px' }}>TENDENCIAS</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', maxWidth: '500px', margin: '0 auto' }}>
          {estilos.map((est) => (
            <div key={est.id} onClick={() => router.push(`/probar?estilo=${est.id}`)} style={{ cursor: 'pointer', position: 'relative' }}>
              <div style={{ borderRadius: '25px', overflow: 'hidden', height: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <img 
                  src={est.foto_portada || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ position: 'absolute', bottom: '-15px', left: '20px', right: '20px', backgroundColor: '#000', color: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', textTransform: 'uppercase' }}>{est.nombre}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff' }}>
        <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', color: '#eee', fontSize: '10px' }}>ADMIN</button>
      </footer>
    </div>
  );
}
