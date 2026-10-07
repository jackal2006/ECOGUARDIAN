import { PollutionReport, WasteCategory, WasteItem, EcoChallenge, Article, CommunityEvent, Badge } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'eco-beginner',
    name: 'Eco Beginner',
    description: 'Began your environmental action journey with 25+ points.',
    pointsRequired: 25,
    icon: 'Seedling',
    color: 'emerald',
  },
  {
    id: 'green-explorer',
    name: 'Green Explorer',
    description: 'Active explorer reporting issues and tackling challenges (100+ pts).',
    pointsRequired: 100,
    icon: 'Compass',
    color: 'teal',
  },
  {
    id: 'planet-protector',
    name: 'Planet Protector',
    description: 'Dedicated defender of local ecosystems and waterways (300+ pts).',
    pointsRequired: 300,
    icon: 'ShieldCheck',
    color: 'green',
  },
  {
    id: 'eco-champion',
    name: 'Eco Champion',
    description: 'Community environmental leader creating tangible impact (600+ pts).',
    pointsRequired: 600,
    icon: 'Award',
    color: 'cyan',
  },
  {
    id: 'guardian-of-earth',
    name: 'Guardian of Earth',
    description: 'Master eco warrior inspiring sustainable living everywhere (1000+ pts).',
    pointsRequired: 1000,
    icon: 'Crown',
    color: 'amber',
  },
];

export const DEMO_POLLUTION_REPORTS: PollutionReport[] = [
  {
    id: 'rep-101',
    reportId: 'EG-2026-081',
    userId: 'demo-user-1',
    userName: 'GreenObserver_9',
    userEmail: 'community.action@ecoguardian.org',
    pollutionType: 'Water',
    location: 'North Harbor Wetlands & Drainage Canal',
    description: 'Chemical sheen and untreated industrial effluent draining directly into the tidal canal near sector 4. Foul odor detected and visible distress to local waterfowl.',
    date: '2026-10-04',
    severity: 'Critical',
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    status: 'Under Review',
    adminNotes: 'Notified municipal environmental protection agency. Water samples scheduled.',
    createdAt: '2026-10-04T11:20:00Z',
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: 'rep-102',
    reportId: 'EG-2026-074',
    userId: 'demo-user-2',
    userName: 'RiverCaretaker',
    userEmail: 'cleanriver@ecoguardian.org',
    pollutionType: 'Plastic/Waste',
    location: 'Pine Crest Trailhead & Creek Bank',
    description: 'Illegal dumping site discovered with roughly 40 bags of municipal plastics, styrofoam containers, and discarded household items along the creek slope.',
    date: '2026-10-02',
    severity: 'High',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    status: 'Pending',
    createdAt: '2026-10-02T15:45:00Z',
    coordinates: { lat: 37.7833, lng: -122.4167 }
  },
  {
    id: 'rep-103',
    reportId: 'EG-2026-068',
    userId: 'demo-user-3',
    userName: 'UrbanCyclist',
    userEmail: 'cycling.eco@ecoguardian.org',
    pollutionType: 'Air',
    location: 'East Industrial Junction / Highway Overpass',
    description: 'Dense black particulate exhaust billowing from an uncertified generator compound during peak commute hours, creating zero-visibility smog.',
    date: '2026-09-28',
    severity: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    adminNotes: 'Inspection conducted. The facility was cited and retrofitted with electrostatic scrubbers.',
    createdAt: '2026-09-28T08:15:00Z'
  },
  {
    id: 'rep-104',
    reportId: 'EG-2026-059',
    userId: 'demo-user-4',
    userName: 'ForestEcho',
    userEmail: 'biodiversity@ecoguardian.org',
    pollutionType: 'Deforestation',
    location: 'Greenwood Ridge Buffer Zone',
    description: 'Unauthorized clear-cutting of century-old native pine and oak trees on protected slope land without permits.',
    date: '2026-09-25',
    severity: 'Critical',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    adminNotes: 'Restraining order issued. Reforestation plan filed with local forestry wardens.',
    createdAt: '2026-09-25T14:30:00Z'
  },
  {
    id: 'rep-105',
    reportId: 'EG-2026-042',
    userId: 'demo-user-5',
    userName: 'CivicWatch',
    userEmail: 'civic@ecoguardian.org',
    pollutionType: 'Noise',
    location: 'Residential Park Boundary (Maplewood)',
    description: 'Unattenuated commercial refrigeration compressors exceeding 85dB continuously throughout nighttime hours, disturbing resident nesting birds.',
    date: '2026-09-20',
    severity: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    status: 'Under Review',
    createdAt: '2026-09-20T22:10:00Z'
  }
];

export const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: 'plastic',
    name: 'Plastic',
    color: 'blue-600',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'Package',
    exampleItems: ['Beverage bottles (PET)', 'Milk jugs (HDPE)', 'Food containers', 'Bottle caps', 'Shampoo bottles'],
    disposalMethod: 'Yellow or Blue Dry Recycling Bin',
    recyclingInfo: 'Look for SPI codes #1 (PET) and #2 (HDPE) which are 100% recyclable. Soft flexible films (#4 LDPE) must go to special store return points.',
    environmentalImpact: 'Can take 450+ years to degrade. Breaks down into dangerous microplastics that bioaccumulate in marine life and human drinking water.',
    dos: [
      'Empty and thoroughly rinse all food residue',
      'Flatten bottles to maximize truck cargo efficiency',
      'Keep screw caps attached to PET bottles',
      'Check local numeric resin code guidelines'
    ],
    donts: [
      'Do not recycle plastic bags in standard curbside bins',
      'Do not recycle black takeout containers in automated sorting systems',
      'Do not include plastic straws or cutlery',
      'Avoid dirty unwashed plastic peanut butter jars'
    ],
    binColor: 'Blue / Yellow'
  },
  {
    id: 'paper',
    name: 'Paper & Cardboard',
    color: 'amber-700',
    bgColor: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: 'FileText',
    exampleItems: ['Cardboard delivery boxes', 'Newspapers & flyers', 'Office paper', 'Clean cereal boxes', 'Magazines'],
    disposalMethod: 'Blue Paper Recycling Bin',
    recyclingInfo: 'Cardboard fibers can be recycled 5-7 times into new packaging materials before becoming too short.',
    environmentalImpact: 'Recycling 1 ton of paper saves 17 trees, 7,000 gallons of water, and 4,000 kWh of electricity.',
    dos: [
      'Flatten all cardboard boxes completely',
      'Remove broad plastic tape and packing inserts',
      'Keep paper completely dry in collection bins',
      'Recycle standard office staples without worries'
    ],
    donts: [
      'Do not recycle greasy pizza box bottoms (compost them instead)',
      'Never recycle thermal glossy receipt slips (BPA coated)',
      'Avoid wax-coated coffee cups with plastic linings',
      'Do not recycle soiled paper napkins or tissue papers'
    ],
    binColor: 'Blue'
  },
  {
    id: 'glass',
    name: 'Glass',
    color: 'teal-600',
    bgColor: 'bg-teal-50 text-teal-800 border-teal-200',
    icon: 'Wine',
    exampleItems: ['Glass soda/beer bottles', 'Jam & pickle jars', 'Condiment bottles', 'Cosmetic glass jars'],
    disposalMethod: 'Green or Designated Glass Recycling Bin',
    recyclingInfo: 'Glass is 100% and infinitely recyclable with zero loss in purity or structural quality.',
    environmentalImpact: 'Recycled cullet melts at lower furnace temperatures, saving 30% of energy and mitigating quarrying impact.',
    dos: [
      'Rinse jars clean with cold water',
      'Separate metal lids for separate metal recycling stream',
      'Sort by clear, brown, and green glass when required locally',
      'Wrap broken bottle shards safely before binning'
    ],
    donts: [
      'Do not mix heat-resistant Pyrex, cookware, or oven glass',
      'Do not place window panes or car windshields in curbside glass',
      'Do not mix ceramic mugs, crystal, or mirrors',
      'Never throw lightbulbs into standard glass bins'
    ],
    binColor: 'Green'
  },
  {
    id: 'metal',
    name: 'Metal & Cans',
    color: 'slate-600',
    bgColor: 'bg-slate-100 text-slate-800 border-slate-300',
    icon: 'Disc',
    exampleItems: ['Aluminum beverage cans', 'Steel/tin soup cans', 'Clean aluminum foil', 'Metal bottle crowns', 'Aerosol cans (empty)'],
    disposalMethod: 'Dry Metal Recycling Bin',
    recyclingInfo: 'Recycling aluminum consumes 95% less energy than extracting virgin bauxite ore.',
    environmentalImpact: 'Infinite lifecycle. One recycled aluminum can saves enough energy to power a television for three hours.',
    dos: [
      'Rinse out food residue from soup and bean cans',
      'Ball clean aluminum foil into grapefruit-sized spheres',
      'Ensure spray aerosol cans are completely discharged',
      'Place loose metal lids inside tin cans'
    ],
    donts: [
      'Do not throw paint cans with wet paint residue into recyclables',
      'Do not include scrap construction rebar or motor vehicle parts',
      'Never put propane tanks or gas cylinders into municipal bins',
      'Do not recycle dirty foil with baked-on food crust'
    ],
    binColor: 'Grey / Silver'
  },
  {
    id: 'organic',
    name: 'Organic & Food Waste',
    color: 'emerald-600',
    bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: 'Apple',
    exampleItems: ['Fruit & vegetable peels', 'Coffee grounds & paper filters', 'Eggshells', 'Yard trimmings & dry leaves', 'Leftover plate scraps'],
    disposalMethod: 'Brown / Green Compost Bin or Home Tumbler',
    recyclingInfo: 'Transforms within 8-12 weeks through aerobic decomposition into nutrient-dense humus soil amendment.',
    environmentalImpact: 'Landfilled food waste produces methane, a greenhouse gas 28x more potent than carbon dioxide.',
    dos: [
      'Layer carbon-rich brown leaves with nitrogen-rich green scraps',
      'Chop bulky watermelon rinds for faster microbial breakdown',
      'Use certified compostable bags (EN 13432 standard)',
      'Keep aerated to prevent anaerobic odors'
    ],
    donts: [
      'Never add plastic stickers from fruit peels',
      'Avoid large quantities of animal oils or meats in home bins',
      'Do not add cat or dog feces to vegetable garden compost',
      'Avoid diseased garden plants or invasive weeds'
    ],
    binColor: 'Brown / Green'
  },
  {
    id: 'e-waste',
    name: 'E-Waste',
    color: 'purple-600',
    bgColor: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: 'Cpu',
    exampleItems: ['Old smartphones & tablets', 'Laptops & computer cables', 'Lithium batteries', 'Broken appliances', 'Printers & cartridges'],
    disposalMethod: 'Certified E-Waste Drop-off Center / Retail Take-back',
    recyclingInfo: 'Contains precious rare earth metals (gold, palladium, copper, lithium) extracted via specialized smelting.',
    environmentalImpact: 'Toxic heavy metals (lead, cadmium, mercury) leach into groundwater tables if dumped in open landfills.',
    dos: [
      'Perform factory reset & wipe all personal flash data',
      'Tape battery contact terminals with non-conductive electrical tape',
      'Utilize manufacturer take-back (Apple, Best Buy, etc.)',
      'Donate working devices to low-income student educational charities'
    ],
    donts: [
      'NEVER toss lithium-ion batteries into household bins (fire risk!)',
      'Do not crack open sealed CRT screens or monitor tubes',
      'Avoid burning plastic-sheathed electronics cables',
      'Do not disassemble high-voltage power bricks without training'
    ],
    binColor: 'Red / Electronic Drop Box'
  },
  {
    id: 'hazardous',
    name: 'Hazardous Waste',
    color: 'rose-600',
    bgColor: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: 'AlertTriangle',
    exampleItems: ['Household paints & thinners', 'Pesticides & garden herbicides', 'Fluorescent CFL bulbs (mercury)', 'Motor oil & car fluids', 'Strong bleach & chemicals'],
    disposalMethod: 'Municipal Hazardous Material Facility (HHW)',
    recyclingInfo: 'Requires specialized thermal neutralisation, chemical precipitation, or secure high-temperature hazardous incineration.',
    environmentalImpact: 'A single quart of motor oil can contaminate 250,000 gallons of natural freshwater reservoir.',
    dos: [
      'Keep chemicals in their original labeled safety containers',
      'Store in upright, leak-proof secondary containment during transport',
      'Check municipal periodic toxic collection roundups',
      'Use eco-friendly non-toxic biodegradable cleaning substitutes'
    ],
    donts: [
      'NEVER pour down sinks, storm drains, or toilets',
      'Never mix disparate chemical agents (generates lethal chlorine gas)',
      'Do not dump motor oil onto grass or gravel driveways',
      'Do not burn chemical containers in open fires'
    ],
    binColor: 'Hazardous Red / Depot'
  }
];

export const COMMON_WASTE_SEARCH_ITEMS: WasteItem[] = [
  {
    id: 'item-1',
    name: 'Plastic Water Bottle (PET)',
    category: 'Plastic',
    disposalMethod: 'Curbside Plastic Recycling Bin (#1 PET)',
    environmentalImpact: 'Takes 450 years to decompose in nature; easily melted into recycled polyester fleece.',
    tips: 'Rinse with clean water, crush flat to conserve space, and leave cap screwed tight.',
    alternative: 'Stainless steel insulated refillable bottle (saves 167 bottles/year).'
  },
  {
    id: 'item-2',
    name: 'Banana Peel / Fruit Core',
    category: 'Organic',
    disposalMethod: 'Organic Food Waste / Home Composter',
    environmentalImpact: 'Releases anaerobic methane if landfilled; creates high-nitrogen compost if properly handled.',
    tips: 'Chop in pieces for rapid composting within 3-4 weeks.',
    alternative: 'Zero waste cooking (use banana peels for plant fertilizer tea or compost).'
  },
  {
    id: 'item-3',
    name: 'Cardboard Delivery Shipping Box',
    category: 'Paper',
    disposalMethod: 'Paper & Cardboard Recycling',
    environmentalImpact: 'Saves 24 trees per ton recycled.',
    tips: 'Remove thick clear packing tape and slice folds completely flat.',
    alternative: 'Reuse boxes for moving, storage, or plant sheet-mulching in gardens.'
  },
  {
    id: 'item-4',
    name: 'AA / AAA Alkaline Battery',
    category: 'E-Waste',
    disposalMethod: 'Battery Drop-off Bin at Hardware / Grocery Retailer',
    environmentalImpact: 'Contains zinc and manganese; prevents heavy metal contamination.',
    tips: 'Tape the positive and negative ends with clear tape to prevent short circuits during storage.',
    alternative: 'Rechargeable NiMH USB batteries (can be recharged 1000+ times).'
  },
  {
    id: 'item-5',
    name: 'Greasy Takeout Pizza Box',
    category: 'Organic / Compost',
    disposalMethod: 'Organic Food Waste or Green Yard Waste (Compost)',
    environmentalImpact: 'Oil grease contaminates paper recycling slurries causing whole batches to spoil.',
    tips: 'Tear off the clean top cardboard lid for paper recycling; compost the greasy bottom slice.',
    alternative: 'Dine-in or choose local pizzerias using unbleached compostable paper liners.'
  },
  {
    id: 'item-6',
    name: 'Aluminum Soda Can',
    category: 'Metal',
    disposalMethod: 'Metal / Mixed Dry Recycling',
    environmentalImpact: 'Can be re-melted and back on store shelves as a new can in just 60 days.',
    tips: 'Rinse quickly, no need to crush completely if automated deposit machines require shape scanning.',
    alternative: 'Drink tap water with infused fresh lemon or home soda maker.'
  },
  {
    id: 'item-7',
    name: 'Glass Jam Jar',
    category: 'Glass',
    disposalMethod: 'Glass Recycling Bin (or rinse and reuse)',
    environmentalImpact: '100% infinitely recyclable without degrading in quality.',
    tips: 'Rinse out sticky preserves, take off the metal lid and recycle both.',
    alternative: 'Fantastic for bulk pantry spice storage or homemade vinaigrette shakers.'
  },
  {
    id: 'item-8',
    name: 'Styrofoam Takeout Box / Polystyrene',
    category: 'Plastic',
    disposalMethod: 'General Trash (Landfill) or Specialized EPS Depot',
    environmentalImpact: 'Never biodegrades; crumbles into micro-beads ingested by marine creatures.',
    tips: 'Standard curbside blue bins do NOT accept EPS foam. Look for rare specialized foam drop-offs.',
    alternative: 'Bring your own stainless steel or glass tiffin to takeout restaurants.'
  },
  {
    id: 'item-9',
    name: 'Smartphone with Swollen or Old Battery',
    category: 'E-Waste',
    disposalMethod: 'Certified E-Waste Recycling Depot / Tech Retailer',
    environmentalImpact: 'Contains cobalt, gold, neodymium, and silver; hazardous fire risk if punctured.',
    tips: 'Do not throw in trash; store in cool metal tin until safely delivered to tech collection.',
    alternative: 'Repair screen or battery, or trade-in for credit.'
  },
  {
    id: 'item-10',
    name: 'Coffee Grounds',
    category: 'Organic',
    disposalMethod: 'Compost Bin or Garden Soil',
    environmentalImpact: 'Rich in nitrogen and potassium; natural slug and pest deterrent.',
    tips: 'Work directly into garden bed soil around acid-loving plants like roses and blueberries.',
    alternative: 'Use French press or reusable metal mesh cone filters to avoid disposable paper.'
  }
];

export const DEFAULT_CHALLENGES: EcoChallenge[] = [
  {
    id: 'chal-1',
    title: 'Plastic-Free 7 Days',
    description: 'Refuse all single-use plastic bags, disposable cutlery, and takeaway cups for a full week.',
    duration: '7 Days',
    difficulty: 'Medium',
    points: 75,
    category: 'Waste Reduction',
    active: true,
    impactMetric: '~14 single-use plastic items avoided'
  },
  {
    id: 'chal-2',
    title: 'Plant a Native Sapling or Tree',
    description: 'Plant a climate-resilient native tree or pollinator-friendly perennial in your garden or community park.',
    duration: '1 Day',
    difficulty: 'Medium',
    points: 100,
    category: 'Biodiversity',
    active: true,
    impactMetric: 'Absorbs up to 22kg of CO2 per year at maturity'
  },
  {
    id: 'chal-3',
    title: 'Public Transit & Pedal Commuter',
    description: 'Leave the personal gasoline vehicle parked and use trains, electric buses, or bicycles for all trips this week.',
    duration: '5 Days',
    difficulty: 'Medium',
    points: 80,
    category: 'Carbon Footprint',
    active: true,
    impactMetric: 'Reduces ~32kg of greenhouse gas emissions'
  },
  {
    id: 'chal-4',
    title: 'Reusable Water Hero',
    description: 'Carry your insulated refillable bottle and reusable coffee tumbler whenever leaving your house.',
    duration: '14 Days',
    difficulty: 'Easy',
    points: 50,
    category: 'Waste Reduction',
    active: true,
    impactMetric: 'Saves 28 PET plastic bottles'
  },
  {
    id: 'chal-5',
    title: 'Phantom Energy Vampire Hunt',
    description: 'Audit your home: unplug idle chargers, turn off standby appliances, and switch to LED bulbs.',
    duration: '1 Day',
    difficulty: 'Easy',
    points: 40,
    category: 'Energy Conservation',
    active: true,
    impactMetric: 'Cuts home electricity waste by up to 10%'
  },
  {
    id: 'chal-6',
    title: 'Neighborhood Litter Sweep',
    description: 'Spend 45 minutes safely gathering litter, plastic bottles, and cans from your local street or park trail.',
    duration: '1 Day',
    difficulty: 'Medium',
    points: 90,
    category: 'Community Action',
    active: true,
    impactMetric: 'Removes ~5kg of toxic urban litter'
  },
  {
    id: 'chal-7',
    title: 'Home Kitchen Composting Starter',
    description: 'Start separating all vegetable scraps, fruit peelings, and coffee grounds into a kitchen compost bin.',
    duration: '10 Days',
    difficulty: 'Hard',
    points: 120,
    category: 'Circular Economy',
    active: true,
    impactMetric: 'Diverts 8kg of organic waste from landfills'
  },
  {
    id: 'chal-8',
    title: 'Meatless Green Week',
    description: 'Enjoy delicious vegetarian, legume, and plant-powered meals for one full week to lower your food water footprint.',
    duration: '7 Days',
    difficulty: 'Medium',
    points: 70,
    category: 'Sustainable Living',
    active: true,
    impactMetric: 'Saves ~9,000 liters of virtual water'
  }
];

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'The Hidden Toll of Microplastics in Freshwater Ecosystems',
    description: 'How microscopic polymers disrupt aquatic food webs and the innovative filter technologies fighting back.',
    content: `Microplastics—synthetic polymer particles smaller than 5 millimeters—have permeated the planet's most pristine freshwater basins. Originating from synthetic textile abrasion during home laundering, tire tread erosion, and broken down industrial packaging, these particles do not disappear. Instead, they act as hydrophobic magnets for persistent organic pollutants such as polychlorinated biphenyls (PCBs) and heavy metals.

Aquatic organisms, from benthic invertebrates to apex river trout, mistake these fragments for zooplankton. Once ingested, the jagged particles cause gastrointestinal obstruction, pseudo-satiety, and cellular inflammation. Beyond the ecological crisis, studies indicate microplastics have entered the human food web through municipal tap supplies and marine protein.

What Communities Can Do:
1. Retrofit washing machines with 100-micron microfiber mesh catchers.
2. Demand city-scale storm drain filtration catch-basins to halt road runoff before it reaches river mouths.
3. Transition aggressively from single-use synthetic commodities to biodegradable cellulosic alternatives.`,
    category: 'Plastic Pollution',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    author: 'Dr. Elena Vance, Limnology Lab',
    createdAt: '2026-10-01'
  },
  {
    id: 'art-2',
    title: 'Urban Heat Islands: Why Tree Canopies Are Vital Infrastructure',
    description: 'Exploring the science of microclimates and how urban afforestation reduces energy costs and saves lives.',
    content: `Metropolitan concrete and dark asphalt absorb and re-radiate solar thermal energy, causing urban neighborhoods to register ambient temperatures up to 7°C higher than surrounding rural woodlands. This phenomenon, known as the Urban Heat Island (UHI) effect, dramatically spikes summer cooling demands, triggers peak-load power blackouts, and severely elevates respiratory distress among vulnerable elderly and pediatric populations.

Strategic urban forestry represents nature's highest-efficiency air conditioning system. Through evapotranspiration—where trees draw moisture from deep groundwater and evaporate water vapor through leaves—a single mature deciduous tree can produce the cooling effect of 10 room-sized air conditioners running 20 hours daily.

Community Action Steps:
1. Advocate for high-albedo cool roofs and permeable reflective pavements in municipal zoning codes.
2. Protect established mature street trees during sidewalk resurfacing.
3. Convert neglected median strips and asphalt parking corners into native micro-forests utilizing the Miyawaki afforestation method.`,
    category: 'Climate Change',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    author: 'Marcus Thorne, Urban Ecologist',
    createdAt: '2026-09-26'
  },
  {
    id: 'art-3',
    title: 'The Circular Economy: Moving Beyond the "Take-Make-Waste" Paradigm',
    description: 'Rethinking product lifecycles, regenerative manufacturing, and zero-waste household design.',
    content: `For over a century, global production has adhered to a linear extractive model: raw materials are mined, transformed into single-lifecycle items, and buried in landfills or incinerated. This paradigm strains planetary resource boundaries and drives accelerating carbon emissions.

The circular economy decouples economic prosperity from finite resource consumption. Built upon three core tenets—eliminating waste by design, circulating products at their highest utility, and regenerating natural biosphere systems—circularity reimagines waste as a valuable feedstock.

Modern circular principles for households:
- Right to Repair: Prioritizing electronics and modular appliances with open documentation and swappable parts.
- Product-as-a-Service: Renting heavy tools, formal wear, or recreational equipment instead of individual ownership.
- Closed-Loop Composting: Converting every food scrap into soil biology that feeds the next harvest.`,
    category: 'Waste Management',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    author: 'Aria Chen, Sustainability Architect',
    createdAt: '2026-09-18'
  },
  {
    id: 'art-4',
    title: 'Clean Water Stewardship: Guarding Community Aquifers',
    description: 'Everyday chemicals in your household drainage and how to safeguard local watershed hydrology.',
    content: `Freshwater makes up less than 1% of all water on Earth, yet groundwater aquifers supplying over 2 billion people face unprecedented contamination from pesticide percolation, pharmaceuticals, and synthetic detergents.

When toxic household cleaners, paints, or automotive solvents are poured down sanitary sinks or storm gutters, municipal sewage treatment plants lack the specialized bio-filtration mechanisms to fully neutralize them. They inevitably discharge into regional wetlands and aquifers.

Essential Watershed Safeguards:
- Switch to plant-based non-toxic surfactants (vinegar, baking soda, castile soap).
- Never flush expired medicines; bring them to pharmaceutical return lockboxes.
- Install bioswales and rain gardens to naturally filter storm runoff before it drains into local waterways.`,
    category: 'Water Conservation',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    author: 'David O\'Connor, Hydrologist',
    createdAt: '2026-09-12'
  }
];

export const DEFAULT_COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'Emerald Valley Riverfront Cleanup Drive',
    location: 'Emerald Valley Park & North Canal Trailhead',
    date: 'Saturday, Oct 17, 2026',
    time: '09:00 AM - 12:30 PM',
    description: 'Join fellow Eco Guardians to clear plastic debris, packaging, and non-biodegradable waste from the riverbanks before monsoon rains. Protective gloves, eco bags, and refreshments provided.',
    category: 'Cleanup Drive',
    participantsCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'evt-2',
    title: '1,000 Native Saplings Community Plantation',
    location: 'Greenwood Ridge Community Reserve',
    date: 'Sunday, Oct 25, 2026',
    time: '08:30 AM - 01:00 PM',
    description: 'A city-wide tree plantation campaign restoring local oak, maple, and flowering dogwood varieties to rejuvenate local biodiversity and curb urban heat.',
    category: 'Tree Plantation',
    participantsCount: 78,
    imageUrl: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'evt-3',
    title: 'Household E-Waste & Battery Safe Collection Drive',
    location: 'Civic Center West Plaza',
    date: 'Saturday, Nov 07, 2026',
    time: '10:00 AM - 04:00 PM',
    description: 'Bring broken electronics, old cellphones, laptops, and hazardous batteries for certified zero-landfill disassembly and precious metal recovery.',
    category: 'E-Waste Drive',
    participantsCount: 31,
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'evt-4',
    title: 'Zero-Waste Living & Home Composting Workshop',
    location: 'Central Library Community Greenroom',
    date: 'Wednesday, Nov 18, 2026',
    time: '06:00 PM - 07:30 PM',
    description: 'Practical live demonstration on odorless balcony composting, Bokashi fermentation, and DIY natural cleaning solutions.',
    category: 'Workshop',
    participantsCount: 26,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
  }
];
