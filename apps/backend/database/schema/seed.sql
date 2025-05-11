-- Insert test users (password is 12345678)
INSERT INTO
    "user" (email, password, role)
VALUES
    (
        'user@example.com', -- This will be userId = 1
        '$2b$10$vrm.HscDcNInNDvHqZ4zRu8wuZu3TA482Y5/m4FbC5no27lP3mBLO',
        'USER'
    ),
    (
        'admin@example.com', -- This will be userId = 2
        '$2b$10$vrm.HscDcNInNDvHqZ4zRu8wuZu3TA482Y5/m4FbC5no27lP3mBLO',
        'ADMIN'
    );

-- Insert events (total 20)
INSERT INTO
    "event" (
        event_name,
        description,
        category,
        date,
        venue,
        price,
        image
    )
VALUES
    ( -- Event 1
        'Summer Music Festival',
        'A vibrant music festival featuring top artists.',
        'Music',
        '2024-07-20',
        'Central Park, New York',
        50,
        'https://ui-avatars.com/api/?name=Summer+Music+Festival&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 2
        'Tech Conference 2024',
        'The leading tech conference of the year.',
        'Technology',
        '2024-09-15',
        'San Francisco, CA',
        200,
        'https://ui-avatars.com/api/?name=Tech+Conference+2024&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 3
        'Foodies Festival',
        'A culinary experience for food lovers.',
        'Food & Drink',
        '2024-11-10',
        'Miami, FL',
        30,
        'https://ui-avatars.com/api/?name=Foodies+Festival&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 4
        'Art & Design Expo',
        'Explore contemporary art and innovative designs.',
        'Arts & Culture',
        '2024-08-05',
        'The Grand Gallery, Chicago',
        25,
        'https://ui-avatars.com/api/?name=Art+Design+Expo&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 5
        'Startup Pitch Night',
        'Watch startups pitch their groundbreaking ideas.',
        'Business',
        '2024-10-01',
        'Innovation Hub, Austin',
        10,
        'https://ui-avatars.com/api/?name=Startup+Pitch+Night&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 6
        'Wellness & Yoga Retreat',
        'A weekend of relaxation, yoga, and mindfulness.',
        'Health & Wellness',
        '2024-12-05',
        'Serene Valley Resort',
        300,
        'https://ui-avatars.com/api/?name=Wellness+Yoga+Retreat&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 7
        'Indie Film Screening',
        'Discover new talent in independent cinema.',
        'Film & Media',
        '2025-01-15',
        'Art House Cinema, Portland',
        15,
        'https://ui-avatars.com/api/?name=Indie+Film+Screening&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 8
        'Local Makers Market',
        'Support local artisans and crafters.',
        'Community',
        '2024-11-23',
        'Town Square, Asheville',
        0,
        'https://ui-avatars.com/api/?name=Local+Makers+Market&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 9
        'Historical Walking Tour',
        'Explore the rich history of downtown.',
        'Tours & Sightseeing',
        '2024-09-28',
        'City Center, Boston',
        20,
        'https://ui-avatars.com/api/?name=Historical+Walking+Tour&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 10
        'Charity Gala Dinner',
        'An elegant evening for a noble cause.',
        'Charity & Causes',
        '2025-02-22',
        'The Grand Ballroom, LA',
        250,
        'https://ui-avatars.com/api/?name=Charity+Gala+Dinner&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 11
        'AI & Future Tech Summit',
        'Discussions on the future of artificial intelligence.',
        'Technology',
        '2025-03-10',
        'Tech Park Auditorium, Seattle',
        150,
        'https://ui-avatars.com/api/?name=AI+Future+Tech+Summit&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 12
        'Sustainable Living Workshop',
        'Learn practices for a greener lifestyle.',
        'Workshops & Classes',
        '2024-10-12',
        'Eco Center, Boulder',
        40,
        'https://ui-avatars.com/api/?name=Sustainable+Living+Workshop&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 13
        'Jazz Night by the River',
        'Smooth jazz under the stars.',
        'Music',
        '2024-08-30',
        'Riverfront Amphitheater',
        35,
        'https://ui-avatars.com/api/?name=Jazz+Night&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 14
        'Photography Masterclass',
        'Improve your photography skills with a pro.',
        'Hobbies & Skills',
        '2025-01-25',
        'Creative Studio, NYC',
        120,
        'https://ui-avatars.com/api/?name=Photography+Masterclass&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 15
        'Book Club Meetup - Sci-Fi Edition',
        'Discussing the latest sci-fi bestseller.',
        'Literature',
        '2024-09-05',
        'Community Library, Springfield',
        5,
        'https://ui-avatars.com/api/?name=Book+Club+SciFi&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 16
        'Gaming Tournament - Retro Games',
        'Compete in classic video games.',
        'Gaming',
        '2024-12-15',
        'Arcade Hall, Orlando',
        20,
        'https://ui-avatars.com/api/?name=Gaming+Tournament+Retro&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 17
        'Winter Wonderland Market',
        'Festive market with crafts, food, and music.',
        'Seasonal',
        '2024-12-01',
        'Old Town Square, Quebec City',
        10,
        'https://ui-avatars.com/api/?name=Winter+Wonderland+Market&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 18
        'Digital Marketing Bootcamp',
        'Intensive training for online marketing success.',
        'Business & Entrepreneurship',
        '2025-02-01',
        'Online / Virtual Event',
        499,
        'https://ui-avatars.com/api/?name=Digital+Marketing+Bootcamp&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 19
        'Mountain Biking Adventure',
        'Guided trail riding for intermediate bikers.',
        'Sports & Fitness',
        '2024-10-19',
        'Red Rock Canyon Trails',
        75,
        'https://ui-avatars.com/api/?name=Mountain+Biking+Adventure&background=random&size=800x400&font-size=0.25&color=fff'
    ),
    ( -- Event 20
        'New Year''s Eve Gala',
        'Celebrate the New Year in style.',
        'Holiday & Celebration',
        '2024-12-31',
        'The Crystal Ballroom, NYC',
        180,
        'https://ui-avatars.com/api/?name=New+Years+Eve+Gala&background=random&size=800x400&font-size=0.25&color=fff'
    );

-- Insert bookings for user_id = 1
-- Assumes user_id=1 is 'user@example.com' and event_id=1 is 'Summer Music Festival', event_id=2 is 'Tech Conference 2024'
-- Assumes your booking table is named "booking" and has columns: user_id, event_id, created_at
INSERT INTO
    "booking" (user_id, event_id, created_at)
VALUES
    (1, 1, CURRENT_TIMESTAMP),
    (1, 2, CURRENT_TIMESTAMP);
