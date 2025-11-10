-- CookShare Development Seed Data
-- This script populates the database with sample data for development

-- Insert sample users
INSERT INTO auth.users (id, email, username, password_hash, first_name, last_name, is_verified, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'chef.gordon@cookshare.dev', 'chef_gordon', '$2b$10$rKK3SmhwKOd.d5iCB5UKIeASVVPJU2xFw1zs7AYj8YGMZgwCLJKRW', 'Gordon', 'Ramsay', true, true),
('22222222-2222-2222-2222-222222222222', 'julia.child@cookshare.dev', 'julia_chef', '$2b$10$rKK3SmhwKOd.d5iCB5UKIeASVVPJU2xFw1zs7AYj8YGMZgwCLJKRW', 'Julia', 'Child', true, true),
('33333333-3333-3333-3333-333333333333', 'jamie.oliver@cookshare.dev', 'jamie_o', '$2b$10$rKK3SmhwKOd.d5iCB5UKIeASVVPJU2xFw1zs7AYj8YGMZgwCLJKRW', 'Jamie', 'Oliver', true, true),
('44444444-4444-4444-4444-444444444444', 'home.cook@cookshare.dev', 'home_cook', '$2b$10$rKK3SmhwKOd.d5iCB5UKIeASVVPJU2xFw1zs7AYj8YGMZgwCLJKRW', 'Sarah', 'Johnson', true, true),
('55555555-5555-5555-5555-555555555555', 'baker.betty@cookshare.dev', 'betty_baker', '$2b$10$rKK3SmhwKOd.d5iCB5UKIeASVVPJU2xFw1zs7AYj8YGMZgwCLJKRW', 'Betty', 'Crocker', true, true);

-- Insert user profiles
INSERT INTO auth.user_profiles (user_id, bio, location, cooking_experience, dietary_preferences) VALUES
('11111111-1111-1111-1111-111111111111', 'Professional chef with multiple Michelin stars. Passionate about teaching cooking techniques.', 'London, UK', 'professional', '[]'),
('22222222-2222-2222-2222-222222222222', 'French cuisine expert and cookbook author. Bringing classic techniques to home kitchens.', 'Paris, France', 'professional', '[]'),
('33333333-3333-3333-3333-333333333333', 'Celebrity chef focused on healthy, accessible cooking for families.', 'Essex, UK', 'professional', '["vegetarian-friendly"]'),
('44444444-4444-4444-4444-444444444444', 'Home cooking enthusiast sharing family recipes and everyday meals.', 'Seattle, USA', 'intermediate', '["gluten-free"]'),
('55555555-5555-5555-5555-555555555555', 'Baking specialist with 30+ years of experience in pastries and desserts.', 'Minneapolis, USA', 'advanced', '["vegetarian"]');

-- Insert sample recipes
INSERT INTO recipes.recipes (id, user_id, title, description, instructions, ingredients, prep_time, cook_time, servings, difficulty, cuisine_type, meal_type, dietary_tags, is_public, is_featured) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Perfect Beef Wellington',
    'A classic British dish featuring tender beef fillet wrapped in pâté and puff pastry.',
    '[
        {"step": 1, "instruction": "Season the beef fillet with salt and pepper, then sear in a hot pan until browned all over."},
        {"step": 2, "instruction": "Allow to cool, then brush with English mustard."},
        {"step": 3, "instruction": "Wrap in crêpes and mushroom duxelles."},
        {"step": 4, "instruction": "Encase in puff pastry and bake at 200°C for 25-30 minutes."},
        {"step": 5, "instruction": "Rest for 10 minutes before slicing and serving."}
    ]',
    '[
        {"name": "Beef fillet", "amount": "1.5", "unit": "kg"},
        {"name": "Puff pastry", "amount": "500", "unit": "g"},
        {"name": "Mushrooms", "amount": "400", "unit": "g"},
        {"name": "Pâté de foie gras", "amount": "200", "unit": "g"},
        {"name": "Crêpes", "amount": "6", "unit": "pieces"},
        {"name": "English mustard", "amount": "2", "unit": "tbsp"},
        {"name": "Egg yolk", "amount": "1", "unit": "piece"}
    ]',
    45,
    35,
    6,
    'hard',
    'British',
    'dinner',
    '[]',
    true,
    true
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'Coq au Vin',
    'Traditional French braised chicken dish cooked in wine with vegetables and herbs.',
    '[
        {"step": 1, "instruction": "Brown chicken pieces in butter until golden."},
        {"step": 2, "instruction": "Remove chicken and sauté bacon, onions, and mushrooms."},
        {"step": 3, "instruction": "Add wine and bring to a boil to cook off alcohol."},
        {"step": 4, "instruction": "Return chicken to pot with herbs and simmer for 45 minutes."},
        {"step": 5, "instruction": "Thicken sauce with butter and flour mixture."}
    ]',
    '[
        {"name": "Chicken", "amount": "1", "unit": "whole chicken, cut into pieces"},
        {"name": "Red wine", "amount": "750", "unit": "ml"},
        {"name": "Bacon", "amount": "200", "unit": "g"},
        {"name": "Pearl onions", "amount": "12", "unit": "pieces"},
        {"name": "Mushrooms", "amount": "250", "unit": "g"},
        {"name": "Thyme", "amount": "2", "unit": "sprigs"},
        {"name": "Bay leaves", "amount": "2", "unit": "pieces"}
    ]',
    20,
    60,
    4,
    'medium',
    'French',
    'dinner',
    '[]',
    true,
    false
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '44444444-4444-4444-4444-444444444444',
    'Gluten-Free Banana Bread',
    'Moist and delicious banana bread made with gluten-free flour blend.',
    '[
        {"step": 1, "instruction": "Preheat oven to 350°F (175°C) and grease a loaf pan."},
        {"step": 2, "instruction": "Mash ripe bananas in a large bowl."},
        {"step": 3, "instruction": "Mix in melted butter, sugar, egg, and vanilla."},
        {"step": 4, "instruction": "Combine dry ingredients and fold into wet mixture."},
        {"step": 5, "instruction": "Pour into pan and bake for 60-65 minutes."}
    ]',
    '[
        {"name": "Ripe bananas", "amount": "3", "unit": "large"},
        {"name": "Gluten-free flour", "amount": "1.5", "unit": "cups"},
        {"name": "Sugar", "amount": "3/4", "unit": "cup"},
        {"name": "Butter", "amount": "1/3", "unit": "cup"},
        {"name": "Egg", "amount": "1", "unit": "piece"},
        {"name": "Vanilla extract", "amount": "1", "unit": "tsp"},
        {"name": "Baking soda", "amount": "1", "unit": "tsp"}
    ]',
    15,
    65,
    8,
    'easy',
    'American',
    'dessert',
    '["gluten-free"]',
    true,
    false
);

-- Insert recipe ratings
INSERT INTO recipes.recipe_ratings (recipe_id, user_id, rating, review) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 5, 'Absolutely magnificent! Perfect technique.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 4, 'Challenging but worth the effort. Amazing results!'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 5, 'Classic French cooking at its finest.'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 5, 'Perfect for families with dietary restrictions!');

-- Insert recipe collections
INSERT INTO recipes.recipe_collections (id, user_id, name, description, is_public) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'Michelin Star Classics', 'Restaurant-quality dishes for the home kitchen', true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'Gluten-Free Favorites', 'My go-to gluten-free recipes for the family', true);

-- Insert collection items
INSERT INTO recipes.recipe_collection_items (collection_id, recipe_id) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- Insert follows
INSERT INTO social.follows (follower_id, following_id) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111'),
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333');

-- Insert recipe likes
INSERT INTO social.recipe_likes (recipe_id, user_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555');

-- Insert recipe comments
INSERT INTO social.recipe_comments (recipe_id, user_id, content) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'The pastry technique here is impeccable. Well done!'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Tried this for a dinner party - everyone was amazed!'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Love the traditional approach. Very authentic.'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Perfect for kids with celiac disease. Thank you for sharing!');