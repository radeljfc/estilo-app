import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', // Fondo blanco puro
      color: '#000000',           // Texto negro
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      {/* Logo o Nombre de Marca */}
      <header style={{ marginBottom: '60px' }}>
        <h1 style={{ 
          fontSize: '14px', 
          letterSpacing: '5px', 
          textTransform: 'uppercase', 
          color: '#999', // Gris suave para el "Bienvenido"
          marginBottom: '10px'
        }}>
          Bienvenido a
        </h1>
        <h2 style={{ 
          fontSize: '64px', 
          fontWeight: '900', 
          margin: '0',
          lineHeight: '1',
          letterSpacing: '-2px'
        }}>
          VESTA
        </h2>
        <p style={{ 
          fontSize: '18px', 
          marginTop: '10px', 
          color: '#555',
          fontWeight: '300'
        }}>
          Estilo para Ellos
        </p>
      </header>

      {/* Sección Principal */}
      <main style={{ maxWidth: '300px' }}>
        <h3 style={{ 
          fontSize: '24px', 
          lineHeight: '1.3', 
          marginBottom: '40px',
          fontWeight: '400',
          color: '#333'
        }}>
          Redefine tu imagen con el poder de la <span style={{ color: '#0070f3', fontWeight: 'bold' }}>IA</span>.
        </h3>

        <button 
          onClick={() => router.push("/probar")}
          style={{
            backgroundColor: '#000000', // Botón negro
            color: '#ffffff',           // Texto blanco
            border: 'none',
            padding: '18px 40px',
            borderRadius: '50px',
            fontSize: '18px',
            fontWeight: 'bold',
            width: '100%',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }}
        >
          Comenzar Prueba
        </button>
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '80px' }}>
        <p style={{ 
          fontSize: '12px', 
          color: '#aaa', 
          maxWidth: '250px',
          lineHeight: '1.5'
        }}>
          Prueba virtual inteligente. <br /> 
          Conserva tu esencia, mejora tu outfit.
        </p>
      </footer>

      <style jsx>{`
        button:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
