export type SlotType = 'Headwear' | 'Top' | 'Bottom' | 'Footwear' | 'Accessory';
export type GenderType = 'Man' | 'Woman' | 'Unisex';
export type AuraLevel = 5 | 10 | 15 | 20 | 25 | 30;

export interface OutfitItem {
  id: string;
  name: string;
  slot: SlotType;
  levelRequired: number;
  gender: GenderType;
  thumbnail: string;
  description: string;
  isLocked: boolean;
  setName?: string; // If part of a themed set
}

export interface Aura {
  level: AuraLevel;
  name: string;
  color: string;
  glowColor: string;
  isUnlocked: boolean;
  isEquipped: boolean;
}

export interface SavedFit {
  id: string;
  name: string;
  items: {
    headwear?: OutfitItem;
    top?: OutfitItem;
    bottom?: OutfitItem;
    footwear?: OutfitItem;
    accessory?: OutfitItem;
  };
  aura?: Aura;
  isEquipped: boolean;
  createdAt: Date;
}

export interface ThemedSet {
  id: string;
  name: string;
  description: string;
  levelRange: string;
  items: OutfitItem[];
  thumbnail: string;
}