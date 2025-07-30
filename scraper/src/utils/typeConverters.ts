export function toCanonicalScrapedProperty(property: any): import('../types').ScrapedProperty {
  return {
    ...property,
    scrapedAt: property.scrapedAt ? new Date(property.scrapedAt) : new Date(),
    postedDate: property.postedDate ? new Date(property.postedDate) : undefined,
    // Ensure optional fields are handled
    legalStatus: property.legalStatus || undefined,
    direction: property.direction || undefined,
    projectName: property.projectName || undefined,
    features: property.features || {},
    area: {
      ...property.area,
      usable: property.area?.usable ?? null,
    },
    address: {
      ...property.address,
      street: property.address?.street || undefined,
      city: property.address?.city || undefined,
      coordinates: property.address?.coordinates ?? null,
    },
    contact: {
      ...property.contact,
      email: property.contact?.email ?? null,
    },
  };
} 