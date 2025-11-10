export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks: Record<string, string>;
  dietaryPreferences: string[];
  cookingExperience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description?: string;
  instructions: RecipeInstruction[];
  ingredients: RecipeIngredient[];
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  servings?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisineType?: string;
  mealType?: string;
  dietaryTags: string[];
  imageUrl?: string;
  isPublic: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  // Computed fields
  author?: User;
  ratings?: RecipeRating[];
  averageRating?: number;
  totalRatings?: number;
}

export interface RecipeInstruction {
  step: number;
  instruction: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit: string;
}

export interface RecipeRating {
  id: string;
  recipeId: string;
  userId: string;
  rating: number; // 1-5
  review?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface RecipeCollection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  recipes?: Recipe[];
  recipeCount?: number;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: User;
  following?: User;
}

export interface RecipeComment {
  id: string;
  recipeId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  replies?: RecipeComment[];
}

export interface RecipeLike {
  id: string;
  recipeId: string;
  userId: string;
  createdAt: string;
  user?: User;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Recipe form types
export interface CreateRecipeRequest {
  title: string;
  description?: string;
  instructions: RecipeInstruction[];
  ingredients: RecipeIngredient[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisineType?: string;
  mealType?: string;
  dietaryTags: string[];
  imageUrl?: string;
  isPublic: boolean;
}

export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {
  id: string;
}

// Search and filter types
export interface RecipeFilters {
  search?: string;
  cuisineType?: string;
  mealType?: string;
  difficulty?: string;
  dietaryTags?: string[];
  prepTimeMax?: number;
  cookTimeMax?: number;
  minRating?: number;
  sortBy?: 'created' | 'rating' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}