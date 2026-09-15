import kahwaSignatureLatte from "../assets/kahwa-signature-latte.jpg";
import kahwaPistachioCake from "../assets/kahwa-pistachio-cake.jpg";
import kahwaIcedMatcha from "../assets/kahwa-iced-matcha.jpg";
import kahwaHouseBrew from "../assets/kahwa-house-brew.jpg";
import kahwaFlatWhite from "../assets/kahwa-flat-white.jpg";
import kahwaEspressoPiccolo from "../assets/kahwa-espresso-piccolo.jpg";

export interface MenuItem {
  id: string;
  name: string;
  category: "coffee" | "specialty" | "desserts";
  categoryName: string;
  price: string;
  tag: string;
  description: string;
  image: string;
  alt: string;
}

export const menuCategories = [
  { id: "all", label: "All Items" },
  { id: "coffee", label: "Coffee & Brews" },
  { id: "specialty", label: "Specialty Drinks" },
  { id: "desserts", label: "Cakes & Treats" },
] as const;

export type MenuCategory = (typeof menuCategories)[number]["id"];

export const menuItems: MenuItem[] = [
  {
    id: "sig-latte",
    name: "Kahwa Signature Latte",
    category: "coffee",
    categoryName: "Signature Coffee",
    price: "$6.25",
    tag: "Signature",
    description:
      "House-crafted espresso with silky micro-foam and artisanal latte art, served with an artisan biscotti.",
    image: kahwaSignatureLatte,
    alt: "Kahwa Signature Latte with latte art and biscuit in a Kahwa ceramic cup",
  },
  {
    id: "pistachio-cake",
    name: "Pistachio Milk Cake & Latte",
    category: "desserts",
    categoryName: "Cakes & Sweets",
    price: "$8.50",
    tag: "Customer Favourite",
    description:
      "Decadent milk-soaked pistachio sponge topped with fresh cream, paired with our house iced pistachio latte.",
    image: kahwaPistachioCake,
    alt: "Slice of pistachio milk cake paired with a Kahwa pistachio latte",
  },
  {
    id: "iced-matcha",
    name: "Ceremonial Iced Matcha Latte",
    category: "specialty",
    categoryName: "Specialty Cold",
    price: "$6.75",
    tag: "Specialty",
    description:
      "Authentic stone-ground Japanese green tea hand-whisked and layered over chilled creamy milk and ice.",
    image: kahwaIcedMatcha,
    alt: "Iced ceremonial matcha latte in a Kahwa glass mug with straw",
  },
  {
    id: "house-brew",
    name: "Kahwa Fresh House Brew",
    category: "coffee",
    categoryName: "Filter & Drip",
    price: "$4.50",
    tag: "Classic",
    description:
      "Single-origin roasted beans brewed fresh with notes of dark cacao, toasted hazelnut, and smooth crema.",
    image: kahwaHouseBrew,
    alt: "Steaming Kahwa fresh brewed coffee in a branded ceramic mug with biscotti",
  },
  {
    id: "flat-white",
    name: "Artisan Flat White / Cortado",
    category: "coffee",
    categoryName: "Artisan Espresso",
    price: "$5.50",
    tag: "Barista Pick",
    description:
      "Double shot of smooth espresso balanced with equal parts warm, velvety textured milk in a classic tumbler.",
    image: kahwaFlatWhite,
    alt: "Artisan flat white coffee served in a glass tumbler with latte art",
  },
  {
    id: "espresso-piccolo",
    name: "Espresso Piccolo",
    category: "coffee",
    categoryName: "Espresso",
    price: "$4.25",
    tag: "Bold & Pure",
    description:
      "Intense single espresso softened with a touch of steamed milk for coffee lovers craving pure character.",
    image: kahwaEspressoPiccolo,
    alt: "Hand-crafted espresso piccolo in glass on wooden tabletop",
  },
];
