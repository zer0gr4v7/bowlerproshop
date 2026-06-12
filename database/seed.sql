-- ====================================================================
-- BOWLERPROSHOP.COM DATABASE SEED DATA
-- Injects top benchmark products with detailed physical specifications
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Insert Products (Universal Metadata)
-- --------------------------------------------------------------------
INSERT INTO products (id, slug, product_name, brand, category, status, release_year, price_tier, amazon_search_query, description) VALUES
('ball-001', 'storm-phaze-ii', 'Storm Phaze II', 'Storm', 'ball', 'active', 2016, 'premium', 'Storm Phaze II bowling ball 15lb', 
'The absolute gold standard for league bowling. Known for its benchmark motion, the Phaze II combines the Velocity Symmetric Core with the famous TX-16 Solid Reactive coverstock. It provides predictable midlane control with a strong, continuous backend hook that handles medium to heavy oil lane conditions with ease.'),

('ball-002', 'hammer-black-widow-3-0', 'Hammer Black Widow 3.0', 'Hammer', 'ball', 'active', 2024, 'premium', 'Hammer Black Widow 3.0 bowling ball 15lb', 
'The latest generation in the legendary Black Widow line. Combining the Gas Mask Asymmetric Core with the HK22-based Aggression Solid coverstock, the Widow 3.0 reads the midlane extremely early and delivers a massive, aggressive hook on heavy oil lane patterns.'),

('ball-003', 'roto-grip-hustle-m-m', 'Roto Grip Hustle M+M', 'Roto Grip', 'ball', 'active', 2023, 'mid', 'Roto Grip Hustle M M bowling ball 15lb', 
'The perfect light-to-medium oil option. Featuring the Hustle Symmetric Core wrapped in the VTC Pearl Reactive coverstock, the Hustle M+M glides effortlessly through the front part of the lane, conserving energy for a controllable, smooth snap on the backend.'),

('ball-004', 'motiv-venom-shock', 'Motiv Venom Shock', 'Motiv', 'ball', 'active', 2014, 'mid', 'Motiv Venom Shock bowling ball 15lb', 
'One of the longest-lasting balls in bowling history. The Venom Shock blends the Top Gear Dual-Density Symmetric Core with the predictable Turmoil MFS Solid Reactive coverstock. It creates a smooth, controllable hook shape that makes it a staple benchmark ball on medium oil lane patterns.'),

('ball-005', 'brunswick-rhino', 'Brunswick Rhino', 'Brunswick', 'ball', 'active', 2016, 'budget', 'Brunswick Rhino bowling ball 15lb', 
'The ideal first reactive bowling ball for beginners. The Rhino uses the standard Rhino Symmetric Core and the mild R-16 Pearl Reactive coverstock to deliver a friendly, controllable hook that is perfect for entry-level bowlers on drier house lane conditions.'),

('ball-006', 'storm-mix', 'Storm Mix', 'Storm', 'ball', 'active', 2018, 'budget', 'Storm Mix spare bowling ball 15lb', 
'The ultimate spare ball. Using a durable U1S urethane coverstock and a traditional symmetric puck core, the Storm Mix goes extremely straight, making it perfect for pinpoint corner-pin spares or casual bowlers wanting zero hook.'),

('shoe-001', 'dexter-sst-8-power-frame-boa', 'Dexter SST 8 Power Frame BOA', 'Dexter', 'shoe', 'active', 2023, 'premium', 'Dexter SST 8 Power Frame BOA bowling shoes', 
'The pinnacle of performance footwear. Designed with Dexter''s patented SST 8 interchangeable sole system, these shoes let advanced bowlers customize their slide and heel combination for any approach condition. Out of the box it features the S8 microfiber slide sole.'),

('shoe-002', 'kr-strikeforce-flyer-mesh', 'KR Strikeforce Flyer Mesh', 'KR Strikeforce', 'shoe', 'active', 2022, 'budget', 'KR Strikeforce Flyer Mesh bowling shoes', 
'Lightweight, breathable, and highly comfortable. An excellent upgrade from sticky alley rentals, featuring a soft athletic mesh upper and a fixed universal slide sole on both feet that is ready to bowl immediately.'),

('shoe-003', 'brunswick-avalanche', 'Brunswick Avalanche', 'Brunswick', 'shoe', 'active', 2021, 'mid', 'Brunswick Avalanche bowling shoes', 
'A classic, highly durable leather-style shoe designed for regular league play. Features a comfortable universal slide sole and reliable foam padding to keep you stable frame after frame.'),

('shoe-004', 'dexter-turbo-tour', 'Dexter Turbo Tour', 'Dexter', 'shoe', 'active', 2020, 'mid', 'Dexter Turbo Tour bowling shoes', 
'Athletic-inspired styling with heavy-duty construction. Provides regular league bowlers with a secure lace-up fit, breathable lining, and a stable microfiber slide sole for consistent approaches.'),

('shoe-005', '3g-racer', '3G Racer', '3G', 'shoe', 'active', 2022, 'mid', '3G Racer bowling shoes', 
'Comfort-first athletic shoe. Features an ergonomic form-fitting collar, durable synthetic uppers, and universal slide microfiber soles, perfect for frequent house or tournament bowlers.'),

('shoe-006', 'bsi-basic-521', 'BSI Basic #521', 'BSI', 'shoe', 'active', 2019, 'budget', 'BSI basic bowling shoes 521', 
'A simple, no-nonsense entry shoe for casual weekend bowlers. Reliable fixed rubber traction sole on one foot and classic felt/microfiber slide on the other.');

-- --------------------------------------------------------------------
-- 2. Insert Ball Physics Specs
-- --------------------------------------------------------------------
INSERT INTO ball_physics (product_id, coverstock_name, coverstock_type, box_finish, core_name, core_type, rg_15lb, diff_15lb, bias_15lb, flare_potential, reaction_shape, lane_condition) VALUES
('ball-001', 'TX-16 Solid Reactive', 'reactive-solid', '3000-grit Abralon', 'Velocity Symmetric Core', 'symmetrical', 2.48, 0.053, 0.0, 'high', 'continuous roll', 'medium-heavy'),
('ball-002', 'HK22 - Aggression Solid', 'reactive-solid', '2000-grit Siaair', 'Gas Mask Asymmetric Core', 'asymmetrical', 2.50, 0.053, 0.016, 'extreme', 'early midlane read', 'heavy-oil'),
('ball-003', 'VTC Pearl Reactive', 'reactive-pearl', 'Reacta Gloss', 'Hustle Symmetric Core', 'symmetrical', 2.53, 0.030, 0.0, 'medium', 'angular snap', 'medium'),
('ball-004', 'Turmoil MFS Solid Reactive', 'reactive-solid', '4000-grit LSS', 'Top Gear Dual-Density Core', 'symmetrical', 2.48, 0.034, 0.0, 'medium', 'smooth arc', 'medium'),
('ball-005', 'R-16 Pearl Reactive', 'reactive-pearl', 'Royal Compound & Polish', 'Rhino Symmetric Core', 'symmetrical', 2.52, 0.030, 0.0, 'low', 'smooth arc', 'dry'),
('ball-006', 'U1S Urethane/Plastic', 'plastic', '3500-grit Polish', 'Traditional Symmetric Puck Core', 'symmetrical', 2.69, 0.006, 0.0, 'low', 'zero hook', 'dry');

-- --------------------------------------------------------------------
-- 3. Insert Shoe Physics Specs
-- --------------------------------------------------------------------
INSERT INTO shoe_physics (product_id, handedness, sole_type, style, slide_level) VALUES
('shoe-001', 'interchangeable', 'interchangeable-slide', 'performance', 'S8 microfiber slide'),
('shoe-002', 'universal', 'fixed-slide', 'athletic', 'S8 microfiber'),
('shoe-003', 'universal', 'fixed-slide', 'classic', 'S8 microfiber'),
('shoe-004', 'universal', 'fixed-slide', 'athletic', 'S8 microfiber'),
('shoe-005', 'universal', 'fixed-slide', 'athletic', 'S8 microfiber'),
('shoe-006', 'universal', 'fixed-slide', 'classic', 'S5 synthetic slide');
