import { OutfitItem, Aura, SavedFit, ThemedSet } from './types';

export const mockOutfitItems: OutfitItem[] = [
  // Headwear
  { id: 'h1', name: 'Headband', slot: 'Headwear', levelRequired: 1, gender: 'Unisex', thumbnail: '', description: 'Basic workout headband', isLocked: false },
  { id: 'h2', name: 'Cap', slot: 'Headwear', levelRequired: 5, gender: 'Unisex', thumbnail: '', description: 'Classic baseball cap', isLocked: false },
  { id: 'h3', name: 'Snapback', slot: 'Headwear', levelRequired: 10, gender: 'Unisex', thumbnail: '', description: 'Stylish snapback hat', isLocked: false },
  { id: 'h4', name: 'Sleek Beret', slot: 'Headwear', levelRequired: 20, gender: 'Unisex', thumbnail: '', description: 'Fashionable beret', isLocked: true },
  { id: 'h5', name: 'Crown', slot: 'Headwear', levelRequired: 30, gender: 'Man', thumbnail: '', description: 'Royal crown for champions', isLocked: true },
  { id: 'h6', name: 'Tiara', slot: 'Headwear', levelRequired: 30, gender: 'Woman', thumbnail: '', description: 'Elegant tiara for champions', isLocked: true },

  // Tops - Men
  { id: 't1', name: 'Ripped Tank', slot: 'Top', levelRequired: 1, gender: 'Man', thumbnail: '', description: 'Basic workout tank', isLocked: false },
  { id: 't2', name: 'Compression Shirt', slot: 'Top', levelRequired: 3, gender: 'Man', thumbnail: '', description: 'Performance compression wear', isLocked: false },
  { id: 't3', name: 'Hoodie', slot: 'Top', levelRequired: 5, gender: 'Man', thumbnail: '', description: 'Comfortable hoodie', isLocked: false },
  { id: 't4', name: 'Bomber Jacket', slot: 'Top', levelRequired: 10, gender: 'Man', thumbnail: '', description: 'Stylish bomber jacket', isLocked: false },
  { id: 't5', name: 'Designer Tee', slot: 'Top', levelRequired: 15, gender: 'Man', thumbnail: '', description: 'Premium designer t-shirt', isLocked: true },
  { id: 't6', name: 'Button-Up', slot: 'Top', levelRequired: 20, gender: 'Man', thumbnail: '', description: 'Smart casual shirt', isLocked: true },
  { id: 't7', name: 'Suit Jacket', slot: 'Top', levelRequired: 25, gender: 'Man', thumbnail: '', description: 'Professional suit jacket', isLocked: true },
  { id: 't8', name: 'Prestige Jacket', slot: 'Top', levelRequired: 30, gender: 'Man', thumbnail: '', description: 'Elite jacket with gold trim', isLocked: true, setName: 'Legendary' },

  // Tops - Women
  { id: 't9', name: 'Sports Bra', slot: 'Top', levelRequired: 1, gender: 'Woman', thumbnail: '', description: 'Athletic sports bra', isLocked: false },
  { id: 't10', name: 'Crop Tee', slot: 'Top', levelRequired: 3, gender: 'Woman', thumbnail: '', description: 'Stylish crop top', isLocked: false },
  { id: 't11', name: 'Zip Top', slot: 'Top', levelRequired: 5, gender: 'Woman', thumbnail: '', description: 'Athletic zip-up top', isLocked: false },
  { id: 't12', name: 'Cropped Hoodie', slot: 'Top', levelRequired: 10, gender: 'Woman', thumbnail: '', description: 'Trendy cropped hoodie', isLocked: false },
  { id: 't13', name: 'Fitted Blouse', slot: 'Top', levelRequired: 15, gender: 'Woman', thumbnail: '', description: 'Elegant fitted blouse', isLocked: true },
  { id: 't14', name: 'Blazer', slot: 'Top', levelRequired: 20, gender: 'Woman', thumbnail: '', description: 'Professional blazer', isLocked: true },
  { id: 't15', name: 'Power Suit Top', slot: 'Top', levelRequired: 25, gender: 'Woman', thumbnail: '', description: 'Executive power suit', isLocked: true },
  { id: 't16', name: 'Prestige Dress Top', slot: 'Top', levelRequired: 30, gender: 'Woman', thumbnail: '', description: 'Elite dress with elegant details', isLocked: true, setName: 'Legendary' },

  // Bottoms - Men
  { id: 'b1', name: 'Basic Shorts', slot: 'Bottom', levelRequired: 1, gender: 'Man', thumbnail: '', description: 'Simple workout shorts', isLocked: false },
  { id: 'b2', name: 'Running Shorts', slot: 'Bottom', levelRequired: 4, gender: 'Man', thumbnail: '', description: 'Performance running shorts', isLocked: false },
  { id: 'b3', name: 'Joggers', slot: 'Bottom', levelRequired: 6, gender: 'Man', thumbnail: '', description: 'Comfortable joggers', isLocked: false },
  { id: 'b4', name: 'Cargo Pants', slot: 'Bottom', levelRequired: 10, gender: 'Man', thumbnail: '', description: 'Utility cargo pants', isLocked: false },
  { id: 'b5', name: 'Slim Jeans', slot: 'Bottom', levelRequired: 12, gender: 'Man', thumbnail: '', description: 'Fitted jeans', isLocked: true },
  { id: 'b6', name: 'Chinos', slot: 'Bottom', levelRequired: 20, gender: 'Man', thumbnail: '', description: 'Smart casual chinos', isLocked: true },
  { id: 'b7', name: 'Suit Trousers', slot: 'Bottom', levelRequired: 25, gender: 'Man', thumbnail: '', description: 'Professional trousers', isLocked: true },
  { id: 'b8', name: 'Prestige Trousers', slot: 'Bottom', levelRequired: 30, gender: 'Man', thumbnail: '', description: 'Elite trousers with premium finish', isLocked: true, setName: 'Legendary' },

  // Bottoms - Women
  { id: 'b9', name: 'Biker Shorts', slot: 'Bottom', levelRequired: 1, gender: 'Woman', thumbnail: '', description: 'Athletic biker shorts', isLocked: false },
  { id: 'b10', name: 'Leggings', slot: 'Bottom', levelRequired: 4, gender: 'Woman', thumbnail: '', description: 'Comfortable leggings', isLocked: false },
  { id: 'b11', name: 'Cargo Joggers', slot: 'Bottom', levelRequired: 6, gender: 'Woman', thumbnail: '', description: 'Stylish cargo joggers', isLocked: false },
  { id: 'b12', name: 'Ripped Jeans', slot: 'Bottom', levelRequired: 12, gender: 'Woman', thumbnail: '', description: 'Trendy ripped jeans', isLocked: true },
  { id: 'b13', name: 'Tailored Trousers', slot: 'Bottom', levelRequired: 20, gender: 'Woman', thumbnail: '', description: 'Professional trousers', isLocked: true },
  { id: 'b14', name: 'Pencil Skirt', slot: 'Bottom', levelRequired: 22, gender: 'Woman', thumbnail: '', description: 'Elegant pencil skirt', isLocked: true },
  { id: 'b15', name: 'Prestige Skirt', slot: 'Bottom', levelRequired: 30, gender: 'Woman', thumbnail: '', description: 'Elite skirt with luxury details', isLocked: true, setName: 'Legendary' },

  // Footwear
  { id: 'f1', name: 'Starter Sneakers', slot: 'Footwear', levelRequired: 1, gender: 'Unisex', thumbnail: '', description: 'Basic sneakers', isLocked: false },
  { id: 'f2', name: 'Runners', slot: 'Footwear', levelRequired: 6, gender: 'Unisex', thumbnail: '', description: 'Performance running shoes', isLocked: false },
  { id: 'f3', name: 'High-Tops', slot: 'Footwear', levelRequired: 10, gender: 'Unisex', thumbnail: '', description: 'Classic high-top sneakers', isLocked: false },
  { id: 'f4', name: 'Dress Sneakers', slot: 'Footwear', levelRequired: 15, gender: 'Unisex', thumbnail: '', description: 'Smart casual sneakers', isLocked: true },
  { id: 'f5', name: 'Loafers', slot: 'Footwear', levelRequired: 20, gender: 'Man', thumbnail: '', description: 'Classic loafers', isLocked: true },
  { id: 'f6', name: 'Heels', slot: 'Footwear', levelRequired: 20, gender: 'Woman', thumbnail: '', description: 'Elegant heels', isLocked: true },
  { id: 'f7', name: 'Prestige Footwear', slot: 'Footwear', levelRequired: 30, gender: 'Unisex', thumbnail: '', description: 'Elite shoes with subtle glow', isLocked: true, setName: 'Legendary' },

  // Accessories
  { id: 'a1', name: 'Wrist Wraps', slot: 'Accessory', levelRequired: 2, gender: 'Unisex', thumbnail: '', description: 'Athletic wrist wraps', isLocked: false },
  { id: 'a2', name: 'Training Gloves', slot: 'Accessory', levelRequired: 5, gender: 'Unisex', thumbnail: '', description: 'Workout gloves', isLocked: false },
  { id: 'a3', name: 'Chain', slot: 'Accessory', levelRequired: 10, gender: 'Man', thumbnail: '', description: 'Stylish chain necklace', isLocked: false },
  { id: 'a4', name: 'Necklace', slot: 'Accessory', levelRequired: 10, gender: 'Woman', thumbnail: '', description: 'Elegant necklace', isLocked: false },
  { id: 'a5', name: 'Shades', slot: 'Accessory', levelRequired: 12, gender: 'Unisex', thumbnail: '', description: 'Cool sunglasses', isLocked: true },
  { id: 'a6', name: 'Leather Watch', slot: 'Accessory', levelRequired: 16, gender: 'Unisex', thumbnail: '', description: 'Premium leather watch', isLocked: true },
  { id: 'a7', name: 'Luxury Belt', slot: 'Accessory', levelRequired: 22, gender: 'Unisex', thumbnail: '', description: 'Designer belt', isLocked: true },
  { id: 'a8', name: 'Signature Ring', slot: 'Accessory', levelRequired: 28, gender: 'Unisex', thumbnail: '', description: 'Unique signature ring', isLocked: true }
];

export const mockAuras: Aura[] = [
  { level: 5, name: 'Soft Glow', color: '#3B82F6', glowColor: 'rgba(59, 130, 246, 0.3)', isUnlocked: true, isEquipped: false },
  { level: 10, name: 'Neon Pulse', color: '#EC4899', glowColor: 'rgba(236, 72, 153, 0.4)', isUnlocked: true, isEquipped: true },
  { level: 15, name: 'Lightning Sparks', color: '#F59E0B', glowColor: 'rgba(245, 158, 11, 0.4)', isUnlocked: false, isEquipped: false },
  { level: 20, name: 'Gold Radiance', color: '#F7C948', glowColor: 'rgba(247, 201, 72, 0.5)', isUnlocked: false, isEquipped: false },
  { level: 25, name: 'Obsidian Shadow', color: '#8B5CF6', glowColor: 'rgba(139, 92, 246, 0.4)', isUnlocked: false, isEquipped: false },
  { level: 30, name: 'Cosmic Flame', color: '#9333EA', glowColor: 'rgba(147, 51, 234, 0.6)', isUnlocked: false, isEquipped: false }
];

export const mockSavedFits: SavedFit[] = [
  {
    id: 'fit1',
    name: 'Daily Grind',
    items: {
      headwear: mockOutfitItems.find(i => i.id === 'h2'),
      top: mockOutfitItems.find(i => i.id === 't3'),
      bottom: mockOutfitItems.find(i => i.id === 'b3'),
      footwear: mockOutfitItems.find(i => i.id === 'f2'),
      accessory: mockOutfitItems.find(i => i.id === 'a2')
    },
    aura: mockAuras[1], // Neon Pulse
    isEquipped: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'fit2',
    name: 'Gym Beast',
    items: {
      top: mockOutfitItems.find(i => i.id === 't1'),
      bottom: mockOutfitItems.find(i => i.id === 'b1'),
      footwear: mockOutfitItems.find(i => i.id === 'f1'),
      accessory: mockOutfitItems.find(i => i.id === 'a1')
    },
    aura: mockAuras[0], // Soft Glow
    isEquipped: false,
    createdAt: new Date('2024-01-10')
  }
];

export const mockThemedSets: ThemedSet[] = [
  {
    id: 'set1',
    name: 'Starter Grind',
    description: 'Essential gear for beginners',
    levelRange: 'Lv1–4',
    thumbnail: '',
    items: [
      mockOutfitItems.find(i => i.id === 'h1')!,
      mockOutfitItems.find(i => i.id === 't1')!,
      mockOutfitItems.find(i => i.id === 'b1')!,
      mockOutfitItems.find(i => i.id === 'f1')!,
      mockOutfitItems.find(i => i.id === 'a1')!
    ]
  },
  {
    id: 'set2',
    name: 'Athlete Pack',
    description: 'Performance gear for serious athletes',
    levelRange: 'Lv5–9',
    thumbnail: '',
    items: [
      mockOutfitItems.find(i => i.id === 'h2')!,
      mockOutfitItems.find(i => i.id === 't3')!,
      mockOutfitItems.find(i => i.id === 'b3')!,
      mockOutfitItems.find(i => i.id === 'f2')!,
      mockOutfitItems.find(i => i.id === 'a2')!
    ]
  },
  {
    id: 'set3',
    name: 'Street Flex',
    description: 'Urban style meets performance',
    levelRange: 'Lv10–14',
    thumbnail: '',
    items: [
      mockOutfitItems.find(i => i.id === 'h3')!,
      mockOutfitItems.find(i => i.id === 't4')!,
      mockOutfitItems.find(i => i.id === 'b4')!,
      mockOutfitItems.find(i => i.id === 'f3')!,
      mockOutfitItems.find(i => i.id === 'a3')!
    ]
  },
  {
    id: 'set4',
    name: 'Legendary',
    description: 'Elite gear for champions',
    levelRange: 'Lv30',
    thumbnail: '',
    items: mockOutfitItems.filter(i => i.setName === 'Legendary')
  }
];