import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Clock, Users, Star, ArrowLeft, Heart, Bookmark, Share2 } from 'lucide-react';
import type { Recipe } from '../../../types';

// Mock data function to get recipe by ID
function getRecipeById(id: string): Recipe | null {
  const recipes: Recipe[] = [
    {
      id: '1',
      userId: '11111111-1111-1111-1111-111111111111',
      title: 'Perfect Beef Wellington',
      description: 'A classic British dish featuring tender beef fillet wrapped in pâté and puff pastry. This recipe has been perfected over years of practice and represents the pinnacle of British cuisine.',
      instructions: [
        { step: 1, instruction: 'Season the beef fillet with salt and pepper, then sear in a hot pan until browned all over. This should take about 2-3 minutes per side.' },
        { step: 2, instruction: 'Allow to cool, then brush with English mustard. Be generous with the mustard as it adds essential flavor.' },
        { step: 3, instruction: 'Wrap in crêpes and mushroom duxelles. The crêpes prevent the pastry from becoming soggy.' },
        { step: 4, instruction: 'Encase in puff pastry and bake at 200°C for 25-30 minutes. The internal temperature should reach 54°C for medium-rare.' },
        { step: 5, instruction: 'Rest for 10 minutes before slicing and serving. This allows the juices to redistribute throughout the meat.' }
      ],
      ingredients: [
        { name: 'Beef fillet', amount: '1.5', unit: 'kg' },
        { name: 'Puff pastry', amount: '500', unit: 'g' },
        { name: 'Mushrooms', amount: '400', unit: 'g' },
        { name: 'Pâté de foie gras', amount: '200', unit: 'g' },
        { name: 'Crêpes', amount: '6', unit: 'pieces' },
        { name: 'English mustard', amount: '2', unit: 'tbsp' },
        { name: 'Egg yolk', amount: '1', unit: 'piece' },
        { name: 'Salt', amount: 'to taste', unit: '' },
        { name: 'Black pepper', amount: 'to taste', unit: '' },
        { name: 'Olive oil', amount: '2', unit: 'tbsp' }
      ],
      prepTime: 45,
      cookTime: 35,
      servings: 6,
      difficulty: 'hard',
      cuisineType: 'British',
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
        firstName: 'Gordon',
        lastName: 'Ramsay',
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
      title: 'Coq au Vin',
      description: 'Traditional French braised chicken dish cooked in wine with vegetables and herbs.',
      instructions: [
        { step: 1, instruction: 'Brown chicken pieces in butter until golden.' },
        { step: 2, instruction: 'Remove chicken and sauté bacon, onions, and mushrooms.' },
        { step: 3, instruction: 'Add wine and bring to a boil to cook off alcohol.' },
        { step: 4, instruction: 'Return chicken to pot with herbs and simmer for 45 minutes.' },
        { step: 5, instruction: 'Thicken sauce with butter and flour mixture.' }
      ],
      ingredients: [
        { name: 'Chicken', amount: '1', unit: 'whole chicken, cut into pieces' },
        { name: 'Red wine', amount: '750', unit: 'ml' },
        { name: 'Bacon', amount: '200', unit: 'g' },
        { name: 'Pearl onions', amount: '12', unit: 'pieces' },
        { name: 'Mushrooms', amount: '250', unit: 'g' },
        { name: 'Thyme', amount: '2', unit: 'sprigs' },
        { name: 'Bay leaves', amount: '2', unit: 'pieces' }
      ],
      prepTime: 20,
      cookTime: 60,
      servings: 4,
      difficulty: 'medium',
      cuisineType: 'French',
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
        firstName: 'Julia',
        lastName: 'Child',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      averageRating: 4.6,
      totalRatings: 89
    },
    {
      id: '3',
      userId: '44444444-4444-4444-4444-444444444444',
      title: 'Gluten-Free Banana Bread',
      description: 'Moist and delicious banana bread made with gluten-free flour blend.',
      instructions: [
        { step: 1, instruction: 'Preheat oven to 350°F (175°C) and grease a loaf pan.' },
        { step: 2, instruction: 'Mash ripe bananas in a large bowl.' },
        { step: 3, instruction: 'Mix in melted butter, sugar, egg, and vanilla.' },
        { step: 4, instruction: 'Combine dry ingredients and fold into wet mixture.' },
        { step: 5, instruction: 'Pour into pan and bake for 60-65 minutes.' }
      ],
      ingredients: [
        { name: 'Ripe bananas', amount: '3', unit: 'large' },
        { name: 'Gluten-free flour', amount: '1.5', unit: 'cups' },
        { name: 'Sugar', amount: '3/4', unit: 'cup' },
        { name: 'Butter', amount: '1/3', unit: 'cup' },
        { name: 'Egg', amount: '1', unit: 'piece' },
        { name: 'Vanilla extract', amount: '1', unit: 'tsp' },
        { name: 'Baking soda', amount: '1', unit: 'tsp' }
      ],
      prepTime: 15,
      cookTime: 65,
      servings: 8,
      difficulty: 'easy',
      cuisineType: 'American',
      mealType: 'dessert',
      dietaryTags: ['gluten-free'],
      isPublic: true,
      isFeatured: false,
      viewCount: 543,
      createdAt: '2024-01-25T09:15:00Z',
      updatedAt: '2024-01-25T09:15:00Z',
      author: {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'home.cook@cookshare.dev',
        username: 'home_cook',
        firstName: 'Sarah',
        lastName: 'Johnson',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      averageRating: 4.7,
      totalRatings: 67
    }
  ];
  
  return recipes.find(recipe => recipe.id === id) || null;
}

interface RecipePageProps {
  params: { id: string };
}

export default function RecipePage({ params }: RecipePageProps) {
  const recipe = getRecipeById(params.id);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              CookShare
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The recipe you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/recipes">Browse All Recipes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            CookShare
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/recipes" className="text-sm font-medium hover:text-primary">
              Recipes
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/recipes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Recipe Header */}
            <div className="mb-8">
              <div className="aspect-video bg-muted rounded-lg mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {recipe.isFeatured && (
                  <Badge className="absolute top-4 left-4" variant="default">
                    Featured
                  </Badge>
                )}
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {recipe.difficulty}
                </Badge>
                {recipe.dietaryTags.length > 0 && (
                  <div className="absolute bottom-4 left-4">
                    {recipe.dietaryTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="mr-1 mb-1 bg-white/90">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{recipe.description}</p>

              {/* Recipe Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    Prep: {recipe.prepTime}min | Cook: {recipe.cookTime}min
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{recipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">
                    {recipe.averageRating?.toFixed(1)} ({recipe.totalRatings} reviews)
                  </span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {recipe.author?.firstName?.[0]}{recipe.author?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {recipe.author?.firstName} {recipe.author?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{recipe.author?.username}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Follow
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" className="flex-1">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>
                  Follow these steps to create this delicious recipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recipe.instructions.map((instruction) => (
                    <div key={instruction.step} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {instruction.step}
                      </div>
                      <p className="text-sm leading-relaxed pt-1">
                        {instruction.instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Ingredients */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>
                  Everything you need for this recipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-sm">{ingredient.name}</span>
                      <span className="text-sm font-medium">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recipe Info */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cuisine</span>
                    <span className="text-sm font-medium">{recipe.cuisineType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Meal Type</span>
                    <span className="text-sm font-medium">{recipe.mealType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Difficulty</span>
                    <Badge variant="outline" className="text-xs">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Views</span>
                    <span className="text-sm font-medium">{recipe.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm font-medium">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}