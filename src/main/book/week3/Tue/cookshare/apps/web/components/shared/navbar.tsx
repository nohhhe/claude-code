import Link from 'next/link';
import { Button } from '../ui/button';

export function Navbar() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          CookShare
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/recipes" className="text-sm font-medium hover:text-primary">
            레시피
          </Link>
          <Link href="/recipes/create" className="text-sm font-medium hover:text-primary">
            레시피 등록
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">로그인</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/register">회원가입</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}