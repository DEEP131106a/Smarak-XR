import type { CultureStatus } from '../types/heritageAlive';

// ─── Types ─────────────────────────────────────────────────────────────────
export type CityCategory = 'food' | 'dance' | 'monument' | 'dress' | 'story' | 'vanishing' | 'festival';

export type CulturalEra = 'past' | 'changing' | 'present' | 'vanishing';

export type CityItem = {
  id: string;
  name: string;
  category: CityCategory;
  era: CulturalEra;
  status: CultureStatus;
  description: string;
  details: string;
  image: string;
  tags?: string[];
  ingredients?: string[];   // food
  steps?: string[];         // dance / craft
  materials?: string[];     // dress
  yearRange?: string;       // historical era
  artisanCount?: number;
  funFact?: string;
};

export type CityTimeline = {
  year: string;
  label: string;
  summary: string;
  food: string;
  dress: string;
  music: string;
  life: string;
  image: string;
};

export type CityData = {
  id: string;
  name: string;
  state: string;
  country: string;
  tagline: string;
  description: string;
  heroImage: string;
  coords: { x: number; y: number };
  category: string;
  population: string;
  founded: string;
  language: string;
  timeline: CityTimeline[];
  items: CityItem[];
};

// ─── City Dataset ──────────────────────────────────────────────────────────

export const CITY_DATA: CityData[] = [
  // ═══════════════════════════════════════════════════════
  //  AMRITSAR, PUNJAB
  // ═══════════════════════════════════════════════════════
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    country: 'India',
    tagline: 'The Soul of Punjab — Land of the Golden Temple & Living Traditions',
    description:
      'Amritsar, founded in 1577 by Guru Ram Das Ji, is the spiritual and cultural heartbeat of the Sikh faith and Punjabi heritage. Home to the magnificent Harmandir Sahib (Golden Temple), this city blends ancient spirituality with the most vibrant food streets, folk arts, and embroidery traditions in South Asia.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Elderly_Sikh_Man_outside_Mata_Temple_-_Amritsar_-_Punjab_-_India_%2812698154594%29.jpg',
    coords: { x: 30, y: 25 },
    category: 'Sacred Heritage',
    population: '1.3 Million',
    founded: '1577 CE',
    language: 'Punjabi, Hindi',
    timeline: [
      {
        year: '1577–1900s',
        label: 'Sikh Golden Age',
        summary: 'Founded by Guru Ram Das Ji; Maharaja Ranjit Singh ruled the Sikh Empire from Lahore with Amritsar as its spiritual capital.',
        food: 'Clay tandoor Makki di Roti, Sarson da Saag with hand-churned white butter, Gur (jaggery) Lassi in brass tumblers',
        dress: 'Phulkari hand-embroidered shawls (Bagh), Nankeen cotton Kurtas, Silk Patiala Salwars, leather Punjabi Juttis',
        music: 'Tumbi & Algoza played under banyan trees; Gurbani Kirtan in Harmandir Sahib 24/7',
        life: 'Communal agrarian life, Persian water wells, weekly Vaisakhi fairs, artisan guilds in bazaars',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '1900–1970s',
        label: 'Partition & Resilience',
        summary: 'The 1947 Partition brought massive migration. Amritsar rebuilt its cultural identity through food, Bhangra, and faith.',
        food: 'Amritsari Kulcha with chole emerged as a street staple; Pinni sweet distributed in gurudwaras',
        dress: 'Synthetic Phulkari dupattas became common; bright Patiala suits replaced khaddar; Jutti workshops thrived',
        music: 'Bhangra became a cultural export; All India Radio broadcast folk recordings from Amritsar studios',
        life: 'Refugee rehabilitation, growth of bazaars, birth of Amritsari cooking tradition in new urban settings',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '1980s–2000s',
        label: 'Cultural Flux',
        summary: 'Green Revolution wealth and political turmoil coexisted. NRI diaspora reconnected with roots through music and cuisine.',
        food: 'Dal Makhani, Butter Chicken popularized in tourist-facing dhabas; Amritsari Fish Tikka became globally known',
        dress: 'Designer Phulkari jackets, salwar-kameez with western accents; NRI fashion influenced local trends',
        music: 'Gurdas Maan, Surjit Bindrakhia defined modern Punjabi folk; cassette tape era; Dhol-Bhangra at weddings',
        life: 'Heritage tourism boom; Heritage Walk launched; Golden Temple draws 100,000 pilgrims daily',
        image: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '2020s',
        label: 'Living Present',
        summary: 'Amritsar blends its sacred identity with modern tourism, digital art, and conscious preservation of folk traditions.',
        food: 'Artisan organic farms reviving heritage grain recipes; international chefs learning Amritsari Kulcha technique',
        dress: 'Urban Punjabi streetwear fusion; Phulkari going global via fashion weeks; sustainability-focused Jutti design',
        music: 'AR Rahman collaborates with Gurbani musicians; Lo-Fi Tumbi remixes on Spotify; live Kirtan streaming worldwide',
        life: 'Smart heritage zones; Golden Temple AR experiences; Langar (community kitchen) serving 100,000 meals/day',
        image: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=800&q=80',
      },
    ],
    items: [
      // ── MONUMENTS ──────────────────────────────────────
      {
        id: 'amritsar-golden-temple',
        name: 'Sri Harmandir Sahib (Golden Temple)',
        category: 'monument',
        era: 'present',
        status: 'Thriving',
        description: 'The holiest shrine of Sikhism, plated in 750 kg of pure gold, built over a sacred sarovar (pool). Over 100,000 pilgrims visit daily.',
        details: 'Commissioned by Guru Arjan Dev Ji in 1589, the Harmandir Sahib ("Abode of God") is built on a 67-foot square platform in the center of the Amrit Sarovar (Pool of Nectar). The four entrances symbolize openness to all faiths. The ground floor enshrine the Guru Granth Sahib (Holy Scripture) which is recited in continuous relays from 4 AM to 10 PM daily. The complex hosts the world\'s largest free community kitchen (Langar) serving 100,000 hot vegetarian meals daily to people of all faiths.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/1280px-The_Golden_Temple_of_Amrithsar_7.jpg',
        tags: ['Sikh', 'Sacred', 'UNESCO Tentative', 'Gold Temple', 'Langar'],
        yearRange: '1589 CE – Present',
        funFact: 'The Golden Temple uses 750 kg of 24-carat gold on its upper half, donated by Maharaja Ranjit Singh in 1830.',
      },
      {
        id: 'amritsar-jallianwala',
        name: 'Jallianwala Bagh',
        category: 'monument',
        era: 'past',
        status: 'Thriving',
        description: 'A historic public garden where the British Amritsar Massacre of 1919 claimed hundreds of innocent lives. Now a national memorial.',
        details: 'On April 13, 1919 (Baisakhi day), Brigadier General Dyer ordered troops to fire on unarmed civilians celebrating the harvest festival, killing over 1,000 and wounding 1,500+. The Narrow Lane entrance — only 10 feet wide — prevented escape. The bullet marks are still preserved in the walls. The "Martyrs\' Well" shows where hundreds jumped to avoid bullets. This site became a catalyzing moment for India\'s independence movement.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jallianwala_Bagh%2C_Amritsar_01.jpg/1280px-Jallianwala_Bagh%2C_Amritsar_01.jpg',
        tags: ['History', 'Freedom', 'National Memorial', 'British Raj', '1919'],
        yearRange: '1919 CE Massacre | Memorial: 1951',
        funFact: 'You can still see original bullet holes in the walls, preserved as a testament to the massacre.',
      },
      {
        id: 'amritsar-wagah',
        name: 'Wagah Border Retreat Ceremony',
        category: 'monument',
        era: 'present',
        status: 'Thriving',
        description: 'The electrifying daily flag-lowering ceremony at the India-Pakistan border — a spectacle of military precision, nationalism, and cultural exchange.',
        details: 'Held every evening since 1959, the Wagah Border ceremony involves the Border Security Force of India and Pakistan Rangers performing a highly synchronized and theatrical retreat ceremony. The gates open for exactly 5 minutes at sunset. The ceremony draws 10,000+ spectators daily from both sides. The BSF and Pakistan Rangers perform almost identical aggressive-then-graceful marches before shaking hands at the border line. In 2005, the ceremony was toned down to be more peaceful.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Wagah_Border_Ceremony.jpg/1280px-Wagah_Border_Ceremony.jpg',
        tags: ['Border', 'Military', 'Nationalism', 'Pakistan', 'Evening Ceremony'],
        yearRange: '1959 CE – Present',
        funFact: 'The guards\' boots weigh 4 kg each, and the high kick must reach above the guard\'s nose level.',
      },
      // ── FOOD ──────────────────────────────────────────
      {
        id: 'amritsar-kulcha',
        name: 'Amritsari Kulcha',
        category: 'food',
        era: 'present',
        status: 'Thriving',
        description: 'The iconic stuffed tandoor flatbread of Amritsar — crisp on outside, pillow-soft inside, filled with spiced potatoes and smothered in white butter.',
        details: 'Kulcha in Amritsar is not just food — it is a cultural institution. The dough is fermented overnight with yogurt, then stuffed with mashed potato, onion, green chilli, pomegranate seeds, and cumin. It is slapped onto the inner wall of a clay tandoor at 480°C. Famous spots include Kanha Sweets (since 1965) and Bhai Kulwant Singh Kulcha Wale on Lawrence Road. It is always paired with chana (chickpea curry), tamarind chutney, and raw onion.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Chole_Kulcha_Meal_-_Order_Food_Online_in_Mumbai_%2831013272937%29.jpg/1280px-Chole_Kulcha_Meal_-_Order_Food_Online_in_Mumbai_%2831013272937%29.jpg',
        tags: ['Street Food', 'Tandoor', 'Potato Stuffed', 'Breakfast', 'Punjab Icon'],
        ingredients: ['Maida flour (fermented)', 'Boiled potatoes', 'Green chillies', 'Pomegranate seeds (anardana)', 'Cumin', 'Onion', 'White butter (makhan)', 'Chana curry (paired)'],
        funFact: 'The best kulcha shops open at 6 AM and sell out by 11 AM — you must queue early!',
      },
      
      {
        id: 'amritsar-makki-sarson',
        name: 'Makki di Roti & Sarson da Saag',
        category: 'food',
        era: 'past',
        status: 'Declining',
        description: 'The ancestral winter staple of Punjab — yellow maize flatbread eaten with mustard greens slow-cooked over hours, drowned in fresh white butter.',
        details: 'This dish is the taste memory of Punjabi winters. Sarson da Saag requires fresh wild mustard leaves, bathua greens (pigweed), and spinach slow-cooked in an iron kadhai for 3–4 hours. Makki di Roti (maize flour flatbread) is hand-patted without a rolling pin — only artisans and village grandmothers master the technique. In Amritsar, authentic versions are increasingly rare as maize fields disappear. The traditional recipe uses jaggery, white butter from a clay pot, and requires a wood-fire chulha.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Saagroti.jpg',
        tags: ['Winter Food', 'Village Recipe', 'Maize', 'Mustard Greens', 'Traditional'],
        ingredients: ['Wild mustard leaves (sarson)', 'Bathua (pigweed)', 'Spinach', 'Corn maize flour', 'White butter (makhan)', 'Jaggery (gur)', 'Ginger', 'Garlic'],
        funFact: 'A traditional Makki di Roti is hand-shaped on a banana leaf — the technique takes years to master.',
      },
      
      {
        id: 'amritsar-lassi',
        name: 'Amritsari Hand-Churned Lassi',
        category: 'food',
        era: 'present',
        status: 'Thriving',
        description: 'A legendary thick yogurt drink served in tall clay or brass tumblers at Amritsar\'s famous Gyan di Lassi shop — layered with cream, topped with golden butter.',
        details: 'Amritsari Lassi is not just a drink — it is a ritual. The yogurt is churned using a traditional wooden "madani" (hand-churner) for hours. At legendary shops like Gyan di Hatti on Lawrence Road (since 1947) and Ahuja Lassi, it is served in 1-litre clay tumblers topped with a mountain of fresh cream and dollops of white butter. A single glass contains 600+ calories — it is a full meal in itself. Best consumed on cold winter mornings.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Salt_lassi.jpg/1280px-Salt_lassi.jpg',
        tags: ['Drink', 'Yogurt', 'Cream', 'Clay Tumbler', 'Street Food Classic'],
        ingredients: ['Full-fat buffalo yogurt', 'Hand-churned cream (malai)', 'White butter', 'Sugar or salt', 'Saffron (optional)', 'Rose water'],
        funFact: 'The famous Gyan di Lassi shop has operated since 1947 — the year of India\'s independence.',
      },
      
      {
        id: 'amritsar-fish-tikka',
        name: 'Amritsari Fried Fish (Macchi)',
        category: 'food',
        era: 'present',
        status: 'Thriving',
        description: 'Crispy batter-fried river fish marinated in ajwain, gram flour, and raw mango — a prized street snack of old Amritsar bazaars.',
        details: 'Amritsari fish uses freshwater Rohu or Sole fish from the Ravi and Beas rivers. The batter made with besan (chickpea flour), carom seeds (ajwain), red chilli, raw mango powder (amchur), and egg is the secret. Served on newspaper with mint chutney at packed stalls near Shree Darbar Sahib. The dish is especially famous at Makhan Fish and Chicken Corner, open since 1962. The fish must be fried in pure mustard oil for authentic flavor.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
        tags: ['Fried Fish', 'Ajwain', 'River Fish', 'Street Snack', 'Mustard Oil'],
        ingredients: ['Rohu/Sole fish', 'Chickpea flour (besan)', 'Carom seeds (ajwain)', 'Raw mango powder (amchur)', 'Red chilli', 'Mustard oil', 'Ginger-garlic paste'],
        
    },
    // ── DANCE ─────────────────────────────────────────
      {
        id: 'amritsar-bhangra',
        name: 'Bhangra — Harvest Dance of Punjab',
        category: 'dance',
        era: 'present',
        status: 'Thriving',
        description: 'The explosive, joyful harvest dance of Punjab — originating from Vaisakhi festival fields, now a global icon driven by the powerful Dhol drum.',
        details: 'Bhangra originated in the Majha region of Punjab (including Amritsar) as a harvest celebration during Vaisakhi. Farmers would perform energetic group dances in wheat fields to celebrate the winter crop. The dance is driven by the double-headed Dhol drum and features high kicks, arm swings, shoulder rolls, and acrobatic jumps. Traditional costumes include bright Kurta-Pyjama, Turla (tasselled turban), Waistcoat, and Chadar. Modern Bhangra has evolved into competitive university teams and global music remixes.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Bhangra-dance.jpg',
        tags: ['Harvest Dance', 'Dhol Drum', 'Vaisakhi', 'Group Dance', 'Global Icon'],
        steps: ['Dhol Beat Introduction (8-count)', 'Chakkar (spinning on one foot)', 'Jugiyan (foot twist at knees)', 'Flip turns (Ghoomna)', 'Tribal high kicks (Chapaati)', 'Ghodi (horse mock riding step)', 'Grand Jhatka (shoulder isolation)', 'Tumbi improvisation'],
        funFact: 'Bhangra was introduced to global pop in 1987 by artist Kuldip Manak and later by Apache Indian in UK.',
      },
      
      {
        id: 'amritsar-giddha',
        name: 'Giddha — Women\'s Folk Dance of Punjab',
        category: 'dance',
        era: 'changing',
        status: 'Declining',
        description: 'The graceful, witty women\'s counterpart to Bhangra — a circle dance performed with satirical "boliyaan" (folk poetry couplets) teasing social customs.',
        details: 'Giddha is performed exclusively by women in a circle formation. The dance incorporates boli (spoken poetic couplets) that playfully mock in-laws, village gossip, or social situations. Women clap rhythmically and perform mime-like expressions between verses. Traditional Giddha costumes are the most colorful: heavily embroidered Phulkari dupatta, bright Patiala salwars, and Gota-Patti cholis. Giddha is most commonly performed at weddings, Teej festival, and Vaisakhi. It is increasingly rare as younger women prefer Bhangra or modern dance forms.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Giddha_1.jpg',
        tags: ['Women\'s Dance', 'Boliyaan', 'Wedding', 'Teej', 'Circle Dance'],
        steps: ['Circle formation with clapping (taali)', 'Lead dancer steps to center for boli recitation', 'Boli (satirical poetry couplet)', 'Nathni (nose-ring gesture mime)', 'Chunni spreading gesture', 'Return to circle with shoulder dance', 'Group chorus refrain'],
        funFact: 'The "boliyaan" (couplets) in Giddha are spontaneously improvised — a skilled performer never repeats a boli.',
      },
      
      {
        id: 'amritsar-jhumar',
        name: 'Jhumar Dance',
        category: 'dance',
        era: 'past',
        status: 'At Risk',
        description: 'A slow, graceful group dance from western Punjab, performed at harvest festivals with swaying arm movements — increasingly rare in modern Punjab.',
        details: 'Jhumar originates from the Balochistan-Punjab borderlands and is distinct from Bhangra in its grace and slowness. It is performed in a large circle by men wearing white kurtas with black belts and turbans. The movements emphasize flowing arm gestures, waist swaying, and rhythmic foot patterns set to a slow Dhol beat. Only a handful of master Jhumar performers remain in the Amritsar-Gurdaspur belt. It is classified as "At Risk" by Punjab cultural authorities.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        tags: ['Slow Dance', 'West Punjab', 'Harvest', 'At Risk', 'Circle Formation'],
        steps: ['Slow swaying entry in circle', 'Graceful arm extension (jhumar arm sweep)', 'Cross-step foot pattern', 'Turbaned head tilt', 'Circular group rotation'],
        
    },
    // ── DRESS ─────────────────────────────────────────
      {
        id: 'amritsar-phulkari',
        name: 'Phulkari — Sacred Floral Embroidery',
        category: 'dress',
        era: 'past',
        status: 'At Risk',
        description: 'Punjab\'s most sacred textile tradition — mothers spent years stitching elaborate silk flower patterns on coarse cotton for their daughters\' weddings.',
        details: 'Phulkari (literally "flower work") is embroidered on coarse hand-spun cotton (khaddar) using unspun "pat" silk thread from the reverse side — without any pattern drawn beforehand. The most elaborate form, "Bagh" (garden), covers the entire fabric with geometric floral patterns leaving no blank cloth visible. Traditionally, when a baby girl was born, her grandmother would begin spinning khaddar and collecting silk thread for the wedding Bagh — a process taking 7–12 years. Only 42 master artisans still practice authentic Phulkari in the Majha belt near Amritsar.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Contemporary_Phulkari_design.jpg/1280px-Contemporary_Phulkari_design.jpg',
        tags: ['Embroidery', 'Wedding Tradition', 'Khaddar Cotton', 'Silk Thread', 'At Risk'],
        materials: ['Hand-spun khaddar cotton (base fabric)', 'Unspun pat silk thread (red, orange, yellow)', 'Darning needle (no pattern drawn)', 'Natural madder root dye for red threads'],
        artisanCount: 42,
        funFact: 'A complete "Bagh" Phulkari shawl contains over 150,000 individual hand stitches and takes 18–24 months to complete.',
      },
      
      {
        id: 'amritsar-patiala-salwar',
        name: 'Patiala Salwar — Punjabi Fashion Icon',
        category: 'dress',
        era: 'present',
        status: 'Thriving',
        description: 'The distinctively pleated Punjabi salwar with 7–10 meters of billowing fabric — originally worn in the royal courts of Patiala, now a global fashion statement.',
        details: 'The Patiala Salwar is instantly recognizable by its deep pleats below the knee that create a voluminous bell shape. Traditional ones use 7–10 meters of georgette, cotton, or silk fabric with an elastic waistband. Worn with a fitted kameez (top) and Phulkari dupatta, this ensemble is the quintessential Punjabi women\'s dress. Originally from Patiala royal court in the 19th century, it was adopted by Amritsar\'s artisan classes and later spread nationwide. Today it is available in designer versions worldwide.',
        image: 'https://images.unsplash.com/photo-1583692618476-5a17dda5ef29?auto=format&fit=crop&w=800&q=80',
        tags: ['Salwar', 'Royal Fashion', 'Pleated', 'Ethnic Wear', 'Icon'],
        materials: ['Georgette or silk fabric (7–10 meters)', 'Embroidered Kameez (top)', 'Phulkari dupatta', 'Punjabi Jutti leather shoes'],
        funFact: 'The Patiala Salwar requires exactly 7.5 meters of fabric for a standard size — the pleating technique takes hours.',
      },
      
      {
        id: 'amritsar-punjabi-jutti',
        name: 'Punjabi Jutti — Hand-Stitched Leather Folk Shoes',
        category: 'dress',
        era: 'changing',
        status: 'Declining',
        description: 'Ornate hand-stitched leather shoes with curled toes — crafted by hereditary Mochi (cobbler) artisans using no machines, purely by hand.',
        details: 'Punjabi Juttis are flat leather shoes with an upturned curled toe, no left-right differentiation, and heavily embroidered uppers using silk, mirror work, and brass thread. Each pair takes 3–7 days to stitch by hand. The leather comes from tanned buffalo hide. Famous Jutti bazaars in Amritsar include the Katra Jaimal Singh market and Guru Bazaar. At peak production in the 1970s, over 500 Mochi families worked exclusively on Juttis. Today, fewer than 80 hereditary artisans remain in Amritsar.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Jutti.jpg',
        tags: ['Leather Shoes', 'Hand-Stitched', 'Mochi Artisans', 'Mirror Work', 'Declining'],
        materials: ['Buffalo hide leather (tanned)', 'Silk embroidery thread', 'Mirror work (sheesha)', 'Brass wire borders', 'Cotton lining'],
        artisanCount: 80,
        
    },
    // ── STORIES ───────────────────────────────────────
      {
        id: 'amritsar-story-langar',
        name: 'The Langar Revolution — 500 Years of Free Food',
        category: 'story',
        era: 'present',
        status: 'Thriving',
        description: 'How the Sikh community kitchen at the Golden Temple has fed 100,000 people every single day for 500 years — an unbroken act of radical equality.',
        details: 'Langar (community kitchen) was established by Guru Nanak Dev Ji in the 15th century as a revolutionary act against caste inequality. The rule is simple: everyone sits on the same floor level (pangat) and eats the same food regardless of faith, caste, or status. The Golden Temple Langar serves 80,000–100,000 hot vegetarian meals daily (rising to 200,000 during festivals). The kitchen has 11 giant wood-fired cauldrons, 300+ volunteer cooks (sevadhars), and operates 24/7/365. It is entirely funded by voluntary community donations and labor. During COVID-19 lockdowns, the Langar distributed 50,000 food packages daily to migrant workers across Punjab.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Langar.jpg',
        tags: ['Langar', 'Free Food', 'Equality', 'Community Kitchen', 'Sikh Heritage'],
        funFact: 'The Golden Temple Langar uses 12,000 kg of flour and 2,000 kg of lentils every single day.',
      },
      
      {
        id: 'amritsar-story-partition',
        name: 'Partition Stories — The Night Punjab Was Divided',
        category: 'story',
        era: 'past',
        status: 'Declining',
        description: 'Eyewitness accounts from elderly Amritsaris who lived through the 1947 Partition — memories of neighbors, lost villages, and the human cost of a line drawn on a map.',
        details: 'On August 14-15, 1947, the Radcliffe Line divided Punjab into Indian and Pakistani halves. Amritsar became the flashpoint. Within weeks, 14 million people migrated — the largest human migration in history. Amritsar received hundreds of thousands of refugees from Lahore and western Punjab. Many families still carry the "bundles" (small cloth bags) of soil from their ancestral villages. The Partition Museum in Amritsar (opened 2017) documents 10,000+ testimonies. Elder survivors describe: carrying heirloom Phulkari shawls as their only possession, exchanging houses with Muslim neighbors across the border, and the surreal normalcy of the last days before chaos.',
        image: 'https://images.unsplash.com/photo-1626168012451-c49abe37a03f?auto=format&fit=crop&w=800&q=80',
        tags: ['Partition 1947', 'Oral History', 'Migration', 'Family Stories', 'Living Memory'],
        
    },
    // ── VANISHING ─────────────────────────────────────
      {
        id: 'amritsar-vanishing-tumbi',
        name: 'Tumbi — The One-String Soul of Punjab',
        category: 'vanishing',
        era: 'vanishing',
        status: 'Critical',
        description: 'A single-stringed folk instrument made from a gourd — once played by every Punjabi village musician, now known to fewer than 200 traditional players worldwide.',
        details: 'The Tumbi is a small instrument with a high-pitched single string attached to a hollowed gourd resonator. It produces a piercing, melodic sound that defines classic Punjabi folk music. Master Tumbi players like Lalchand Yamla Jatt (1914–1980) defined an era of music. By 1990, electronic keyboards had replaced Tumbis in weddings. By 2026, fewer than 200 traditional Tumbi players remain across Punjab. No Tumbi-making workshops exist in Amritsar — artisans must travel to Jalandhar or Ludhiana. The instrument risks disappearing within a generation.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Toonba_and_algoza.JPG/1280px-Toonba_and_algoza.JPG',
        tags: ['Folk Instrument', 'One String', 'Gourd', 'Critical', 'Disappearing'],
        artisanCount: 200,
        funFact: 'The Tumbi appears in 78-rpm recordings from 1935 — these may be among the last authentic recordings of the instrument\'s golden era.',
      },
      
      {
        id: 'amritsar-vanishing-tandoor',
        name: 'Community Clay Tandoor Tradition',
        category: 'vanishing',
        era: 'vanishing',
        status: 'Declining',
        description: 'Every Punjabi neighborhood once shared a community clay tandoor for baking bread — a social gathering point that has been replaced by gas stoves and packaged bread.',
        details: 'The community tandoor (clay oven) was a social institution in every Punjabi mohalla (neighborhood). Every morning, women would carry their dough to the shared tandoor, bake rotis together, and exchange neighborhood news. The tandoor itself was maintained by the whole community and was the heart of neighborhood social life. By the 1980s, LPG gas connections had replaced most community tandoors. Today, fewer than 12 functioning community tandoors remain in Amritsar\'s old city areas. The ones that survive are in the Katra Jaimal Singh and Gol Bagh areas.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Tandoor.jpg/1280px-Tandoor.jpg',
        tags: ['Clay Tandoor', 'Community Kitchen', 'Neighborhood', 'Vanishing', 'Social Tradition'],
        artisanCount: 12,
        
    },
    // ── FESTIVALS ─────────────────────────────────────
      {
        id: 'amritsar-vaisakhi',
        name: 'Vaisakhi — Punjab\'s Harvest New Year',
        category: 'festival',
        era: 'present',
        status: 'Thriving',
        description: 'The most important harvest festival of Punjab celebrated on April 13-14 — marking the solar new year, the wheat harvest, and the founding of the Khalsa Panth in 1699.',
        details: 'Vaisakhi holds triple significance for Amritsar: the harvest festival, the Sikh New Year, and the anniversary of Guru Gobind Singh Ji founding the Khalsa Panth (community of the pure) in 1699. The celebrations at the Golden Temple include Nagar Kirtan (a procession of holy scripture), Bhangra and Giddha performances, community langar, and fair grounds with rural sports. In rural areas, farmers perform Bhangra in their fields at sunrise before the harvest begins. The Jallianwala Bagh massacre also occurred on a Vaisakhi day in 1919, adding a solemn dimension to the celebrations.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Baisakhi_mela.jpg/1280px-Baisakhi_mela.jpg',
        tags: ['Harvest Festival', 'Khalsa Panth', 'New Year', 'April 13', 'Golden Temple'],
        funFact: 'On Vaisakhi 1699, Guru Gobind Singh Ji called for volunteers to offer their heads — 5 brave men stepped forward and became the first Panj Piaras (Five Beloved Ones).',
      },
    
    ],
  },

  // ═══════════════════════════════════════════════════════
  //  JAIPUR, RAJASTHAN
  // ═══════════════════════════════════════════════════════
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    tagline: 'The Pink City — Royal Courts, Desert Crafts & Living Rajput Heritage',
    description: 'Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is India\'s first planned city and the capital of Rajasthan. Known as the "Pink City" for its rose-sandstone architecture, it is a living museum of Mughal-Rajput art, block-printing, blue pottery, Ghoomar dance, and desert cuisine.',
    heroImage: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1600&q=80',
    coords: { x: 35, y: 42 },
    category: 'Royal Heritage',
    population: '3.5 Million',
    founded: '1727 CE',
    language: 'Rajasthani, Hindi',
    timeline: [
      {
        year: '1727–1800s',
        label: 'Royal Rajput Golden Age',
        summary: 'Maharaja Sawai Jai Singh II planned Jaipur on Vedic grid principles, inviting artisans from across Rajputana to settle in designated craft guilds.',
        food: 'Royal Thali with Laal Maas (red mutton curry), Dal Baati Churma, Ker Sangri desert berry stew',
        dress: 'Bandhani tie-dye Ghagra Choli with silver Gota-Patti work, 9-meter Safa turbans in royal colors',
        music: 'Manganiyar court musicians playing Sarangi and Khartal; Ghoomar at royal celebrations',
        life: 'Royal artisan guilds (Mohalla system), camel caravan trade, stepwell water culture',
        image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '1900–1970s',
        label: 'Post-Independence Heritage Tourism',
        summary: 'Palace-hotels opened; Rajasthan tourism began. Traditional crafts found new markets.',
        food: 'Pyaaz Kachori became a breakfast staple; Mawa Kachori dessert invented; dahi-baad chaat',
        dress: 'Simplified turbans for middle class; Leheriya (wave-dyed) sarees became commercially popular',
        music: 'AIR Radio broadcast Manganiyar recordings; state patronage of folk arts',
        life: 'Heritage palace conversion to hotels; government craft cooperatives; rural artisan employment',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '2000s–Present',
        label: 'World Heritage Living City',
        summary: 'UNESCO World Heritage City (2019). Global destination for craft tourism, luxury heritage hotels, and Rajasthani cuisine.',
        food: 'Gourmet desert cuisine in palace restaurants; vegan Dal Baati bowls; heritage thali experiences',
        dress: 'Luxury designer Bandhani by Rajasthani couture houses; sustainable natural dye revival',
        music: 'Jaipur Literature Festival; Manganiyar-electronic fusion; Coke Studio Rajasthan collaborations',
        life: 'Smart heritage zone; 8 million tourists/year; digital artisan marketplaces; UNESCO trail',
        image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
      },
    ],
    items: [
      {
        id: 'jaipur-monument-hawa-mahal',
        name: 'Hawa Mahal — Palace of Winds',
        category: 'monument',
        era: 'past',
        status: 'Thriving',
        description: 'A 5-story pink sandstone lattice-work palace built in 1799 with 953 windows that allowed royal women to observe street life while remaining unseen.',
        details: 'Built by Maharaja Sawai Pratap Singh in 1799, the Hawa Mahal ("Palace of Winds") has 953 small windows (jharokhas) decorated with intricate sandstone lattice screens. The design allowed air circulation through the palace keeping interiors 5-10°C cooler than outside — a natural air-conditioning system. The honeycomb-like façade is only one room deep on most floors. It was designed to allow royal women in purdah (seclusion) to observe festivals and street processions below. The pink color came from a sandstone quarried in Dholpur that naturally weathers to a rose-pink hue.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
        tags: ['Palace', 'Pink City', '953 Windows', 'Rajput Architecture', 'UNESCO'],
        yearRange: '1799 CE',
        funFact: 'The Hawa Mahal is only one room deep — it was designed purely as a viewing screen for royal women to watch the street below.',
      },
      
      {
        id: 'jaipur-food-dal-baati',
        name: 'Dal Baati Churma — The Royal Rajasthani Thali',
        category: 'food',
        era: 'present',
        status: 'Thriving',
        description: 'Rajasthan\'s most iconic dish: hard wheat dumplings (baati) baked over cow-dung embers, served with five-lentil dal and crushed sweet churma.',
        details: 'Dal Baati Churma is the definitive Rajasthani meal and a symbol of desert survival cuisine. Baati (wheat dumplings) were invented by Rajput warriors who would bury dough in hot desert sand during battles — returning to find them baked by the sun\'s heat. Today, Baatis are baked in traditional wood or cow-dung fires, then dipped in generous amounts of pure desi ghee. Paired with panchmel dal (five-lentil mix) and churma (coarsely crushed sweet wheat with jaggery and ghee). A proper Rajasthani thali in Jaipur includes 8-10 additional items.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Rajasthani_Dal_Bati_Churma_-_Gurugram_-_Haryana_-_03.jpg/1280px-Rajasthani_Dal_Bati_Churma_-_Gurugram_-_Haryana_-_03.jpg',
        tags: ['Wheat Dumplings', 'Desert Food', 'Rajput', 'Five Lentils', 'Desi Ghee'],
        ingredients: ['Whole wheat flour (for baati)', 'Five-lentil mix (panchmel dal)', 'Pure desi ghee (generous amount)', 'Jaggery (for churma)', 'Cardamom', 'Cow-dung or wood fire'],
        funFact: 'Rajput warriors invented Baati by burying dough in hot desert sand during battles — the sun baked them by nightfall.',
      },
      
      {
        id: 'jaipur-dance-ghoomar',
        name: 'Ghoomar — Royal Rajput Spinning Dance',
        category: 'dance',
        era: 'present',
        status: 'Thriving',
        description: 'A mesmerizing circular spinning dance performed by Rajput women in full-length ghagras — the billowing skirts creating a kaleidoscope of color as they spin.',
        details: 'Ghoomar ("Ghoomna" = to spin) is performed exclusively by women wearing the traditional 14-meter circumference Ghagra (circular skirt) that fans out spectacularly when spinning. The dance involves graceful arm gestures, foot patterns, and the signature "ghoom" (full 360° spinning turn) that reveals alternating colored panels on the multilayered skirt. Originally performed in the royal halls of Jaipur, Udaipur, and Jodhpur palaces during auspicious occasions. The word entered global popularity when AR Rahman featured a Ghoomar sequence in the film "Padmaavat" (2018).',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Ghoomar_dancers_%28Rajasthan%2C_India%2C_2023%29.jpg/1280px-Ghoomar_dancers_%28Rajasthan%2C_India%2C_2023%29.jpg',
        tags: ['Spinning Dance', 'Ghagra Skirt', 'Royal Court', 'Women\'s Dance', 'Rajput'],
        steps: ['Entry in procession format', 'Thumri arm gesture (deer pose)', 'Slow ghoom (clockwise spin)', 'Dupatta wave pattern', 'Foot stomp sequence', 'Full speed multiple ghoom', 'Courtly namaskar (bow gesture)'],
        funFact: 'A professional Ghoomar dancer can spin continuously for 15 minutes without stopping or getting dizzy.',
      },
      
      {
        id: 'jaipur-dress-bandhani',
        name: 'Bandhani — Ancient Tie-Dye of Rajasthan',
        category: 'dress',
        era: 'past',
        status: 'Declining',
        description: 'India\'s oldest tie-dye tradition — thousands of tiny dots of resist-dyeing that create mesmerizing patterns on silk and cotton — a 5,000-year-old craft.',
        details: 'Bandhani (from "bandha" = to tie) involves tying thousands of tiny knots in silk or cotton fabric before dyeing. Each knot creates one circular dot in the final pattern. A single Bandhani dupatta may have 30,000–75,000 individual tied knots. Traditional Bandhani uses natural dyes: turmeric yellow, madder red, indigo blue, and pomegranate green. The craft is hereditary — practiced by the Khatri community who have been tying Bandhani for 5,000 years. Famous patterns include Leheriya (waves), Shikari (hunting scenes), and Bundi (dots).',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Bandhani_print_open.JPG/1280px-Bandhani_print_open.JPG',
        tags: ['Tie-Dye', 'Khatri Community', '5000-Year Craft', 'Natural Dye', 'Silk'],
        materials: ['Silk or cotton fabric', 'Cotton thread (for tying)', 'Natural dyes (turmeric, madder, indigo)', 'Resist medium'],
        artisanCount: 320,
        funFact: 'The word "Bandhani" appears in the 11th-century Rajput chronicles — this craft predates the Mughal Empire by 500 years.',
      },
      
      {
        id: 'jaipur-vanishing-kathputli',
        name: 'Kathputli — Rajasthan\'s String Puppet Theatre',
        category: 'vanishing',
        era: 'vanishing',
        status: 'Critical',
        description: 'The traditional string puppet theatre of Rajasthan — 1,500-year-old puppets that once narrated Rajput legends at royal courts, now performed by fewer than 50 families.',
        details: 'Kathputli (from "katth" = wood, "putli" = puppet) puppets are made from mango or neem wood, painted with natural colors, and dressed in miniature Rajasthani costumes. Each puppet is controlled by 7–14 strings attached to the puppeteer\'s fingers. Themes include the legends of Amar Singh Rathor, Dhola Maru love stories, and Rajput warfare. The Bhat community of Rajasthan has practiced Kathputli for 1,500+ years. By 2010, most Bhat families had migrated to Delhi slums (Kathputli Colony, now demolished). Fewer than 50 hereditary Kathputli families continue the tradition full-time.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/India_Mandawa_marionetas_01_ni.JPG/1280px-India_Mandawa_marionetas_01_ni.JPG',
        tags: ['String Puppets', 'Wood Craft', 'Bhat Community', 'Critical', 'Royal Court Art'],
        artisanCount: 50,
        funFact: 'Kathputli puppets appear in the Ajanta Cave murals (5th century CE) — proving the craft is at least 1,500 years old.',
      },
    
    ],
  },

  // ═══════════════════════════════════════════════════════
  //  VARANASI, UTTAR PRADESH
  // ═══════════════════════════════════════════════════════
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    tagline: 'The Eternal City — Where Ancient India Meets the Sacred Ganges',
    description: 'Varanasi (also called Kashi or Banaras) is one of the world\'s oldest continuously inhabited cities, dating to 1200 BCE. On the banks of the sacred Ganga, it is the spiritual capital of Hinduism — a city of Ghats, silk weaving, classical music, and the daily Aarti (prayer ceremony).',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=80',
    coords: { x: 60, y: 45 },
    category: 'Spiritual Capital',
    population: '1.2 Million',
    founded: '1200 BCE',
    language: 'Bhojpuri, Hindi',
    timeline: [
      {
        year: '1200 BCE–1000 CE',
        label: 'Ancient Spiritual Core',
        summary: 'Kashi mentioned in Rigveda as a center of learning. Buddhists, Jains, and Hindus pilgrimed here.',
        food: 'Khichdi, Thandai (almond-spice milk drink), Litti Chokha (Bihar border cuisine)',
        dress: 'Kashi Silk draping, unstitched dhotis, sandalwood paste marks',
        music: 'Classical Dhrupad style; Shehnai at temple gateways; Tansen performed here',
        life: 'Gurukul learning centers; silk weaving guilds along ghats; pilgrimage economy',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '1600–1900s',
        label: 'Mughal Banaras & Silk Golden Era',
        summary: 'Aurangzeb demolished temples but Shivaji rebuilt them. Banarasi Brocade reached its artistic peak under Mughal patronage.',
        food: 'Banarasi Paan (betel leaf) became a cultural marker; Banarasi Thandai with bhang',
        dress: 'Banarasi Brocade sarees with real gold zari became wedding essential across India',
        music: 'Ustad Bismillah Khan\'s Shehnai defined the city\'s sonic identity; Thumri Khyal style emerged',
        life: 'Silk weaver caste (Ansari community) settled along the ghats; 3-month weaving cycle per saree',
        image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '2000s–Present',
        label: 'Sacred & Digital Varanasi',
        summary: 'Ghat restoration, Smart City project, and global tourism revival. Silk weavers struggle with machine competition.',
        food: 'Baati Chokha (fusion versions); Lassi at Blue Lassi shop famous globally; UP street chaat',
        dress: 'Power loom Banarasi Sarees undercut handloom; GI tag fights for authentic weavers',
        music: 'Subah-e-Banaras dawn aarti broadcast live globally; BHU Music department archives Dhrupad',
        life: 'Ganga Aarti on Dashashwamedh Ghat draws 50,000 nightly; UNESCO intangible heritage listings',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      },
    ],
    items: [
      {
        id: 'varanasi-monument-dashashwamedh',
        name: 'Dashashwamedh Ghat — Nightly Ganga Aarti',
        category: 'monument',
        era: 'present',
        status: 'Thriving',
        description: 'The most sacred Ghat in Varanasi where 7 priests perform a spectacular synchronized fire ritual to the Ganga every evening at sunset before 50,000 spectators.',
        details: 'The Dashashwamedh Ghat (meaning "the ghat where Brahma sacrificed ten horses") is where the Ganga Aarti has been performed daily for centuries. Each evening at sunset, 7 young priests (pandits) perform an elaborate choreographed ritual using enormous oil lamps, incense sticks, flowers, and conch shells. The ceremony involves precise mudra (hand gesture) movements synchronized with Vedic chants. The smoke, lights, and the sound of thousands of devotees creates one of the most transcendent experiences in India. During Kartik Purnima festival, 1 million devotees gather on this ghat.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/1280px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg',
        tags: ['Ganga Aarti', 'Ghat', 'Fire Ritual', 'Vedic', 'Sacred'],
        yearRange: 'Ancient – Present',
        funFact: 'The Ganga Aarti at Dashashwamedh Ghat has been performed without interruption every single day for over 200 years.',
      },
      
      {
        id: 'varanasi-dress-banarasi',
        name: 'Banarasi Brocade Saree — 3 Months, One Saree',
        category: 'dress',
        era: 'changing',
        status: 'At Risk',
        description: 'The world\'s most luxurious handloom saree, woven on a wooden pit-loom over 2–3 months using real gold and silver (zari) thread — now endangered by power looms.',
        details: 'A genuine Banarasi Brocade saree takes a master weaver 15–90 days to complete on a traditional wooden pit-loom, depending on the complexity of the design. The weaver sits in a pit below floor level, operating foot pedals and hand-throw shuttles simultaneously. The distinctive feature is the "zari" work — real gold and silver metallic threads woven into floral, architectural, or geometric patterns. Famous varieties include Katan (pure silk), Shattir (mix), Organza, and Georgette. The Ansari Muslim community has exclusively practiced this craft for 600+ years. Power looms now produce identical-looking sarees in 2 hours at 1/10th the price, devastating the handloom sector. Only 25,000 handloom weavers remain (down from 100,000 in 1980).',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/%27Sari%27_from_Varanasi_%28north-central_India%29%2C_silk_and_gold-wrapped_silk_yarn_with_supplementary_weft_brocade.jpg',
        tags: ['Handloom', 'Gold Zari', 'Pit Loom', 'Ansari Community', 'At Risk'],
        materials: ['Pure Katan silk', 'Real gold/silver zari thread', 'Wooden pit-loom', 'Jacquard punch cards (for patterns)', 'Natural silk dyes'],
        artisanCount: 25000,
        funFact: 'A traditional Banarasi Brocade with real gold zari weighs 600–800 grams — the gold thread content can exceed 200 grams of pure metal.',
      },
      
      {
        id: 'varanasi-food-thandai',
        name: 'Banarasi Thandai (with Bhang)',
        category: 'food',
        era: 'present',
        status: 'Thriving',
        description: 'A chilled, frothy spiced milk drink made with almonds, rose, saffron, and cardamom — served in clay cups at festivals and famously associated with the Holi celebration.',
        details: 'Thandai ("that which cools") is made by grinding soaked almonds, watermelon seeds, rose petals, saffron, cardamom, black pepper, and cinnamon into a paste, then mixing with chilled milk and sugar. In Varanasi, the Holi version includes bhang (cannabis leaves) — a practice sanctioned in ancient Vedic texts as an offering to Lord Shiva. Famous Thandai shops include Shri Ram Bhandar (since 1934) in Godowlia. Served in traditional clay matkas or silver thali sets.',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        tags: ['Festival Drink', 'Holi', 'Almond Milk', 'Saffron', 'Lord Shiva'],
        ingredients: ['Full-fat chilled milk', 'Blanched almonds', 'Watermelon seeds', 'Rose petals (dried)', 'Saffron strands', 'Green cardamom', 'Black pepper', 'Sugar'],
        funFact: 'The bhang in Varanasi\'s Thandai is considered a sacred offering (prasad) to Lord Shiva and is legally sold at licensed government shops.',
      },
    
    ],
  },

  // ═══════════════════════════════════════════════════════
  //  KOLKATA, WEST BENGAL
  // ═══════════════════════════════════════════════════════
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    tagline: 'The Cultural Capital of India — City of Tagore, Durga Puja & Mishti',
    description: 'Kolkata — once the capital of the British Raj — is India\'s intellectual, artistic, and literary heartland. City of Rabindranath Tagore, Nobel laureates, Durga Puja festivals, Rosogolla sweets, Kantha embroidery, and the legendary Baul music of the Sufi wanderers.',
    heroImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1600&q=80',
    coords: { x: 75, y: 55 },
    category: 'Cultural Hub',
    population: '15 Million',
    founded: '1690 CE',
    language: 'Bengali, Hindi',
    timeline: [
      {
        year: '1690–1900s',
        label: 'British Raj Capital',
        summary: 'Kolkata (Calcutta) served as the capital of British India. Bengali Renaissance sparked literature, social reform, and art.',
        food: 'Rosogolla sweet invented (1868 by Nobin Chandra Das); Mishti Doi, Luchi-Kosha Mangsho',
        dress: 'Tant sarees and Muslin fabric weaving at its peak; Kantha embroidery on everyday garments',
        music: 'Rabindra Sangeet defined Bengali cultural identity; Baul minstrel music from rural Bengal',
        life: 'Colonial intellectualism; Brahmo Samaj reform movement; Tagore\'s Shantiniketan founded',
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '1947–2000s',
        label: 'Film, Art & Political Identity',
        summary: 'Satyajit Ray\'s cinema, Communist Party culture, Naxalite movement. Kolkata preserved its artistic soul amid economic decline.',
        food: 'Kathi Roll invented (1932, Nizam\'s) became global; Kosha Mangsho in Mishti Mukh restaurants',
        dress: 'Handloom Tant revival; Baluchari sarees from Bishnupur reached heritage status',
        music: 'Rabindra Sangeet at Shantiniiketan; Bauliana revival movement; Puja songs competition',
        life: 'Intellectual adda (cafe discussions); tram rides; book fair; Durga Puja as art installation',
        image: 'https://images.unsplash.com/photo-1580745294621-bb26f5c3df7d?auto=format&fit=crop&w=800&q=80',
      },
    ],
    items: [
      {
        id: 'kolkata-festival-durga-puja',
        name: 'Durga Puja — World\'s Largest Arts Festival',
        category: 'festival',
        era: 'present',
        status: 'Thriving',
        description: 'UNESCO-listed Durga Puja transforms Kolkata into the world\'s largest open-air arts exhibition — 2,500 pandals (temporary temples), each designed by leading artists.',
        details: 'Durga Puja is a 10-day festival celebrating Goddess Durga\'s victory over the demon Mahishasura. In Kolkata, it has evolved into the world\'s largest participatory art festival. Each of Kolkata\'s 2,500+ pandals (temporary elaborate structures) is designed by professional artists with themes ranging from replicas of world landmarks to conceptual art installations. The clay idols (protimaas) from the Kumartuli potters\' district are works of art in themselves. On Vijaya Dashami (the final day), the idols are immersed in the Hooghly River in a grand procession. UNESCO added it to Intangible Cultural Heritage in 2021. The festival generates ₹40,000 crore (~$5 billion) in economic activity in 10 days.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/%E0%A6%AC%E0%A6%BE%E0%A6%97%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0_%E0%A6%B8%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%9C%E0%A6%A8%E0%A7%80%E0%A6%A8_%E0%A6%A6%E0%A7%81%E0%A6%B0%E0%A7%8D%E0%A6%97%E0%A7%8B%E0%A7%8E%E0%A6%B8%E0%A6%AC_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AE.jpg/1280px-%E0%A6%AC%E0%A6%BE%E0%A6%97%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0_%E0%A6%B8%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%9C%E0%A6%A8%E0%A7%80%E0%A6%A8_%E0%A6%A6%E0%A7%81%E0%A6%B0%E0%A7%8D%E0%A6%97%E0%A7%8B%E0%A7%8E%E0%A6%B8%E0%A6%AC_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AE.jpg',
        tags: ['UNESCO', 'Clay Idols', 'Pandal', 'Kumartuli', 'Art Festival'],
        funFact: 'During Durga Puja, Kolkata installs over 40,000 km of electrical lighting — visible from satellite imagery.',
      },
      
      {
        id: 'kolkata-food-rosogolla',
        name: 'Rosogolla — The Sweet That Started a War',
        category: 'food',
        era: 'present',
        status: 'Thriving',
        description: 'The iconic spongy white cheese dumpling in sugar syrup — invented in Kolkata in 1868 and the subject of a famous legal battle between West Bengal and Odisha.',
        details: 'Rosogolla (also Rasgulla) was invented in 1868 by confectioner Nobin Chandra Das in Kolkata\'s Baguiati area. Made from chhena (fresh cottage cheese) kneaded until perfectly smooth, shaped into balls, and slow-cooked in light sugar syrup until they expand to twice their size. The ideal Rosogolla should be perfectly round, white, spongy, and absorb syrup deeply while releasing it when pressed. West Bengal and Odisha had a decade-long legal dispute over the origin — West Bengal won the GI tag in 2017. Famous shops: K.C. Das (grandsons of the inventor) and Balaram Mullick.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Rasgulla.jpg/1280px-Rasgulla.jpg',
        tags: ['Sweet', 'Chhena', 'Sugar Syrup', 'Bengali Mithai', 'GI Tagged'],
        ingredients: ['Fresh chhena (cottage cheese from buffalo milk)', 'Fine sugar', 'Water', 'Light cardamom syrup', 'Rose water (optional)'],
        funFact: 'A perfectly made Rosogolla expands to 2.5× its original size during cooking — if it doesn\'t expand, the chhena was improperly kneaded.',
      },
      
      {
        id: 'kolkata-dress-kantha',
        name: 'Kantha Embroidery — Stories Stitched in Running Thread',
        category: 'dress',
        era: 'changing',
        status: 'Declining',
        description: 'Ancient Bengali embroidery tradition using simple running stitches on layered worn-out sarees to create intricate pictorial narratives — now fading as synthetic fabrics replace cotton.',
        details: 'Kantha is one of India\'s oldest embroidery traditions, practiced by Bengali women who recycled old cotton sarees by layering 3–7 worn pieces together and stitching them with a simple running stitch (kantha stitch) using threads unraveled from the saree borders. The designs depict folk motifs: the lotus (padma), fish, birds, trees of life, and scenes from the Ramayana and Mahabharata. Originally made as quilts and baby-wrapping cloths, Kantha evolved into embroidered sarees for personal use. The Nakshi Kantha (pictorial Kantha) tells complete stories in thread. Only 8,000 Kantha practitioners remain (down from 80,000 in 1970).',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nakshi_kantha1.JPG/1280px-Nakshi_kantha1.JPG',
        tags: ['Running Stitch', 'Recycled Saree', 'Folk Narrative', 'Bengali Women', 'Declining'],
        materials: ['Layered worn cotton sarees (3–7 layers)', 'Unraveled silk thread from saree borders', 'Running needle (no hoop required)', 'Indigo and madder dyed threads'],
        artisanCount: 8000,
        funFact: 'Nakshi Kantha embroidery was found on a 600-year-old textile recovered from an archeological site in Bangladesh — proving its ancient origins.',
      },
    
    ],
  },

  // ═══════════════════════════════════════════════════════
  //  KOCHI, KERALA
  // ═══════════════════════════════════════════════════════
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    country: 'India',
    tagline: 'Queen of the Arabian Sea — Spice Trade, Kathakali & Backwater Heritage',
    description: 'Kochi (Cochin) has been a crossroads of maritime trade for 3,000 years — welcoming Arab, Chinese, Portuguese, Dutch, and British traders. Today it is Kerala\'s cultural capital, known for Kathakali dance-drama, Chinese fishing nets, spice markets, ancient synagogues, and serene backwater villages.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    coords: { x: 42, y: 88 },
    category: 'Maritime Heritage',
    population: '2.1 Million',
    founded: '1341 CE',
    language: 'Malayalam',
    timeline: [
      {
        year: '1341–1600s',
        label: 'Spice Trading Capital',
        summary: 'Natural flood of 1341 created Kochi\'s harbor. Arab, Chinese, and Portuguese traders settled, creating a multicultural trading city.',
        food: 'Malabar biryani with Arab-influenced spice blends; coconut-based fish curry; pepper trade culture',
        dress: 'Kerala mundu (white dhoti) with golden kasavu border; Christian women in Kerala blouse-style dress',
        music: 'Sopana Sangeetham (stepped temple singing); Carnatic music at Padmanabha Temple',
        life: 'Spice trade economy; Chinese fishing nets installed; Mattancherry Jewish settlement',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '1600–1900s',
        label: 'Dutch & British Colonial Period',
        summary: 'Dutch Mattancherry, British Ernakulum developed. Kathakali codified into its present form by Kerala masters.',
        food: 'Meen (fish) curry evolved into dozens of regional variations; Syrian Christian cuisine emerged',
        dress: 'Kerala Christian set-mundu (two-piece white saree); Kasavu silk weaving for temple use',
        music: 'Kathakali compositions by Kerala Kalamandalam; Onam Pookkalam (flower carpet) traditions',
        life: 'Fort Kochi as trading center; Jewish Paradesi Synagogue built; Cochin Maharaja era',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      },
    ],
    items: [
      {
        id: 'kochi-dance-kathakali',
        name: 'Kathakali — The Dance Drama of Gods',
        category: 'dance',
        era: 'present',
        status: 'Declining',
        description: 'Kerala\'s magnificent classical dance-drama where male performers wear elaborate 3-hour makeup (chutti) and 30-kg costumes to narrate epics through pure facial expression and hand gestures.',
        details: 'Kathakali ("story play") is one of the most visually spectacular art forms on earth. A full Kathakali performance requires 3–8 hours of preparation including the application of elaborate mineral-based face paint (chutti), headdresses weighing 15–30 kg, and massive multilayered costumes. The performer communicates entirely through 24 mudras (hand gestures), 9 facial expressions (navarasas), and precisely choreographed eye movements — no spoken words are used. The full syllabus of Kathakali takes 10–12 years of daily training at Kerala Kalamandalam institute. Only 300 active Kathakali performers remain; fewer than 50 can perform the full "Pacha" (heroic green) character role.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Kathakali_-Play_with_Kaurava.jpg/1280px-Kathakali_-Play_with_Kaurava.jpg',
        tags: ['Classical Dance', 'Makeup Art', 'Epic Narratives', 'Kerala', 'Mudra Gestures'],
        steps: ['3-hour mineral chutti makeup application', 'Headdress (Kireetam) attachment', 'Navarasas facial expression practice', '24 Mudra (hand gesture) vocabulary', 'Eye movement coordination (12 named patterns)', 'Full role performance (6–8 hours)'],
        artisanCount: 300,
        funFact: 'A Kathakali performer\'s eye movements are trained separately for 2–3 years before character training begins — the eyes must be independently controllable.',
      },
      
      {
        id: 'kochi-food-sadya',
        name: 'Kerala Sadya — The Feast on a Banana Leaf',
        category: 'food',
        era: 'present',
        status: 'Thriving',
        description: 'The elaborate 26-dish vegetarian feast served on a fresh banana leaf during Onam — the most culturally significant meal in Kerala, always eaten with the right hand.',
        details: 'The Kerala Sadya (meaning "feast") is a grand vegetarian meal served on a fresh banana leaf during Onam, Vishu, and marriages. A traditional Sadya consists of 26–64 dishes including rice, three types of sambar, 11 different chutneys and pickles, 5 curries, pappadams, payasam (dessert) — all served in a precise arrangement on the banana leaf. Eating protocol is strict: the pointed end of the leaf faces the left; each dish has a designated position on the leaf; and eating with the right hand only is mandatory. The dessert payasam comes in three types (Ada, Pal, Moong) served in sequence.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Sadhya_DSW.jpg/1280px-Sadhya_DSW.jpg',
        tags: ['Banana Leaf', 'Onam', '26 Dishes', 'Vegetarian', 'Kerala Feast'],
        ingredients: ['Steamed red rice', 'Sambar (3 types)', 'Avial (mixed vegetable)', 'Olan (ash gourd)', 'Thoran (vegetable stir-fry)', 'Payasam (3 types)', 'Pachadi (yogurt side)'],
        funFact: 'The banana leaf used for Sadya must always be placed with the pointed tip to the LEFT of the diner — placing it to the right signals a death ceremony meal.',
      },
    
    ],
  },
  // ═══════════════════════════════════════════════════════
  //  MUMBAI, MAHARASHTRA
  // ═══════════════════════════════════════════════════════
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    tagline: 'The City of Dreams — From Koli Fishing Villages to Art Deco & Street Culture',
    description:
      'Mumbai grew from seven indigenous Koli fishing islands into India\'s financial, cinematic, and street-food capital. Its vibrant soul lives in its historic docks, century-old Irani cafés, the spectacle of Ganesh Chaturthi, the precision of 5,000 Dabbawalas, and spirited Lavani rhythms.',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80',
    coords: { x: 28, y: 55 },
    category: 'Coastal Metropolis',
    population: '21 Million',
    founded: '1500 BCE (Koli) / 1661 CE',
    language: 'Marathi, Hindi, Gujarati, English',
    timeline: [
      {
        year: '1500 BCE–1661',
        label: 'Seven Koli Islands',
        summary: 'Seven separate marshy islands inhabited by indigenous Koli fishermen worshipping Mumbadevi.',
        food: 'Dried Bombay Duck (Bombil fry), Rice fish curry, Neera palm nectar',
        dress: 'Short cotton lungi for fishermen, Kashta (Nauvari) knee-high drape for Koli women',
        music: 'Koli folk sea songs, Tarpa reed horn melodies under coastal palms',
        life: 'Fishing, salt pans, tidal navigation, offerings at Mumbadevi and Mahalakshmi temples',
        image: 'https://images.unsplash.com/photo-1566552881560-0be86c53e56f?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '1853–1940s',
        label: 'Gateway & Industrial Era',
        summary: 'First train in Asia (1853), land reclamation joined the 7 islands, textile mills boomed, Art Deco cinema architecture.',
        food: 'Pav Bhaji invented for midnight mill workers; Irani Chai cafes opened on every corner',
        dress: 'Parsi garas, mill-worker white khadi dhotis, cotton mill sarees',
        music: 'Tamasha and Lavani theater performances, early All India Radio Bombay broadcasts',
        life: 'Cotton green boom, Hornby Vellard reclamation, Marine Drive promenade constructed',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '1970s–Present',
        label: 'Modern Cultural Powerhouse',
        summary: 'Bollywood cinematic boom, Dabbawala logistics miracle, street-food renaissance, and preservation of Koli traditions.',
        food: 'Vada Pav became city\'s signature; Coastal seafood restaurants; cutting chai culture',
        dress: 'Bollywood-influenced modern ethnic wear, designer Nauvari sarees at festivals',
        music: 'Bollywood music studios, Ganesh festival Dhol-Tasha pathaks of 100+ drummers',
        life: '24/7 bustling local trains, Marine Drive evening walks, massive Lalbaugcha Raja celebrations',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      },
    ],
    items: [
      // ── MONUMENTS ──────────────────────────────────────
      {
        id: 'mumbai-monument-gateway',
        name: 'Gateway of India',
        category: 'monument',
        era: 'past',
        status: 'Thriving',
        description: 'The monumental 26-meter basalt triumphal arch facing the Arabian Sea — built to commemorate the 1911 royal visit of King George V and Queen Mary.',
        details: 'Constructed between 1914 and 1924 using yellow basalt and reinforced concrete, the Gateway blends 16th-century Gujarati architectural motifs with Indo-Saracenic grandeur. It was also the ceremonial departure point from which the last British regiment (1st Battalion of Somerset Light Infantry) left independent India on February 28, 1948.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg',
        tags: ['Indo-Saracenic', 'Basalt Stone', 'Arabian Sea', 'British Raj', 'Colonial Landmark'],
        yearRange: '1911–1924 CE',
        funFact: 'The last British ship carrying soldiers departed through the Gateway of India in 1948, marking the symbolic end of British rule.',
      },
      {
        id: 'mumbai-monument-cst',
        name: 'Chhatrapati Shivaji Maharaj Terminus (CST)',
        category: 'monument',
        era: 'past',
        status: 'Thriving',
        description: 'A UNESCO World Heritage railway terminal exemplifying High Victorian Gothic Revival architecture combined with Indian traditional features.',
        details: 'Designed by F. W. Stevens and completed in 1888 after a 10-year construction period, CST was originally called Victoria Terminus. Its massive stone dome, pointed arches, eccentric ground plan, and stone carvings of peacocks, gargoyles, and monkeys made it an architectural masterpiece serving over 3 million commuters daily.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Chhatrapati_shivaji_terminus%2C_esterno_01.jpg/1280px-Chhatrapati_shivaji_terminus%2C_esterno_01.jpg',
        tags: ['UNESCO', 'Victorian Gothic', 'Railway Heritage', 'Historic Landmark'],
        yearRange: '1878–1888 CE',
        funFact: 'CST terminal is one of the busiest railway stations in the world, handling over 3 million passengers every single day.',
      },
      // ── FOOD ──────────────────────────────────────────
      {
        id: 'mumbai-food-vada-pav',
        name: 'Mumbai Vada Pav',
        category: 'food',
        era: 'present',
        status: 'Thriving',
        description: 'The legendary "Bombay Burger" — a spiced mashed-potato ball deep fried in chickpea batter, nestled inside a soft pav with fiery garlic-peanut chutney.',
        details: 'Invented in 1966 by Ashok Vaidya outside Dadar railway station, Vada Pav was created as an affordable, energizing grab-and-go meal for thousands of cotton mill workers. Today, Mumbai consumes over 2.5 million Vada Pavs each day. Served with fried salted green chillies and dry red garlic chutney, it is the culinary heartbeat of the city.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vada_Pav-Indian_street_food.JPG/1280px-Vada_Pav-Indian_street_food.JPG',
        tags: ['Street Food', 'Iconic', 'Spicy', 'Quick Bite', 'Mill Heritage'],
        ingredients: ['Boiled spiced potatoes', 'Chickpea batter (besan)', 'Ladi Pav (Portuguese bread)', 'Dry garlic-peanut chutney', 'Green chilli paste', 'Mustard seeds & curry leaves'],
        funFact: 'Mumbai consumes approximately 2.5 million Vada Pavs daily across 20,000+ street stalls.',
      },
      {
        id: 'mumbai-food-pav-bhaji',
        name: 'Mumbai Pav Bhaji',
        category: 'food',
        era: 'present',
        status: 'Thriving',
        description: 'A thick, spicy mash of tomatoes, potatoes, peas, and peppers cooked on an enormous flat iron tawa, served with butter-toasted pav buns and chopped onions.',
        details: 'Pav Bhaji originated in the 1860s during the American Civil War cotton boom. Bombay cotton mill workers and cotton traders stayed up till 2 AM receiving telegrams from New York. Vendors took leftover vegetables from the day, mashed them together on hot tawas with generous butter and pav bread to create a quick late-night meal. Famous spots include Sardar Pav Bhaji in Tardeo and Cannon Pav Bhaji at CST.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Bambayya_Pav_bhaji.jpg',
        tags: ['Late Night Food', 'Butter Rich', 'Tawa Cooked', 'Mill Worker Tradition'],
        ingredients: ['Tomatoes & potatoes', 'Green peas & capsicum', 'Pav bhaji masala', 'Amul butter (blocks)', 'Fresh coriander', 'Ladi pav buns'],
        funFact: 'Sardar Pav Bhaji in Tardeo is famous for using half a slab of butter per plate of Pav Bhaji.',
      },
      // ── DANCE ─────────────────────────────────────────
      {
        id: 'mumbai-dance-lavani',
        name: 'Lavani — The Rhythm of Maharashtra',
        category: 'dance',
        era: 'present',
        status: 'At Risk',
        description: 'The energetic, rhythmically complex folk dance of Maharashtra, performed to the rapid, infectious beats of the Dholki drum by women in 9-yard Nauvari sarees.',
        details: 'Originating in the 18th-century Peshwa era, Lavani served to boost troop morale during battles and later became the heart of Marathi folk theater (Tamasha). Characterized by powerful footwork, expressive facial acting (Abhinaya), and lightning spins, Lavani requires exceptional stamina and vocal accompaniment. Hereditary troupe communities are fighting to preserve its classical forms against purely commercialized Bollywood mimicry.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Lavani_1.jpg/1280px-Lavani_1.jpg',
        tags: ['Folk Dance', 'Dholki Beats', 'Nauvari Saree', 'Peshwa Heritage', 'Expressive'],
        steps: ['Ghungroo bells foot rhythm', 'Dholki tempo syncopation', 'Abhinaya facial expression', 'Fast spins (Chakkars)', 'Pallu sweep and stage walk'],
        artisanCount: 450,
        funFact: 'A traditional Lavani dancer wears heavy brass Ghungroos weighing up to 2 kg on each ankle while performing fast 180-BPM footwork.',
      },
      // ── DRESS ─────────────────────────────────────────
      {
        id: 'mumbai-dress-nauvari',
        name: 'Nauvari Saree (9-Yard Maharashtrian Drape)',
        category: 'dress',
        era: 'past',
        status: 'Declining',
        description: 'The historic nine-yard saree draped like a dhoti between the legs — famously worn by warrior queen Rani Lakshmibai for horseback riding and battles.',
        details: 'The Nauvari (literally "nine yards") or Kashta saree is unique because it allows full freedom of physical movement without compromising modesty. Historically, Maratha warrior women wore it to fight side-by-side with men. Today it is worn during weddings, Gudi Padwa, and Ganesh Chaturthi celebrations, paired with traditional Kolhapuri Saaj gold necklaces and the crescent-shaped Marathi Nath (nose pearl).',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        tags: ['9-Yard Saree', 'Maratha Heritage', 'Dhoti Drape', 'Warrior Attire', 'Paithani Silk'],
        materials: ['Pure mulberry silk with Paithani peacock border', 'Real gold zari thread', 'Matching blouse with elbow sleeves', 'Traditional pearl Nath (nose ring)'],
        funFact: 'Warrior queen Rani Lakshmibai of Jhansi fought in battle on horseback wearing a Nauvari saree.',
      },
      // ── STORIES ───────────────────────────────────────
      {
        id: 'mumbai-story-dabbawala',
        name: 'The 130-Year Dabbawala Wonder',
        category: 'story',
        era: 'present',
        status: 'Thriving',
        description: 'How 5,000 men on bicycles deliver 200,000 hot home-cooked lunchboxes across Mumbai daily with near-zero error — studied by Harvard Business School.',
        details: 'Started in 1890 during British Bombay, the Mumbai Dabbawalas (lunchbox carriers) represent an astonishing logistics feat. Relying entirely on foot, suburban local trains, and wooden bicycle carriers, they collect tiffins from homes, sort them through an alphanumeric color-coding system, and deliver them to city desks by 1:00 PM sharp. Their operational accuracy has earned them a Forbes Six-Sigma rating (1 error in 6 million deliveries) with zero software or digital devices.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Dabbawalasmumbai.jpg',
        tags: ['Logistics Legend', 'Six-Sigma', 'Harvard Case Study', 'Tiffin Culture', 'Mumbai Icons'],
        funFact: 'Prince Charles and Richard Branson personally visited Mumbai to observe the Dabbawalas in action.',
      },
      // ── FESTIVALS ─────────────────────────────────────
      {
        id: 'mumbai-festival-ganesh',
        name: 'Ganesh Chaturthi & Girgaon Chowpatty Visarjan',
        category: 'festival',
        era: 'present',
        status: 'Thriving',
        description: 'The 10-day carnival where the entire city of Mumbai welcomes Lord Ganesha with thunderous Dhol-Tasha drums, culminating in immersion into the Arabian Sea.',
        details: 'Freedom fighter Lokmanya Tilak transformed Ganesh Chaturthi from a private family ritual into a grand public festival in 1893 to unite Indians against British colonial rule. Today, over 150,000 idols are installed across Mumbai. On the final Anant Chaturdashi day, millions throng Girgaon Chowpatty and Juhu Beach to bid farewell to their beloved deity with chant "Ganpati Bappa Morya, Pudhchya Varshi Lavkar Ya" amidst saffron flags and brass cymbals.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Khairathabad_Vinayakudu_2021.jpg/1280px-Khairathabad_Vinayakudu_2021.jpg',
        tags: ['Ganesh Utsav', '10-Day Festival', 'Dhol Tasha', 'Arabian Sea Visarjan', 'Public Unity'],
        funFact: 'The Lalbaugcha Raja idol alone receives over 1.5 million devotees in a single day, with queues lasting up to 24 hours.',
      },
      // ── VANISHING ─────────────────────────────────────
      {
        id: 'mumbai-vanishing-irani-cafes',
        name: 'Historic Parsi-Irani Chai Cafés',
        category: 'vanishing',
        era: 'vanishing',
        status: 'Critical',
        description: 'The beloved corner bistros with bentwood chairs, marble-top tables, and bun maska chai — down from 350+ in the 1950s to fewer than 25 surviving today.',
        details: 'Founded by Zoroastrian Irani immigrants escaping persecution in Persia in the late 19th and early 20th centuries, Irani cafés were celebrated for their egalitarian atmosphere — welcoming people of all castes, religions, and classes. Famous for Brun Maska, Berry Pulao, Mutton Kheema, and Irani cutting chai, iconic spaces like Britannia & Co., Kayani & Co., and B. Merwan are closing down rapidly as younger generations migrate or landlords redevelop prime heritage properties.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Yazdani_Bakery_in_Fort.jpg/1280px-Yazdani_Bakery_in_Fort.jpg',
        tags: ['Irani Chai', 'Bun Maska', 'Parsi Heritage', 'Endangered Cafes', 'Old Bombay'],
        artisanCount: 22,
        funFact: 'Old Irani cafés had quirky chalked rules on the walls: "No spitting, No singing, No talking to cashier, No combing hair, No asking for change".',
      },
    ],
  },
];

// Helper: get a city by ID
export const getCityById = (id: string): CityData | undefined => {
  return CITY_DATA.find((c) => c.id === id);
};

// Helper: get items by category within a city
export const getCityItemsByCategory = (cityId: string, category: CityCategory): CityItem[] => {
  const city = getCityById(cityId);
  if (!city) return [];
  return city.items.filter((item) => item.category === category);
};

// Helper: get vanishing items across all cities
export const getAllVanishingItems = () => {
  return CITY_DATA.flatMap((city) =>
    city.items
      .filter((item) => item.status === 'Critical' || item.status === 'At Risk' || item.status === 'Declining')
      .map((item) => ({ ...item, cityName: city.name, stateName: city.state }))
  );
};
