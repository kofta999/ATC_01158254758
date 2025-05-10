-- Insert test users (password is 12345678)
INSERT INTO
    "user" (email, password, role)
VALUES
    (
        'user@example.com',
        '$2b$10$vrm.HscDcNInNDvHqZ4zRu8wuZu3TA482Y5/m4FbC5no27lP3mBLO',
        'USER'
    );

-- Insert events
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
    (
        'Summer Music Festival',
        'A vibrant music festival featuring top artists.',
        'Music',
        '2024-07-20',
        'Central Park, New York',
        50,
        'url-to-image1'
    ),
    (
        'Tech Conference 2024',
        'The leading tech conference of the year.',
        'Technology',
        '2024-09-15',
        'San Francisco, CA',
        200,
        'url-to-image2'
    ),
    (
        'Foodies Festival',
        'A culinary experience for food lovers.',
        'Food',
        '2024-11-10',
        'Miami, FL',
        30,
        'url-to-image3'
    );

-- Insert admins (password is 12345678)
INSERT INTO
    "user" (email, password, role)
VALUES
    (
        'admin@example.com',
        '$2b$10$vrm.HscDcNInNDvHqZ4zRu8wuZu3TA482Y5/m4FbC5no27lP3mBLO',
        'ADMIN'
    );
