import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Forzamos la carga del archivo .env
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});