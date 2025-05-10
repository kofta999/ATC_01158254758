-- Insert test users (password is 12345678)
INSERT INTO
    "user" (email, password, role)
VALUES
    (
        'user@example.com',
        '$2b$10$vrm.HscDcNInNDvHqZ4zRu8wuZu3TA482Y5/m4FbC5no27lP3mBLO',
        'USER'
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
