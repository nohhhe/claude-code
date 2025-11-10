import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Navbar } from '../components/shared/navbar';
import { Clock, Users, Star } from 'lucide-react';

// 추천 레시피 데이터
const featuredRecipes = [
  {
    id: '1',
    title: '김치찌개',
    description: '집에서 만드는 정통 김치찌개. 시원하고 칼칼한 맛이 일품입니다.',
    author: '요리하는 엄마',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: '쉬움',
    rating: 4.8,
    image: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: '불고기',
    description: '달콤하고 고소한 전통 불고기. 특별한 양념장이 포인트입니다.',
    author: '한식요리사',
    prepTime: 30,
    cookTime: 15,
    servings: 6,
    difficulty: '보통',
    rating: 4.6,
    image: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: '계란말이',
    description: '부드럽고 폭신한 계란말이. 아이들도 좋아하는 간단한 요리입니다.',
    author: '요리 초보',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: '쉬움',
    rating: 4.7,
    image: '/api/placeholder/300/200'
  }
];

export default function HomePage() {
  // Updated with navbar component
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            당신의
            <span className="text-primary"> 요리</span>
            <br />
            레시피를 공유하세요
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            요리를 사랑하는 사람들과 함께하세요. 맛있는 레시피를 발견하고, 
            나만의 요리법을 공유하며, 전 세계 요리 애호가들과 소통해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/recipes" className="h-11 rounded-md px-8">레시피 둘러보기</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/recipes/create" className="h-11 rounded-md px-8">레시피 공유하기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">추천 레시피</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              우리 커뮤니티의 재능 있는 요리사들이 공유한 인기 있고 높은 평점을 받은 레시피를 확인해보세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    {recipe.difficulty}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{recipe.author}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)}분</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings}인분</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href={`/recipes/${recipe.id}`}>레시피 보기</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">요리를 시작할 준비가 되셨나요?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            수천 명의 홈쿡과 전문 셰프들이 자신만의 특별한 레시피를 공유하고 있습니다.
          </p>
          <Button asChild>
            <Link href="/auth/register" className="h-11 rounded-md px-8">CookShare 시작하기</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">CookShare</h3>
              <p className="text-sm text-muted-foreground">
                맛있는 레시피를 발견하고 공유하는 최고의 공간입니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">레시피</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/recipes?category=breakfast">아침식사</Link></li>
                <li><Link href="/recipes?category=lunch">점심식사</Link></li>
                <li><Link href="/recipes?category=dinner">저녁식사</Link></li>
                <li><Link href="/recipes?category=dessert">디저트</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">커뮤니티</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/chefs">인기 셰프</Link></li>
                <li><Link href="/collections">컬렉션</Link></li>
                <li><Link href="/blog">블로그</Link></li>
                <li><Link href="/events">이벤트</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">고객지원</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help">도움말 센터</Link></li>
                <li><Link href="/contact">문의하기</Link></li>
                <li><Link href="/privacy">개인정보 처리방침</Link></li>
                <li><Link href="/terms">이용약관</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 CookShare. 모든 권리 보유.
          </div>
        </div>
      </footer>
    </div>
  );
}