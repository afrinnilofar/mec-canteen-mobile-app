export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  isVeg: boolean;
  rating: number;
  prepTime: string;
}

export const menuItems: MenuItem[] = [
  // Breakfast Items
  {
    id: 'b1',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato filling',
    price: 60,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    category: 'South Indian',
    mealType: 'breakfast',
    isVeg: true,
    rating: 4.5,
    prepTime: '15 min'
  },
  {
    id: 'b2',
    name: 'Idli Sambar',
    description: 'Steamed rice cakes served with sambar and chutney',
    price: 40,
    image: 'https://images.unsplash.com/photo-1589301773859-8bb11e0b9a82?w=400&h=300&fit=crop',
    category: 'South Indian',
    mealType: 'breakfast',
    isVeg: true,
    rating: 4.3,
    prepTime: '10 min'
  },
  {
    id: 'b3',
    name: 'Poha',
    description: 'Flattened rice with peanuts, curry leaves and spices',
    price: 35,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'breakfast',
    isVeg: true,
    rating: 4.2,
    prepTime: '12 min'
  },
  {
    id: 'b4',
    name: 'Aloo Paratha',
    description: 'Stuffed flatbread with spiced potato filling',
    price: 50,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'breakfast',
    isVeg: true,
    rating: 4.6,
    prepTime: '15 min'
  },
  {
    id: 'b5',
    name: 'Bread Omelette',
    description: 'Fluffy omelette with toasted bread slices',
    price: 45,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    category: 'Continental',
    mealType: 'breakfast',
    isVeg: false,
    rating: 4.1,
    prepTime: '10 min'
  },
  {
    id: 'b6',
    name: 'Upma',
    description: 'Savory semolina porridge with vegetables',
    price: 35,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
    category: 'South Indian',
    mealType: 'breakfast',
    isVeg: true,
    rating: 4.0,
    prepTime: '12 min'
  },

  // Lunch Items
  {
    id: 'l1',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese in rich tomato-based gravy',
    price: 120,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'lunch',
    isVeg: true,
    rating: 4.7,
    prepTime: '20 min'
  },
  {
    id: 'l2',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with tender chicken pieces',
    price: 150,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    category: 'Biryani',
    mealType: 'lunch',
    isVeg: false,
    rating: 4.8,
    prepTime: '25 min'
  },
  {
    id: 'l3',
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with aromatic spices',
    price: 80,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'lunch',
    isVeg: true,
    rating: 4.4,
    prepTime: '15 min'
  },
  {
    id: 'l4',
    name: 'Veg Thali',
    description: 'Complete meal with dal, sabzi, roti, rice and sweet',
    price: 110,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    category: 'Thali',
    mealType: 'lunch',
    isVeg: true,
    rating: 4.6,
    prepTime: '20 min'
  },
  {
    id: 'l5',
    name: 'Chole Bhature',
    description: 'Spicy chickpea curry with deep-fried bread',
    price: 90,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'lunch',
    isVeg: true,
    rating: 4.5,
    prepTime: '18 min'
  },
  {
    id: 'l6',
    name: 'Fried Rice',
    description: 'Stir-fried rice with vegetables and soy sauce',
    price: 100,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    category: 'Chinese',
    mealType: 'lunch',
    isVeg: true,
    rating: 4.3,
    prepTime: '15 min'
  },
  {
    id: 'l7',
    name: 'Rajma Chawal',
    description: 'Red kidney bean curry served with steamed rice',
    price: 85,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'lunch',
    isVeg: true,
    rating: 4.4,
    prepTime: '18 min'
  },
  {
    id: 'l8',
    name: 'Egg Curry',
    description: 'Boiled eggs in spiced tomato gravy',
    price: 95,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'lunch',
    isVeg: false,
    rating: 4.2,
    prepTime: '20 min'
  },

  // Dinner Items
  {
    id: 'd1',
    name: 'Butter Chicken',
    description: 'Tender chicken in creamy tomato-butter sauce',
    price: 140,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'dinner',
    isVeg: false,
    rating: 4.9,
    prepTime: '25 min'
  },
  {
    id: 'd2',
    name: 'Veg Biryani',
    description: 'Fragrant rice with mixed vegetables and spices',
    price: 120,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    category: 'Biryani',
    mealType: 'dinner',
    isVeg: true,
    rating: 4.5,
    prepTime: '22 min'
  },
  {
    id: 'd3',
    name: 'Kadai Paneer',
    description: 'Cottage cheese cooked with bell peppers in kadai spices',
    price: 130,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'dinner',
    isVeg: true,
    rating: 4.6,
    prepTime: '20 min'
  },
  {
    id: 'd4',
    name: 'Naan with Dal Makhani',
    description: 'Butter naan served with creamy black lentils',
    price: 110,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'dinner',
    isVeg: true,
    rating: 4.7,
    prepTime: '18 min'
  },
  {
    id: 'd5',
    name: 'Chicken Fried Rice',
    description: 'Fried rice with chicken pieces and vegetables',
    price: 125,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    category: 'Chinese',
    mealType: 'dinner',
    isVeg: false,
    rating: 4.4,
    prepTime: '15 min'
  },
  {
    id: 'd6',
    name: 'Mixed Veg Curry',
    description: 'Assorted vegetables in aromatic curry sauce',
    price: 100,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    category: 'North Indian',
    mealType: 'dinner',
    isVeg: true,
    rating: 4.3,
    prepTime: '20 min'
  },

  // Snacks & Beverages
  {
    id: 's1',
    name: 'Samosa',
    description: 'Crispy pastry filled with spiced potatoes',
    price: 20,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    category: 'Snacks',
    mealType: 'breakfast',
    isVeg: true,
    rating: 4.5,
    prepTime: '5 min'
  },
  {
    id: 's2',
    name: 'Chai',
    description: 'Traditional Indian spiced tea',
    price: 15,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    category: 'Beverages',
    mealType: 'breakfast',
    isVeg: true,
    rating: 4.7,
    prepTime: '3 min'
  },
  {
    id: 's3',
    name: 'Cold Coffee',
    description: 'Chilled coffee with ice cream',
    price: 50,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
    category: 'Beverages',
    mealType: 'lunch',
    isVeg: true,
    rating: 4.6,
    prepTime: '5 min'
  }
];

export const categories = [
  'All',
  'North Indian',
  'South Indian',
  'Chinese',
  'Biryani',
  'Thali',
  'Continental',
  'Snacks',
  'Beverages'
];
