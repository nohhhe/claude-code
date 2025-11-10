import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CookShare
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/recipes">
            <Button variant="ghost">Recipes</Button>
          </Link>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}