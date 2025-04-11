export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Bienvenue sur InvoiceFlow</h1>
      <p style={{ lineHeight: '1.5', marginBottom: '1rem' }}>
        Cette page est une version simplifiée pour tester le déploiement.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/test" 
          style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1rem', 
            background: '#0070f3', 
            color: 'white', 
            borderRadius: '0.25rem', 
            textDecoration: 'none' 
          }}
        >
          Aller à la page de test
        </a>
      </div>
    </div>
  );
} 