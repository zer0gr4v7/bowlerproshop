-- ====================================================================
-- BOWLERPROSHOP.COM CUSTOM SEARCH INDEX SCHEMA
-- Compatible with Cloudflare D1 Database and SQLite
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Main Products Table (Universal Entities)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    product_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ball', 'shoe', 'bag', 'accessory')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'retired')),
    release_year INTEGER,
    price_tier TEXT NOT NULL CHECK (price_tier IN ('budget', 'mid', 'premium')),
    amazon_search_query TEXT NOT NULL,
    image_url TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- --------------------------------------------------------------------
-- 2. Bowling Ball Physics Table (1-to-1 extension of products)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ball_physics (
    product_id TEXT PRIMARY KEY,
    coverstock_name TEXT NOT NULL,
    coverstock_type TEXT NOT NULL CHECK (coverstock_type IN ('plastic', 'urethane', 'reactive-solid', 'reactive-pearl', 'reactive-hybrid')),
    box_finish TEXT,
    core_name TEXT NOT NULL,
    core_type TEXT NOT NULL CHECK (core_type IN ('symmetrical', 'asymmetrical')),
    rg_15lb REAL NOT NULL,        -- Radius of Gyration (e.g. 2.48)
    diff_15lb REAL NOT NULL,      -- Total Differential (e.g. 0.053)
    bias_15lb REAL NOT NULL DEFAULT 0.0, -- Asymmetric Differential/Intermediate Diff (e.g. 0.016)
    flare_potential TEXT CHECK (flare_potential IN ('low', 'medium', 'high', 'extreme')),
    reaction_shape TEXT,          -- e.g. 'smooth arc', 'angular snap', 'midlane read'
    lane_condition TEXT NOT NULL CHECK (lane_condition IN ('dry', 'medium', 'heavy-oil', 'medium-heavy')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ball_coverstock ON ball_physics(coverstock_type);
CREATE INDEX IF NOT EXISTS idx_ball_lane ON ball_physics(lane_condition);

-- --------------------------------------------------------------------
-- 3. Bowling Shoe Physics Table (1-to-1 extension of products)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shoe_physics (
    product_id TEXT PRIMARY KEY,
    handedness TEXT NOT NULL CHECK (handedness IN ('right', 'left', 'universal', 'interchangeable')),
    sole_type TEXT NOT NULL CHECK (sole_type IN ('fixed-slide', 'interchangeable-slide')),
    style TEXT NOT NULL CHECK (style IN ('athletic', 'classic', 'performance')),
    slide_level TEXT,            -- e.g. 'S8 slide microfiber'
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shoe_style ON shoe_physics(style);
