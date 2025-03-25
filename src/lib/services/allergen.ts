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
  // Common high-severity allergens based on medical research
  const highSeverityAllergens = [
    'peanut', 'nut', 'shellfish', 'fish', 'sesame', 'milk', 'egg', 'soy'
  ];
  
  // Keywords that indicate high severity in descriptions
  const highSeverityKeywords = [
    'anaphylaxis', 'anaphylactic', 'severe', 'fatal', 'death', 
    'emergency', 'hospitalization', 'respiratory', 'breathing'
  ];
  
  // Keywords that indicate medium severity
  const mediumSeverityKeywords = [
    'reaction', 'intolerance', 'discomfort', 'digestive', 
    'rash', 'hives', 'swelling', 'allergy', 'itching'
  ];

  // If there's already a severity assigned, use it
  if (allergen.severity) {
    return allergen.severity;
  }
  
  const name = (allergen.name || '').toLowerCase();
  const description = (allergen.description || '').toLowerCase();
  
  // Check name against high-severity allergens
  for (const highAllergen of highSeverityAllergens) {
    if (name.includes(highAllergen)) {
      return 'high';
    }
  }
  
  // Check description for high-severity indications
  for (const keyword of highSeverityKeywords) {
    if (description.includes(keyword)) {
      return 'high';
    }
  }
  
  // Check description for medium-severity indications
  for (const keyword of mediumSeverityKeywords) {
    if (description.includes(keyword)) {
      return 'medium';
    }
  }
  
  // Check related ingredients - more ingredients might indicate higher prevalence
  const relatedIngredients = Array.isArray(allergen.relatedIngredients) ? allergen.relatedIngredients : [];
  if (relatedIngredients.length > 5) {
    return 'medium';
  }
  
  // Default severity
  return 'low';
}

export async function getAllAllergens(): Promise<Allergen[]> {
  const token = localStorage.getItem('token')
  if (!token) {
    console.warn('Authentication token not found in localStorage')
    // Return empty data instead of throwing
    return [];
  }

  try {
    const response = await fetch(API_ENDPOINTS.allergens.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (response.status === 401 || response.status === 403) {
      console.error('Authentication issue with token, but continuing');
      // Return empty data instead of throwing
      return [];
    }

    if (!response.ok) {
      console.error(`Failed fetch with status: ${response.status}`);
      return []; // Return empty data for any error
    }

    const data = await response.json()
    console.log('Complete API response:', data)
    
    // Handle different API response structures gracefully
    let allergens = [];
    if (data.data && data.data.allergens) {
      allergens = data.data.allergens;
    } else if (Array.isArray(data.data)) {
      allergens = data.data;
    } else if (Array.isArray(data)) {
      allergens = data;
    } else {
      console.warn('Unexpected API response structure:', data);
      allergens = []; 
    }
    
    console.log('Number of allergens received:', allergens.length)
    
    // Map API response to our Allergen interface
    const mappedAllergens = allergens.map((allergen: any) => {
      // Check for alternative property names
      const relatedIngredients = Array.isArray(allergen.relatedIngredients) 
        ? allergen.relatedIngredients 
        : (Array.isArray(allergen.ingredients) 
          ? allergen.ingredients 
          : []);
      
      // Determine severity using our AI assessment
      const assessedSeverity = assessAllergySeverity(allergen);
      
      return {
        _id: allergen._id || `temp-${Math.random().toString(36).substring(2, 9)}`,
        allergenName: allergen.name || allergen.allergenName || '', 
        relatedIngredients: relatedIngredients,
        description: allergen.description || allergen.desc || '',
        severity: allergen.severity || assessedSeverity,
        isSystemLevel: allergen.isSystemLevel
      }
    });
    
    return mappedAllergens
  } catch (error) {
    console.error('Failed to fetch allergens:', error)
    // Return empty data instead of throwing
    return [];
  }
}

export async function getSystemAllergens(): Promise<Allergen[]> {
  const token = localStorage.getItem('token')
  if (!token) {
    console.warn('Authentication token not found in localStorage')
    throw new Error('No authentication token')
  }

  try {
    const response = await fetch(API_ENDPOINTS.allergens.getSystemAllergens, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (response.status === 401) {
      console.error('Authentication failed - token may be expired or invalid')
      throw new Error('Authentication failed')
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch system allergens: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const allergens = data.data?.allergens || [];
    // Map API response to our Allergen interface
    return allergens.map((allergen: any) => {
      // Determine severity using our AI assessment
      const assessedSeverity = assessAllergySeverity(allergen);
      
      return {
        _id: allergen._id || '',
        allergenName: allergen.name || '', // Map name to allergenName
        relatedIngredients: Array.isArray(allergen.relatedIngredients) ? allergen.relatedIngredients : [],
        description: allergen.description || '',
        severity: allergen.severity || assessedSeverity, // Use API severity if available, otherwise our assessment
        isSystemLevel: allergen.isSystemLevel
      }
    });
  } catch (error) {
    console.error('Failed to fetch system allergens:', error)
    throw error;
  }
}

export async function checkIngredient(ingredient: string): Promise<{
  ingredient: string
  allergens: string[]
}> {
  const token = localStorage.getItem('token')
  if (!token) {
    console.warn('Authentication token not found in localStorage')
    // Return empty result instead of throwing
    return {
      ingredient,
      allergens: []
    };
  }

  try {
    const response = await fetch(`${API_ENDPOINTS.allergens.getAll}/check/${encodeURIComponent(ingredient)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (response.status === 401 || response.status === 403) {
      console.error('Authentication issue with token, but continuing');
      // Return empty result instead of throwing
      return {
        ingredient,
        allergens: []
      };
    }

    if (!response.ok) {
      console.error(`Failed ingredient check with status: ${response.status}`);
      return {
        ingredient,
        allergens: []
      };
    }

    const data = await response.json()
    const result = data.data || {};
    return {
      ingredient: result.ingredient || ingredient,
      allergens: Array.isArray(result.allergens) ? result.allergens : []
    };
  } catch (error) {
    console.error(`Failed to check ingredient "${ingredient}":`, error)
    // Return empty result instead of throwing
    return {
      ingredient,
      allergens: []
    };
  }
} 