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

  const iniciarExperiencia = () => {
    document.getElementById('catalogo-vesta').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: '-apple-system, sans-serif' }}>
      
      {/* PANTALLA DE BIENVENIDA (Alto Contraste) */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        padding: '0 30px',
        borderBottom: '1px solid #333'
      }}>
        <h1 style={{ 
          fontSize: '72px', 
          fontWeight: '900', 
          letterSpacing: '-4px', 
          margin: '0',
          textTransform: 'uppercase'
        }}>VESTA</h1>
        
        <div style={{ 
          height: '4px', 
          width: '60px', 
          backgroundColor: '#fff', 
          margin: '30px 0' 
        }}></div>

        <p style={{ 
          fontSize: '20px', 
          maxWidth: '320px', 
          lineHeight: '1.4', 
          fontWeight: '300',
          marginBottom: '50px',
          letterSpacing: '0.5px'
        }}>
          Bienvenido a la nueva era de la moda. 
          <span style={{ fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
            Tu probador inteligente con IA.
          </span>
        </p>
        
        <button 
          onClick={iniciarExperiencia}
          style={{ 
            backgroundColor: '#fff', 
            color: '#000', 
            padding: '20px 50px', 
            borderRadius: '0', // Estilo minimalista cuadrado o con poco radio
            border: 'none', 
            fontWeight: '900',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer'
          }}
        >
          Iniciar Probador
        </button>
      </section>

      {/* SECCIÓN DE CATÁLOGO (Revelación al hacer Scroll) */}
      <main id="catalogo-vesta" style={{ padding: '80px 20px', backgroundColor: '#fff', color: '#000' }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: '900', 
          textAlign: 'center', 
          marginBottom: '10px',
          letterSpacing: '-1px'
        }}>TENDENCIAS</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '50px', fontSize: '14px' }}>
          Selecciona un estilo para procesar con IA
        </p>
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando catálogo...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', maxWidth: '600px', margin: '0 auto' }}>
            {estilos.map((estilo) => (
              <div 
                key={estilo.id} 
                onClick={() => router.push(`/probar?estilo=${estilo.id}`)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <img 
                  src={estilo.foto_portada} 
                  style={{ 
                    width: '100%', 
                    height: '450px', 
                    objectFit: 'cover',
                    filter: 'grayscale(20%)', // Un toque de contraste para las fotos
                  }} 
                  alt={estilo.nombre}
                />
                <div style={{
                  position: 'absolute', 
                  bottom: '20px', 
                  left: '20px', 
                  right: '20px',
                  backgroundColor: '#fff',
                  padding: '20px',
                  boxShadow: '10px 10px 0px #000' // Sombra de alto contraste
                }}>
                  <p style={{ fontSize: '12px', fontWeight: '900', margin: '0', color: '#888' }}>ESTILO</p>
                  <p style={{ fontSize: '22px', fontWeight: '900', margin: '0', textTransform: 'uppercase' }}>{estilo.nombre}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#fff', color: '#000', borderTop: '1px solid #eee' }}>
        <p style={{ fontSize: '10px', letterSpacing: '4px', opacity: 0.5 }}>VESTA LABS © 2026</p>
        <button onClick={() => router.push('/admin')} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#ccc', fontSize: '10px' }}>ADMIN</button>
      </footer>
    </div>
  );
}
