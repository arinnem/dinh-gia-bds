# Address Conversion Feature

## Overview

This feature automatically converts Vietnamese addresses from the old format (with districts) to the new format (without districts) using the [tinhthanhpho.com API](https://tinhthanhpho.com/api-docs#conversion-api).

## Background

Starting from July 1, 2025, Vietnam's administrative structure changed:
- **Old Format**: Province → District → Ward → Street
- **New Format**: Province → Ward → Street (districts removed)

## Implementation

### 1. Address Conversion Utility (`scraper/src/utils/addressConverter.ts`)

**Key Functions:**
- `convertOldToNewAddress()`: Converts old format to new format via API
- `isOldAddressFormat()`: Detects if address has district (old format)
- `convertAddressIfNeeded()`: Main function that handles conversion logic

**API Integration:**
```typescript
// Example API call
POST https://tinhthanhpho.com/api/v1/convert/address
{
  "provinceCode": "01",
  "districtCode": "001", 
  "wardCode": "00001",
  "streetAddress": "15 Nguyễn Văn A"
}
```

### 2. Enhanced Address Normalizer (`scraper/src/utils/addressNormalizer.ts`)

**New Features:**
- Automatic detection of old vs new address format
- Integration with address conversion API
- Metadata tracking for conversion status

**Conversion Flow:**
1. Extract address components from scraped data
2. Check if address has district (old format)
3. If old format detected, call conversion API
4. Update address components with converted data
5. Store conversion metadata

### 3. Database Schema Updates

**New Fields in `properties` table:**
- `is_address_converted`: Boolean flag for conversion status
- `original_address`: Original address before conversion
- `converted_address`: Converted address after conversion
- `conversion_error`: Error message if conversion failed
- `address_conversion_date`: Timestamp of conversion

**Migration Script:** `database/migration_add_address_conversion.sql`

### 4. PropertyService Updates (`scraper/src/database/propertyService.ts`)

**Enhanced Features:**
- Handles address conversion metadata in insert/update operations
- Tracks conversion changes for de-duplication
- Preserves both old and new address formats

## Configuration

### Environment Variables

Add to `.env`:
```env
ADDRESS_API_KEY=your_api_key_here
```

### API Key Setup

1. Register at [tinhthanhpho.com](https://tinhthanhpho.com)
2. Generate API key in dashboard
3. Add to environment variables

## Usage

### Automatic Conversion

The scraper automatically:
1. Detects old format addresses (with districts)
2. Converts to new format via API
3. Stores both original and converted addresses
4. Tracks conversion metadata

### Manual Conversion

```typescript
import { convertAddressIfNeeded } from './utils/addressConverter';

const result = await convertAddressIfNeeded("123 Đường ABC, Phường XYZ, Quận 1, TP.HCM");
console.log(result.isConverted); // true
console.log(result.convertedAddress); // "123 Đường ABC, Phường XYZ, TP.HCM"
```

## Error Handling

### API Errors
- Network timeouts (10s timeout)
- Invalid API key
- Rate limiting (100 requests/minute)
- Server errors

### Fallback Behavior
- If conversion fails, original address is preserved
- Error messages logged for debugging
- Scraping continues with original format

## Database Queries

### Find Converted Properties
```sql
SELECT * FROM properties 
WHERE is_address_converted = true 
ORDER BY address_conversion_date DESC;
```

### Find Conversion Errors
```sql
SELECT * FROM properties 
WHERE conversion_error IS NOT NULL;
```

### Address Conversion Statistics
```sql
SELECT 
  COUNT(*) as total_properties,
  COUNT(CASE WHEN is_address_converted THEN 1 END) as converted_count,
  COUNT(CASE WHEN conversion_error IS NOT NULL THEN 1 END) as error_count
FROM properties;
```

## Testing

### Test Address Conversion
```bash
# Run migration first
./scripts/run_migration.bat

# Test scraper with debug mode
cd scraper
npm run start -- --debug
```

### Test API Integration
```typescript
// Test with sample old format address
const testAddress = "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM";
const result = await convertAddressIfNeeded(testAddress);
console.log('Conversion result:', result);
```

## Monitoring

### Log Messages
- `"Address normalization: Detected old format, attempting conversion..."`
- `"Address normalization: Successfully converted to new format"`
- `"Address normalization: Conversion failed, using original format"`

### Database Monitoring
- Track conversion success rates
- Monitor API error rates
- Analyze address format distribution

## Future Enhancements

1. **Batch Conversion**: Convert existing properties in database
2. **Caching**: Cache conversion results to reduce API calls
3. **Validation**: Validate converted addresses against reference data
4. **Analytics**: Track conversion patterns and success rates

## Troubleshooting

### Common Issues

1. **API Key Not Configured**
   - Error: `ADDRESS_API_KEY not configured`
   - Solution: Add API key to `.env` file

2. **Network Timeout**
   - Error: `Network error during conversion`
   - Solution: Check internet connection, increase timeout

3. **Rate Limiting**
   - Error: `429 Too Many Requests`
   - Solution: Implement request throttling

4. **Invalid Address Format**
   - Error: `Conversion failed`
   - Solution: Improve address parsing logic

### Debug Mode

Enable debug logging:
```bash
DEBUG=address-conversion npm run start
```

This will show detailed conversion logs and API responses. 