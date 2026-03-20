async function getHealth() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, { cache: 'no-store' });
    return await res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: 40 }}>
      <h1>ProfDNA</h1>
      <p>Frontend stub for parallel team development.</p>
      <div style={{ marginTop: 24, padding: 16, border: '1px solid #ddd', borderRadius: 12 }}>
        <h2>Backend status</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </div>
    </main>
  );
}
