import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// .env dosyasındaki DATABASE_URL'i okuyoruz
const sql = neon(process.env.DATABASE_URL!);

// Şemayı buraya inject ediyoruz ki tRPC üzerinden
// db.query.orders... gibi fonksiyonlara tip güvenli erişebilelim.
export const db = drizzle(sql, { schema });