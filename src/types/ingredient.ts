export type IngredientCategory = 
  | "Frozen" 
  | "Canned" 
  | "Fresh Produce" 
  | "Dry Goods" 
  | "Dairy" 
  | "Condiments" 
  | "Other";

export interface Ingredient {
  _id: string;
  ingredientName: string;
  category: IngredientCategory;
  dateReceived: string;
  dateOpened?: string;
  useByDate?: string;
  menuItemID: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientData {
  ingredientName: string;
  category: IngredientCategory;
  dateReceived: string;
  dateOpened?: string;
}

export interface UpdateIngredientData extends CreateIngredientData {
  _id: string;
} 