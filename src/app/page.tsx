import { redirect } from 'next/navigation';

export default function Home() {
  // Rediriger vers la page d'accueil avec la locale par défaut (fr)
  redirect('/fr');
} 