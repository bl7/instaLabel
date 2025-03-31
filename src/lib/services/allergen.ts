import { API_ENDPOINTS } from '../config'

export interface Allergen {
  _id: string
  allergenName: string
  relatedIngredients: string[]
  description?: string
  severity?: string
  isSystemLevel?: boolean
}

// Add intelligent severity assessment function
function assessAllergySeverity(allergen: any): string {
  const highSeverityAllergens = [
    'peanut', 'nut', 'shellfish', 'fish', 'sesame', 'milk', 'egg', 'soy'
  ];
  const highSeverityKeywords = [
    'anaphylaxis', 'anaphylactic', 'severe', 'fatal', 'death', 'emergency', 
    'hospitalization', 'respiratory', 'breathing'
  ];
  const mediumSeverityKeywords = [
    'reaction', 'intolerance', 'discomfort', 'digestive', 'rash', 'hives', 
    'swelling', 'allergy', 'itching'
  ];

  if (allergen.severity) {
    return allergen.severity;
  }
  
  const name = (allergen.name || '').toLowerCase();
  const description = (allergen.description || '').toLowerCase();
  
  for (const highAllergen of highSeverityAllergens) {
    if (name.includes(highAllergen)) {
      return 'high';
    }
  }
  
  for (const keyword of highSeverityKeywords) {
    if (description.includes(keyword)) {
      return 'high';
    }
  }
  
  for (const keyword of mediumSeverityKeywords) {
    if (description.includes(keyword)) {
      return 'medium';
    }
  }
  
  const relatedIngredients = Array.isArray(allergen.relatedIngredients) ? allergen.relatedIngredients : [];
  if (relatedIngredients.length > 5) {
    return 'medium';
  }
  
  return 'low';
}

export async function getAllAllergens(): Promise<Allergen[]> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    console.warn('Authentication token not found in localStorage');
    return [];
  }

  try {
    const response = await fetch(API_ENDPOINTS.allergens.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      console.error(`Failed fetch with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    let allergens = data.data?.allergens || data.data || data || [];
    console.log('Number of allergens received:', allergens.length);
    
    return allergens.map((allergen: any) => {
      const relatedIngredients = Array.isArray(allergen.relatedIngredients) 
        ? allergen.relatedIngredients 
        : (Array.isArray(allergen.ingredients) 
          ? allergen.ingredients 
          : []);
      
      const assessedSeverity = assessAllergySeverity(allergen);
      
      return {
        _id: allergen._id || `temp-${Math.random().toString(36).substring(2, 9)}`,
        allergenName: allergen.name || '', 
        relatedIngredients: relatedIngredients,
        description: allergen.description,
        severity: assessedSeverity,
        isSystemLevel: allergen.isSystemLevel
      };
    });
  } catch (error) {
    console.error('Failed to fetch allergens:', error);
    return [];
  }
}
