import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  decimal, 
  jsonb, 
  pgEnum 
} from "drizzle-orm/pg-core";

// Sipariş durumları için endüstriyel tip tanımları
export const statusEnum = pgEnum("order_status", [
  "pending", 
  "approved", 
  "production", 
  "shipped", 
  "delivered", 
  "delayed"
]);

// 1. TEDARİKÇİLER (Suppliers)
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sector: text("sector").notNull(), // 'Automotive' veya 'Textile'
  taxNumber: text("tax_number").unique(),
  location: text("location"), // Bursa, İstanbul vb.
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. ÜRÜNLER / PARÇALAR (Products)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(), // Parça kodu
  name: text("name").notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  // JSONB kullanımı: Tekstilde iplik türü, otomotivde teknik çizim verisi tutabiliriz
  specifications: jsonb("specifications").$type<{
    material?: string;
    gsm?: number;
    threadCount?: string;
    weight?: string;
    dimensions?: string;
  }>(),
  currentStock: integer("current_stock").default(0),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 3. SATINALMA EMİRLERİ (Orders)
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(), // PRQ-8820-TXT gibi
  supplierId: integer("supplier_id").references(() => suppliers.id),
  status: statusEnum("status").default("pending"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// 4. SİPARİŞ KALEMLERİ (Order Items)
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  priceAtTime: decimal("price_at_time", { precision: 10, scale: 2 }),
});

export const invoiceStatusEnum = pgEnum("invoice_status", ["paid", "pending", "overdue"]);

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(), // INV-2024-001
  orderId: integer("order_id").references(() => orders.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: invoiceStatusEnum("status").default("pending"),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});