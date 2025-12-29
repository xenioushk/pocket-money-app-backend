-- Seed categories
INSERT INTO categories (name, slug, description) VALUES
('Lawn Mowing', 'lawn-mowing', 'Lawn mowing and yard maintenance services'),
('Snow Shoveling', 'snow-shoveling', 'Snow removal and shoveling services'),
('Dog Walking', 'dog-walking', 'Professional dog walking and pet care'),
('Tutoring', 'tutoring', 'Academic tutoring and homework help'),
('Car Washing', 'car-washing', 'Car washing and detailing services'),
('Babysitting', 'babysitting', 'Childcare and babysitting services'),
('House Cleaning', 'house-cleaning', 'House cleaning and organization'),
('Grocery Shopping', 'grocery-shopping', 'Grocery shopping and delivery'),
('Pet Sitting', 'pet-sitting', 'Pet sitting and care services'),
('Moving Help', 'moving-help', 'Moving assistance and heavy lifting'),
('Painting', 'painting', 'Interior and exterior painting services'),
('Gardening', 'gardening', 'Gardening and plant care'),
('Tech Support', 'tech-support', 'Computer and technology assistance'),
('Errand Running', 'errand-running', 'General errand and delivery services'),
('Other', 'other', 'Other miscellaneous services')
ON CONFLICT (slug) DO NOTHING;
