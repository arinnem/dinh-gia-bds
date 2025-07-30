import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'dinh_gia_bds',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

export interface NormalizedAddress {
  province_id: number | null;
  province_name: string;
  district_id: number | null;
  district_name: string;
  ward_id: number | null;
  ward_name: string;
  street: string;
  project: string;
}

export async function normalizeAddress({
  province,
  district,
  ward,
  street,
  project,
}: {
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  project?: string;
}): Promise<NormalizedAddress> {
  let provinceId: number | null = null, districtId: number | null = null, wardId: number | null = null;
  let provinceName = province || '', districtName = district || '', wardName = ward || '';

  // 1. Try to find ward
  if (wardName) {
    const wardRes = await pool.query(
      `SELECT w.id, w.name, d.id as district_id, d.name as district_name, p.id as province_id, p.name as province_name
       FROM wards_new w
       JOIN districts_new d ON w.district_id = d.id
       JOIN provinces_new p ON w.province_id = p.id
       WHERE LOWER(w.name) LIKE LOWER($1)
       LIMIT 1`,
      [`%${wardName}%`]
    );
    if (wardRes.rows.length) {
      wardId = wardRes.rows[0].id;
      districtId = wardRes.rows[0].district_id;
      provinceId = wardRes.rows[0].province_id;
      wardName = wardRes.rows[0].name;
      districtName = wardRes.rows[0].district_name;
      provinceName = wardRes.rows[0].province_name;
    }
  }

  // 2. If not found, try district
  if (!districtId && districtName) {
    const districtRes = await pool.query(
      `SELECT d.id, d.name, p.id as province_id, p.name as province_name
       FROM districts_new d
       JOIN provinces_new p ON d.province_id = p.id
       WHERE LOWER(d.name) LIKE LOWER($1)
       LIMIT 1`,
      [`%${districtName}%`]
    );
    if (districtRes.rows.length) {
      districtId = districtRes.rows[0].id;
      provinceId = districtRes.rows[0].province_id;
      districtName = districtRes.rows[0].name;
      provinceName = districtRes.rows[0].province_name;
    }
  }

  // 3. If not found, try province
  if (!provinceId && provinceName) {
    const provinceRes = await pool.query(
      `SELECT id, name FROM provinces_new WHERE LOWER(name) LIKE LOWER($1) LIMIT 1`,
      [`%${provinceName}%`]
    );
    if (provinceRes.rows.length) {
      provinceId = provinceRes.rows[0].id;
      provinceName = provinceRes.rows[0].name;
    }
  }

  return {
    province_id: provinceId,
    province_name: provinceName,
    district_id: districtId,
    district_name: districtName,
    ward_id: wardId,
    ward_name: wardName,
    street: street || '',
    project: project || '',
  };
}