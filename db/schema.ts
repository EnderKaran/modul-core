import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  decimal, 
  jsonb, 
  pgEnum, 
  varchar
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
  sku: varchar("sku", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  
  // YENİ EKLENEN ENDÜSTRİYEL SÜTUNLAR
  category: varchar("category", { length: 255 }),
  stock: integer("stock").notNull().default(0),
  unit: varchar("unit", { length: 50 }).default('UN'),
  safetyStock: integer("safety_stock").notNull().default(0),
  location: varchar("location", { length: 255 }),
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