import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { convertAddressIfNeeded, isOldAddressFormat } from './addressConverter';
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
  // New fields for address conversion
  is_converted?: boolean;
  original_address?: string;
  converted_address?: string;
  conversion_error?: string;
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
  let isConverted = false;
  let originalAddress = '';
  let convertedAddress = '';
  let conversionError = '';

  // NEW: Check if address needs conversion from old to new format
  const addressString = [street, ward, district, province].filter(Boolean).join(', ');
  if (addressString && isOldAddressFormat({ district })) {
    console.log('Address normalization: Detected old format, attempting conversion...');
    
    const conversionResult = await convertAddressIfNeeded(addressString);
    isConverted = conversionResult.isConverted;
    originalAddress = conversionResult.originalAddress;
    convertedAddress = conversionResult.convertedAddress || '';
    conversionError = conversionResult.error || '';

    if (conversionResult.isConverted && conversionResult.convertedAddress) {
      console.log('Address normalization: Successfully converted to new format');
      // Parse the converted address to update our components
      const convertedParts = conversionResult.convertedAddress.split(',').map(part => part.trim());
      if (convertedParts.length >= 3) {
        street = convertedParts[0] || street;
        ward = convertedParts[1] || ward;
        province = convertedParts[2] || province;
        district = ''; // New format doesn't have districts
      }
    } else if (conversionResult.error) {
      console.log('Address normalization: Conversion failed, using original format:', conversionResult.error);
    }
  }

  // ORIGINAL CODE: Try to find ward (retained for backward compatibility)
  if (wardName) {
    const wardRes = await pool.query(
      `SELECT w.id, w.name, d.id as district_id, d.name as district_name, p.id as province_id, p.name as province_name
       FROM wards w
       JOIN districts d ON w.district_id = d.id
       JOIN provinces p ON d.province_id = p.id
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

  // ORIGINAL CODE: If not found, try district (retained for backward compatibility)
  if (!districtId && districtName) {
    const districtRes = await pool.query(
      `SELECT d.id, d.name, p.id as province_id, p.name as province_name
       FROM districts d
       JOIN provinces p ON d.province_id = p.id
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

  // ORIGINAL CODE: If not found, try province (retained for backward compatibility)
  if (!provinceId && provinceName) {
    const provinceRes = await pool.query(
      `SELECT id, name FROM provinces WHERE LOWER(name) LIKE LOWER($1) LIMIT 1`,
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
    // NEW: Address conversion metadata
    is_converted: isConverted,
    original_address: originalAddress,
    converted_address: convertedAddress,
    conversion_error: conversionError,
  };
}