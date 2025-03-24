export type MenuItemCategory = {
  _id: string
  name: string
}

export type MenuItemAllergen = {
  _id: string
  name: string
}

export type MenuItem = {
  _id: string
  menuItemName: string
  expiryDate: string
  categoryID: string
  allergenID?: string
  user: string
  createdAt: string
  updatedAt: string
}

export type CreateMenuItemData = Omit<MenuItem, '_id' | 'user' | 'createdAt' | 'updatedAt'> 