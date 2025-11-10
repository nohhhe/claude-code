import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Navbar } from '../../components/shared/navbar';
import { Clock, Users, Star, Search, Filter } from 'lucide-react';
import type { Recipe } from '../../types';

// 레시피 목록 데이터
const recipes: Recipe[] = [
  {
    id: '1',
    userId: '11111111-1111-1111-1111-111111111111',
    title: '김치찌개',
    description: '집에서 만드는 정통 김치찌개. 시원하고 칼칼한 맛이 일품입니다.',
    instructions: [
      { step: 1, instruction: '신김치를 먹기 좋은 크기로 자르고 팬에 볶아줍니다.' },
      { step: 2, instruction: '물을 넣고 끓이면서 된장을 풀어줍니다.' },
      { step: 3, instruction: '두부와 대파를 넣고 한소끔 더 끓여줍니다.' },
      { step: 4, instruction: '마지막에 참기름과 후추로 간을 맞춰줍니다.' }
    ],
    ingredients: [
      { name: '신김치', amount: '300', unit: 'g' },
      { name: '돼지고기', amount: '200', unit: 'g' },
      { name: '두부', amount: '1', unit: '모' },
      { name: '대파', amount: '2', unit: '대' },
      { name: '된장', amount: '1', unit: '큰술' },
      { name: '참기름', amount: '1', unit: '작은술' }
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    cuisineType: 'Korean',
    mealType: 'dinner',
    dietaryTags: [],
    isPublic: true,
    isFeatured: true,
    viewCount: 1250,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    author: {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'chef.gordon@cookshare.dev',
      username: 'chef_gordon',
      firstName: '요리하는',
      lastName: '엄마',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    averageRating: 4.8,
    totalRatings: 156
  },
  {
    id: '2',
    userId: '22222222-2222-2222-2222-222222222222',
    title: '불고기',
    description: '달콤하고 고소한 전통 불고기. 특별한 양념장이 포인트입니다.',
    instructions: [
      { step: 1, instruction: '소고기를 얇게 썰어 양념장에 재워둡니다.' },
      { step: 2, instruction: '양파와 당근을 채썰고 대파는 어슷썰어줍니다.' },
      { step: 3, instruction: '팬에 기름을 두르고 재운 고기를 볶아줍니다.' },
      { step: 4, instruction: '야채를 넣고 함께 볶다가 참깨를 뿌려 완성합니다.' }
    ],
    ingredients: [
      { name: '소고기 (불고기용)', amount: '500', unit: 'g' },
      { name: '양파', amount: '1', unit: '개' },
      { name: '당근', amount: '1/2', unit: '개' },
      { name: '대파', amount: '2', unit: '대' },
      { name: '간장', amount: '4', unit: '큰술' },
      { name: '설탕', amount: '2', unit: '큰술' },
      { name: '참기름', amount: '1', unit: '큰술' },
      { name: '마늘', amount: '3', unit: '쪽' }
    ],
    prepTime: 30,
    cookTime: 15,
    servings: 6,
    difficulty: 'medium',
    cuisineType: 'Korean',
    mealType: 'dinner',
    dietaryTags: [],
    isPublic: true,
    isFeatured: false,
    viewCount: 892,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    author: {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'julia.child@cookshare.dev',
      username: 'julia_chef',
      firstName: '한식',
      lastName: '요리사',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    averageRating: 4.6,
    totalRatings: 89
  },
  {
    id: '3',
    userId: '33333333-3333-3333-3333-333333333333',
    title: '계란말이',
    description: '부드럽고 폭신한 계란말이. 아이들도 좋아하는 간단한 요리입니다.',
    instructions: [
      { step: 1, instruction: '계란을 그릇에 풀고 소금으로 간을 합니다.' },
      { step: 2, instruction: '팬에 기름을 두르고 약불로 달궈줍니다.' },
      { step: 3, instruction: '계란물을 조금씩 부어가며 돌돌 말아줍니다.' },
      { step: 4, instruction: '키친타올로 모양을 잡고 먹기 좋게 썰어줍니다.' }
    ],
    ingredients: [
      { name: '계란', amount: '4', unit: '개' },
      { name: '소금', amount: '1/2', unit: '작은술' },
      { name: '식용유', amount: '1', unit: '큰술' },
      { name: '대파', amount: '1', unit: '대' },
      { name: '당근', amount: '1/4', unit: '개' }
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
    cuisineType: 'Korean',
    mealType: 'breakfast',
    dietaryTags: ['vegetarian'],
    isPublic: true,
    isFeatured: true,
    viewCount: 789,
    createdAt: '2024-01-28T11:45:00Z',
    updatedAt: '2024-01-28T11:45:00Z',
    author: {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'jamie.oliver@cookshare.dev',
      username: 'jamie_o',
      firstName: '요리',
      lastName: '초보',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    averageRating: 4.5,
    totalRatings: 42
  }
];

const difficultyMap: Record<string, string> = {
  'easy': '쉬움',
  'medium': '보통',
  'hard': '어려움'
};

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">모든 레시피</h1>
            <p className="text-muted-foreground">
              커뮤니티에서 공유된 맛있는 레시피들을 둘러보세요
            </p>
          </div>
          <Button asChild>
            <Link href="/recipes/create">새 레시피 등록</Link>
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="레시피 검색..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {difficultyMap[recipe.difficulty] || recipe.difficulty}
                </Badge>
                {recipe.dietaryTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="absolute bottom-4 left-4 bg-white/90">
                    {tag === 'vegetarian' ? '채식' : tag === 'gluten-free' ? '글루텐프리' : tag}
                  </Badge>
                ))}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {recipe.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{recipe.author?.firstName} {recipe.author?.lastName}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{recipe.averageRating?.toFixed(1)}</span>
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            더 많은 레시피 보기
          </Button>
        </div>
      </div>
    </div>
  );
}