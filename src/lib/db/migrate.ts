import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath =
  process.env.DATABASE_URL?.replace(/^file:/, "") ||
  path.join(process.cwd(), "data", "hime.db");

const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    country TEXT DEFAULT 'AE',
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_ar TEXT,
    description TEXT NOT NULL,
    description_ar TEXT,
    category TEXT NOT NULL,
    base_price REAL NOT NULL,
    compare_at_price REAL,
    currency TEXT NOT NULL DEFAULT 'USD',
    images TEXT NOT NULL,
    badge TEXT,
    rating REAL NOT NULL DEFAULT 0,
    review_count INTEGER NOT NULL DEFAULT 0,
    materials TEXT NOT NULL,
    care_instructions TEXT NOT NULL,
    is_halal_friendly INTEGER NOT NULL DEFAULT 0,
    is_hypoallergenic INTEGER NOT NULL DEFAULT 0,
    tags TEXT NOT NULL,
    occasion TEXT,
    personalization TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
  CREATE INDEX IF NOT EXISTS products_active_idx ON products(is_active);

  CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    metal TEXT NOT NULL,
    length_cm REAL,
    size TEXT,
    price REAL NOT NULL,
    in_stock INTEGER NOT NULL DEFAULT 1,
    made_to_order INTEGER NOT NULL DEFAULT 0,
    production_days TEXT,
    stock_count INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS variants_product_idx ON product_variants(product_id);

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    user_id TEXT,
    guest_email TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'AED',
    subtotal_usd REAL NOT NULL,
    shipping_usd REAL NOT NULL DEFAULT 0,
    tax_usd REAL NOT NULL DEFAULT 0,
    total_usd REAL NOT NULL,
    promo_code TEXT,
    promo_discount REAL NOT NULL DEFAULT 0,
    gift_wrap INTEGER NOT NULL DEFAULT 0,
    gift_note TEXT,
    shipping_name TEXT NOT NULL,
    shipping_email TEXT,
    shipping_phone TEXT NOT NULL,
    shipping_address1 TEXT NOT NULL,
    shipping_address2 TEXT,
    shipping_city TEXT NOT NULL,
    shipping_area TEXT,
    shipping_country TEXT NOT NULL,
    shipping_notes TEXT,
    tracking_number TEXT,
    admin_notes TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id);
  CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT NOT NULL,
    product_image TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    metal TEXT NOT NULL,
    length_cm REAL,
    size TEXT,
    unit_price_usd REAL NOT NULL,
    quantity INTEGER NOT NULL,
    engraving_text TEXT,
    gemstone TEXT,
    charm_ids TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id);

  CREATE TABLE IF NOT EXISTS saved_designs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT NOT NULL,
    config TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS designs_user_idx ON saved_designs(user_id);

  CREATE TABLE IF NOT EXISTS wishlist_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS wishlist_user_idx ON wishlist_items(user_id);
  CREATE UNIQUE INDEX IF NOT EXISTS wishlist_unique_idx ON wishlist_items(user_id, product_id);

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_id TEXT,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    title TEXT,
    body TEXT NOT NULL,
    is_verified INTEGER NOT NULL DEFAULT 0,
    is_approved INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS reviews_product_idx ON reviews(product_id);

  CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    label TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT NOT NULL,
    area TEXT,
    country TEXT NOT NULL,
    is_default INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS addresses_user_idx ON addresses(user_id);

  CREATE TABLE IF NOT EXISTS promo_codes (
    code TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    min_order_usd REAL NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    expires_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS recently_viewed (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    viewed_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS recently_user_idx ON recently_viewed(user_id);

  CREATE TABLE IF NOT EXISTS homepage_sections (
    id TEXT PRIMARY KEY,
    section_key TEXT NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    body TEXT,
    image_url TEXT,
    cta_label TEXT,
    cta_href TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

sqlite.close();
console.log("✓ Database initialized at", dbPath);