import { Button } from '@shopping-mall/ui';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Shopping Mall
      </h1>
      <div className="text-center">
        <Button variant="primary">Get Started</Button>
      </div>
    </div>
  );
}