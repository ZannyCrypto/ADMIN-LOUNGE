export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cocktails' | 'spirits' | 'small-chops' | 'garden';
  tag?: string;
}

export interface WeekdayEvent {
  day: string;
  shortDay: string;
  title: string;
  time: string;
  description: string;
  motif: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: 'space' | 'drinks' | 'vibes';
}

export const MENU_ITEMS: MenuItem[] = [
  // COCKTAILS
  {
    id: 'c1',
    name: 'The Ring Road Royal',
    description: 'A smoky blend of premium aged dark spirits, aromatic bitters, fresh citrus zests, infused with sweet local spices and a flamed orange peel.',
    price: 15000,
    category: 'cocktails',
    tag: 'Signature'
  },
  {
    id: 'c2',
    name: 'Liberty Jam Sour',
    description: 'Premium dark rum, fresh hibiscus flower extract, lime squeeze, local ginger extract, topped with a spicy peppered gold sugar rim.',
    price: 13500,
    category: 'cocktails',
    tag: 'House Special'
  },
  {
    id: 'c3',
    name: 'The Admin Sovereign',
    description: 'A high-energy twist on the classic whiskey sour: premium bourbon, fresh yuzu syrup, bitters, and an elegant red wine float.',
    price: 16000,
    category: 'cocktails',
    tag: 'Popular'
  },
  {
    id: 'c4',
    name: 'Ibadan Sunrise',
    description: 'A colorful, glowing cocktail crafted with botanical gin, pineapple reduction, sweet grenadine, and a refreshing sprig of mint.',
    price: 14000,
    category: 'cocktails'
  },
  {
    id: 'c5',
    name: 'The Brass Botanist',
    description: 'Local floral-infused gin, elderflower essence, tonic water, garnished with dehydrated lime wheels and fresh rosemary.',
    price: 14500,
    category: 'cocktails'
  },

  // SPIRITS
  {
    id: 's1',
    name: 'Macallan 15 Years Double Cask',
    description: 'Rich dried fruits and ginger balanced with butterscotch and warm oak. Served over a slow-melting clear ice sphere.',
    price: 85000,
    category: 'spirits',
    tag: 'By the Glass'
  },
  {
    id: 's2',
    name: 'Don Julio Reposado',
    description: 'Smooth, premium agave tequila with golden honey notes, sweet pear, and subtle oak undertones.',
    price: 75000,
    category: 'spirits'
  },
  {
    id: 's3',
    name: 'Hennessy VSOP',
    description: 'The epitome of classic cognac. Exceptionally smooth and balanced, served with a selection of chocolate treats.',
    price: 65000,
    category: 'spirits'
  },

  // SMALL CHOPS & FOOD (Admin Food - Grill & Signature Catfish)
  {
    id: 'f1',
    name: 'Legendary Giant Grilled Catfish',
    description: 'Our world-famous giant whole catfish grilled fresh over charcoal, heavily basted in spicy local chili paste, served with plantain (Dodo), yam chips, and Admin signature dip.',
    price: 25000,
    category: 'small-chops',
    tag: 'Reviewer Go-To'
  },
  {
    id: 'f2',
    name: 'Spicy Asun Sliders',
    description: 'Slow-smoked spicy goat meat tossed with native habaneros and onions, sandwiched in buttered brioche buns with crispy sweet potato chips.',
    price: 12500,
    category: 'small-chops',
    tag: 'Chef Choice'
  },
  {
    id: 'f3',
    name: 'Peppered Snail & Gizzard Bowl',
    description: 'Meaty snails and seasoned gizzards deep fried and sautéed in an extremely spicy red pepper and onion sauce.',
    price: 14000,
    category: 'small-chops'
  },
  {
    id: 'f4',
    name: 'Admin Platter (Grill Combo)',
    description: 'A generous sharing platter of spicy peppered wings, crispy spring rolls, golden samosas, and seasoned yam fries.',
    price: 18500,
    category: 'small-chops',
    tag: 'Popular'
  },

  // GARDEN MENU
  {
    id: 'g1',
    name: 'Admin Fresh Scent Leaf Penne',
    description: 'Warm Penne pasta tossed in a native scent-leaf pesto sauce, cherry tomatoes, and grilled bell peppers, finished with local spices.',
    price: 15000,
    category: 'garden'
  },
  {
    id: 'g2',
    name: 'Ring Road Green Bowl',
    description: 'Organic crisp garden greens, sweet potato cubes, roasted avocado, cherry tomatoes, and plantain croutons, with a zesty citrus dressing.',
    price: 11000,
    category: 'garden',
    tag: 'Freshly Delivered'
  }
];

export const WEEKDAY_EVENTS: WeekdayEvent[] = [
  {
    day: 'Monday',
    shortDay: 'MON',
    title: 'Admin Warm-Up Night',
    time: '5:00 PM – Late',
    description: 'Start your week in a relaxed atmosphere. Ambient colorful light setups, smooth background tunes, and cold drinks. Ideal for early-week meetings and chilling before the energy picks up.',
    motif: 'Chill Vibes • Lounge Melodies',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=600'
  },
  {
    day: 'Tuesday',
    shortDay: 'TUE',
    title: 'Live Band Midweek',
    time: '8:00 PM – Late',
    description: 'Experience the magic of live instrumentation. Featuring incredible guest acts like Tunde Stainless playing hit highlife, juju, and Afrobeat tunes. Entry is free—simply grab a cold drink at the bar and enjoy.',
    motif: 'Tunde Stainless Live • Free Entry with Drink',
    image: 'https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&q=80&w=600'
  },
  {
    day: 'Wednesday',
    shortDay: 'WED',
    title: 'Admin Game & Sports Night',
    time: '6:00 PM – Midnight',
    description: 'A vibrant evening combining interactive sports viewing on wide screens, local social games, card tables, and friendly group competitions. Enjoy our fully stocked bar and grill menu with your friends.',
    motif: 'Social Games • Live Sports • Chilled Network',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=600'
  },
  {
    day: 'Thursday',
    shortDay: 'THU',
    title: 'Acoustic & Grills Evening',
    time: '6:00 PM – Midnight',
    description: 'Enjoy smooth acoustic cover performances paired with our famous grill section. Freshly prepared giant grilled catfish and delicious peppered snail deliveries from the Admin Food kitchen.',
    motif: 'Acoustic Covers • Fresh Grills',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600'
  },
  {
    day: 'Friday',
    shortDay: 'FRI',
    title: 'Admin Friday (Flagship Night)',
    time: '7:45 PM – Dawn',
    description: 'The premier nightlife experience driving the nightlife wave in Ibadan. A massive social and networking hub featuring high-energy club sets, dynamic light installations, famous hype men, and guest DJs spinning till dawn.',
    motif: 'Club Anthems • Flagship High Energy • Hype & DJs',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=600'
  },
  {
    day: 'Saturday',
    shortDay: 'SAT',
    title: 'Championship Broadcasts & Vibes',
    time: '4:00 PM – Late',
    description: 'The ultimate sports viewing center. Major global football finals and league games broadcasted live in a high-fidelity setup. Blends into a luxury club lounge environment with celebrity hosts and fan activations.',
    motif: 'Football Screenings • Celebrity Hosts • Late Clubbing',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600'
  },
  {
    day: 'Sunday',
    shortDay: 'SUN',
    title: 'Elite Sunday',
    time: '6:00 PM – Late',
    description: 'Wrap up the weekend at our legendary Sunday party. Blends high-energy clubbing rhythms with fun social board games, engaging hosts, premium drinks, and chilled networking vibes.',
    motif: 'Social Games • High-Energy Clubbing • Elite Networks',
    image: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=600'
  }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'g_space1',
    url: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=800',
    caption: 'Our premium club setup at Liberty Junction featuring state-of-the-art light installations.',
    category: 'space'
  },
  {
    id: 'g_drink1',
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    caption: 'Signature craft cocktails and premium spirits poured by expert mixologists.',
    category: 'drinks'
  },
  {
    id: 'g_vibe1',
    url: 'https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&q=80&w=800',
    caption: 'Tuesdays Live Band night featuring vibrant performances under cozy lights.',
    category: 'vibes'
  },
  {
    id: 'g_space2',
    url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800',
    caption: 'The main indoor club lounge at Admin Ibadan — where the energy never dies.',
    category: 'space'
  },
  {
    id: 'g_drink2',
    url: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800',
    caption: 'Locally famous giant grilled catfish, freshly made-to-order at Admin Food.',
    category: 'drinks'
  },
  {
    id: 'g_vibe2',
    url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800',
    caption: 'Flagship Admin Friday vibes with a high-profile crowd of Ibadan builders.',
    category: 'vibes'
  }
];
