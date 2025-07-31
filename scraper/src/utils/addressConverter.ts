import axios from 'axios';
import * as https from 'https';
import * as dotenv from 'dotenv';
dotenv.config();

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

export interface OldAddressFormat {
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  streetAddress: string;
}

export interface NewAddressFormat {
  provinceCode: string;
  wardCode: string;
  streetAddress: string;
}

export interface AddressConversionResult {
  success: boolean;
  oldAddress?: OldAddressFormat;
  newAddress?: NewAddressFormat;
  error?: string;
}

/**
 * Convert old address format (with district) to new format (without district)
 * using tinhthanhpho.com API
 */
export async function convertOldToNewAddress(
  oldAddress: OldAddressFormat
): Promise<AddressConversionResult> {
  try {
    const apiKey = process.env.ADDRESS_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: 'ADDRESS_API_KEY not configured'
      };
    }

    const response = await axiosInstance.post(
      'https://tinhthanhpho.com/api/v1/convert/address',
      {
        provinceCode: oldAddress.provinceCode,
        districtCode: oldAddress.districtCode,
        wardCode: oldAddress.wardCode,
        streetAddress: oldAddress.streetAddress
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.data.success) {
      const convertedData = response.data.data;
      return {
        success: true,
        oldAddress,
        newAddress: {
          provinceCode: convertedData.new_province?.code || oldAddress.provinceCode,
          wardCode: convertedData.new_ward?.code || oldAddress.wardCode,
          streetAddress: convertedData.new_street_address || oldAddress.streetAddress
        }
      };
    } else {
      return {
        success: false,
        error: response.data.message || 'Conversion failed'
      };
    }
  } catch (error: any) {
    console.error('Address conversion error:', error.message);
    return {
      success: false,
      error: error.message || 'Network error during conversion'
    };
  }
}

/**
 * Check if an address is in old format (has district) or new format (no district)
 */
export function isOldAddressFormat(address: any): boolean {
  return !!(address.district && address.district.trim());
}

/**
 * Extract address codes from address string using regex patterns
 */
export function extractAddressCodes(addressString: string): {
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
  streetAddress?: string;
} {
  // This is a simplified extraction - in practice you'd need more sophisticated parsing
  // or use the existing address normalization logic
  const parts = addressString.split(',').map(part => part.trim());
  
  // Basic extraction - this would need to be enhanced with proper Vietnamese address parsing
  return {
    streetAddress: parts[0] || '',
    wardCode: parts[1] || '',
    districtCode: parts[2] || '',
    provinceCode: parts[3] || ''
  };
}

/**
 * Convert address string to new format if it's in old format
 */
export async function convertAddressIfNeeded(addressString: string): Promise<{
  originalAddress: string;
  convertedAddress?: string;
  isConverted: boolean;
  error?: string;
}> {
  try {
    // Extract address components
    const addressParts = extractAddressCodes(addressString);
    
    // Check if it's old format (has district)
    if (isOldAddressFormat(addressParts)) {
      console.log('Detected old address format, attempting conversion...');
      
      const conversionResult = await convertOldToNewAddress({
        provinceCode: addressParts.provinceCode || '',
        districtCode: addressParts.districtCode || '',
        wardCode: addressParts.wardCode || '',
        streetAddress: addressParts.streetAddress || ''
      });

      if (conversionResult.success && conversionResult.newAddress) {
        const newAddressString = [
          conversionResult.newAddress.streetAddress,
          conversionResult.newAddress.wardCode,
          conversionResult.newAddress.provinceCode
        ].filter(Boolean).join(', ');

        return {
          originalAddress: addressString,
          convertedAddress: newAddressString,
          isConverted: true
        };
      } else {
        return {
          originalAddress: addressString,
          isConverted: false,
          error: conversionResult.error
        };
      }
    }

    // Already in new format or no conversion needed
    return {
      originalAddress: addressString,
      isConverted: false
    };
  } catch (error: any) {
    return {
      originalAddress: addressString,
      isConverted: false,
      error: error.message
    };
  }
} 