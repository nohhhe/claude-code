import { render, screen } from '@testing-library/react';
import HomePage from '../page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  it('renders the main heading', () => {
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('당신의 요리');
    expect(heading).toHaveTextContent('레시피를 공유하세요');
  });

  it('renders the hero section description', () => {
    const description = screen.getByText(/요리를 사랑하는 사람들과 함께하세요/i);
    expect(description).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    const browseRecipesLink = screen.getByRole('link', { name: /레시피 둘러보기/i });
    const shareRecipeLink = screen.getByRole('link', { name: /레시피 공유하기/i });

    expect(browseRecipesLink).toBeInTheDocument();
    expect(browseRecipesLink).toHaveAttribute('href', '/recipes');

    expect(shareRecipeLink).toBeInTheDocument();
    expect(shareRecipeLink).toHaveAttribute('href', '/recipes/create');
  });

  it('renders featured recipes section', () => {
    const featuredHeading = screen.getByRole('heading', { level: 2, name: /추천 레시피/i });
    expect(featuredHeading).toBeInTheDocument();

    const featuredDescription = screen.getByText(/우리 커뮤니티의 재능 있는 요리사들이/i);
    expect(featuredDescription).toBeInTheDocument();
  });

  it('renders featured recipe cards', () => {
    // Check for specific recipe titles
    const kimchiJjigae = screen.getByText('김치찌개');
    const bulgogi = screen.getByText('불고기');
    const eggRoll = screen.getByText('계란말이');

    expect(kimchiJjigae).toBeInTheDocument();
    expect(bulgogi).toBeInTheDocument();
    expect(eggRoll).toBeInTheDocument();
  });

  it('displays recipe information correctly', () => {
    // Check for recipe ratings
    const ratings = screen.getAllByText(/4\.[6-8]/);
    expect(ratings).toHaveLength(3);

    // Check for difficulty badges
    const easyBadges = screen.getAllByText('쉬움');
    const mediumBadge = screen.getByText('보통');
    
    expect(easyBadges).toHaveLength(2);
    expect(mediumBadge).toBeInTheDocument();
  });

  it('renders recipe view buttons', () => {
    const recipeButtons = screen.getAllByText('레시피 보기');
    expect(recipeButtons).toHaveLength(3);
    
    // Check that each button links to the correct recipe
    recipeButtons.forEach((button, index) => {
      const link = button.closest('a');
      expect(link).toHaveAttribute('href', `/recipes/${index + 1}`);
    });
  });

  it('renders CTA section', () => {
    const ctaHeading = screen.getByRole('heading', { level: 2, name: /요리를 시작할 준비가 되셨나요/i });
    const ctaDescription = screen.getByText(/수천 명의 홈쿡과 전문 셰프들이/i);
    const ctaButton = screen.getByRole('link', { name: /CookShare 시작하기/i });

    expect(ctaHeading).toBeInTheDocument();
    expect(ctaDescription).toBeInTheDocument();
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/auth/register');
  });

  it('renders footer section', () => {
    const footerHeading = screen.getByRole('heading', { level: 3, name: /CookShare/i });
    expect(footerHeading).toBeInTheDocument();

    const footerDescription = screen.getByText(/맛있는 레시피를 발견하고 공유하는 최고의 공간입니다/i);
    expect(footerDescription).toBeInTheDocument();

    // Check for footer navigation links
    const breakfastLink = screen.getByRole('link', { name: /아침식사/i });
    const lunchLink = screen.getByRole('link', { name: /점심식사/i });
    const dinnerLink = screen.getByRole('link', { name: /저녁식사/i });
    const dessertLink = screen.getByRole('link', { name: /디저트/i });

    expect(breakfastLink).toHaveAttribute('href', '/recipes?category=breakfast');
    expect(lunchLink).toHaveAttribute('href', '/recipes?category=lunch');
    expect(dinnerLink).toHaveAttribute('href', '/recipes?category=dinner');
    expect(dessertLink).toHaveAttribute('href', '/recipes?category=dessert');
  });

  it('displays copyright information', () => {
    const copyright = screen.getByText(/© 2024 CookShare\. 모든 권리 보유\./);
    expect(copyright).toBeInTheDocument();
  });

  it('renders time and serving information for recipes', () => {
    // Check for time display (prep + cook time)
    const timeInfo = screen.getByText('30분'); // 김치찌개: 10+20=30
    const servingInfo = screen.getByText('4인분'); // 김치찌개 servings
    
    expect(timeInfo).toBeInTheDocument();
    expect(servingInfo).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    const h3Elements = screen.getAllByRole('heading', { level: 3 });

    expect(h1).toBeInTheDocument();
    expect(h2Elements.length).toBeGreaterThan(0);
    expect(h3Elements.length).toBeGreaterThan(0);

    // Check for navigation
    const navigation = screen.getByRole('banner'); // Header with navigation
    expect(navigation).toBeInTheDocument();
  });
});