export interface MediaItem {
  url: string
  alt: string
  caption: string
  width?: number
  height?: number
}

export interface KeyFactItem {
  term: string
  value: string
  href?: string
}

export interface ScopeItem {
  title: string
  description: string
}

export interface ProcessStepItem {
  title: string
  description: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ServiceRecord {
  slug: string
  parentSlug?: string
  title: string
  shortTitle: string
  group: 'Roads and earthworks' | 'Buildings and interiors' | 'Planning and delivery'
  _status: 'published' | 'draft'
  primaryKeyword: string
  formType: 'project' | 'consultation'
  ctaLabel: string
  metaTitle: string
  metaDescription: string
  heroHeadline: string
  heroLead: string
  heroImage: MediaItem
  summary: string
  keyFacts: KeyFactItem[]
  intro: string[]
  scope: ScopeItem[]
  process: ProcessStepItem[]
  faqs: FaqItem[]
  formHeading: string
  formIntro: string
  equipmentSlugs?: string[]
  registeredProfessionalName?: string
  boraqsOrEbkRegNumber?: string
}

export interface ProjectRecord {
  slug: string
  title: string
  location: {
    town: string
    county: string
  }
  clientType: 'Commercial & Hospitality' | 'Hospitality' | 'Hospitality & Residential' | 'Civil & Roads'
  status: 'Completed' | 'In progress'
  year: string
  role: string
  deliveringCompany: string
  verificationEvidenceNote: string
  serviceSlugs: string[]
  equipmentSlugs: string[]
  featured: boolean
  _status: 'published' | 'draft'
  metaTitle: string
  metaDescription: string
  heroImage: MediaItem
  keyFigures: { value: string; label: string }[]
  brief: string
  work: string
  result: string
  gallery: MediaItem[]
}

export interface EquipmentCategoryRecord {
  slug: string
  name: string
  singular: string
  plural: string
  article: 'a' | 'an'
  primaryKeyword: string
  metaTitle: string
  metaDescription: string
  heroHeadline: string
  heroLead: string
  heroImage: MediaItem
  summary: string
  intro: string[]
  uses: ScopeItem[]
  faqs: FaqItem[]
}

export interface MachineRecord {
  slug: string
  name: string
  categorySlug: string
  make: string
  model: string
  year?: string
  capacity: string
  operatingWeight?: string
  attachmentSize?: string
  enginePower?: string
  availability: 'available' | 'on_hire'
  featured: boolean
  _status: 'published' | 'draft'
  heroImage: MediaItem
  gallery: MediaItem[]
  uses: ScopeItem[]
  hireTerms: {
    operator: string
    fuel: string
    transport: string
    minimumHire: string
    serviceArea: string
  }
}

export interface TeamRecord {
  slug: string
  name: string
  role: string
  summary: string
  portrait: MediaItem
  phone?: string
  email: string
  linkedinUrl?: string
  bio: string[]
  experience: {
    period: string
    role: string
    organisation: string
    location: string
    summary: string
  }[]
  areasOfWork: KeyFactItem[]
}

export interface CredentialRecord {
  id: string
  name: string
  issuer: string
  number: string
  category: string
  validUntil: string
  certificateFileUrl?: string
  holderSlug?: string
  order: number
  _status: 'published' | 'draft'
}

export interface TestimonialRecord {
  id: string
  person: string
  title: string
  organisation: string
  projectSlug?: string
  serviceSlugs: string[]
  isPublicOfficial: boolean
  date: string
  permissionFileUrl?: string
  quote: string
  _status: 'published' | 'draft'
}

export interface LocationRecord {
  slug: string
  town: string
  county: string
  _status: 'published' | 'draft'
  primaryKeyword: string
  metaTitle: string
  metaDescription: string
  heroHeadline: string
  heroLead: string
  heroImage: MediaItem
  address: string
  directionsUrl: string
  mapEmbedUrl?: string
  phone: string
  email: string
  hours?: string
  intro: string[]
  faqs: FaqItem[]
}

export interface PostCategoryRecord {
  slug: string
  name: string
}

export interface PostRecord {
  slug: string
  title: string
  categorySlug: string
  relatedServiceSlug: string
  excerpt: string
  publishedAt: string
  readingTimeMinutes: number
  authorSlug: string
  coverImage: MediaItem
  sections: { heading: string; paragraphs: string[] }[]
  _status: 'published' | 'draft'
}

export interface LegalPageRecord {
  slug: 'privacy' | 'cookies'
  title: string
  lastUpdated: string
  metaTitle: string
  metaDescription: string
  sections: {
    heading: string
    paragraphs: string[]
    bullets?: string[]
    table?: {
      headers: string[]
      rows: string[][]
    }
  }[]
}

export const siteSettingsSeed = {
  company: {
    legalName: 'Shena Works Limited',
    tradingName: 'Shena Works',
    tagline: 'Roads & Building Construction Contractors',
    motto: 'Connecting communities. Building the future.',
    regNumber: null as string | null,
    incorporationDate: null as string | null,
    kraPin: null as string | null,
    directors: null as string | null,
  },
  contact: {
    phoneE164: '+254718971896',
    phoneDisplay: '+254 718 971 896',
    whatsappNumber: '254718971896',
    email: 'shenaworksltd@gmail.com',
    officeHours: 'Monday – Friday 8:00 am – 5:00 pm, Saturday 8:00 am – 1:00 pm',
    responseTimeStatement: null as string | null,
    enquiryRecipients: ['shenaworksltd@gmail.com'],
  },
  social: {
    linkedinUrl: null as string | null,
    facebookUrl: null as string | null,
  },
  files: {
    companyProfile: null as { url: string; sizeMb: string } | null,
  },
  ctaImage: {
    url: '/media/cta-site.jpg',
    alt: 'Shena Works road grading crew and motor grader on site in Meru County',
    caption: 'Road formation grading and drainage works in Meru County.',
  },
  proofItems: [
    {
      value: 'NCA',
      label: 'Roads & building works registration',
      verified: false,
    },
    {
      value: '2024',
      label: 'Year incorporated in Kenya',
      verified: false,
    },
    {
      value: '5',
      label: 'Verified projects completed',
      verified: false,
    },
    {
      value: 'Meru & Nairobi',
      label: 'Operating bases across Kenya',
      verified: false,
    },
  ],
}

export const homePageSeed = {
  heroOverline: 'Roads and building contractors · Meru and Nairobi',
  heroHeadline: 'Roads, earthworks and buildings, built with our own machines',
  heroLead:
    'We grade, drain and pave roads, and we build homes, lounges and commercial premises across Meru, Nairobi and the rest of Kenya, from site clearing to handover.',
  heroImage: {
    url: '/media/hero-roads.jpg',
    alt: 'Shena Works motor grader and vibratory roller preparing a murram road in Meru County',
    caption: 'Grading and compacting an access road in Meru County',
  },
  whyShena: {
    overline: 'Why Shena Works',
    heading: 'We own the plant and we run the site',
    image: {
      url: '/media/why-crew.jpg',
      alt: 'Shena Works site team and excavator during earthworks and drainage construction',
      caption: 'On-site supervision and earthmoving plant operation in Meru County.',
    },
    points: [
      {
        number: '01',
        title: 'Our own machines',
        description:
          'Our excavators, graders and rollers are on your job when the programme says, not when a hire yard can spare them.',
        verified: true,
      },
      {
        number: '02',
        title: 'Roads and buildings, one contractor',
        description:
          'Earthworks, drainage, paving and the building itself are planned and supervised by one team.',
        verified: true,
      },
      {
        number: '03',
        title: 'Led from the site',
        description:
          'Our managing director has supervised county road works and inspected urban roads, and still visits every site.',
        verified: true,
      },
    ],
  },
}

export const servicesSeed: ServiceRecord[] = [
  {
    slug: 'road-construction-and-earthworks',
    title: 'Road construction and earthworks',
    shortTitle: 'Road construction',
    group: 'Roads and earthworks',
    _status: 'published',
    primaryKeyword: 'road construction Meru',
    formType: 'project',
    ctaLabel: 'Request a road quote',
    metaTitle: 'Road Construction & Earthworks in Meru & Kenya | Shena Works',
    metaDescription:
      'Access roads, grading, murram gravelling, cabro paving, culverts, storm drains and tarmac works in Meru and across Kenya, built with our own plant.',
    heroHeadline: 'Road construction, grading, drainage and paving',
    heroLead:
      'We clear, grade, drain and surface access roads, estate roads, commercial compounds and feeder roads in Meru County, Nairobi and across Kenya, using our own earthmoving and compaction plant.',
    heroImage: {
      url: '/media/service-roads.jpg',
      alt: 'Motor grader and vibratory roller shaping a murram road formation with side drains',
      caption: 'Formation grading and culvert drainage installation in Meru County.',
    },
    summary:
      'Grading, murram gravelling, cabro block paving, concrete drains, culverts and tarmac surfacing for access roads and commercial compounds.',
    keyFacts: [
      {
        term: 'Where we work',
        value: 'Meru County, Nairobi and nationwide across Kenya',
      },
      {
        term: 'Typical projects',
        value:
          'Estate & rural access roads, commercial compounds, petrol stations, parking yards and county road rehabilitation',
      },
      {
        term: 'Surfaces',
        value:
          'Compacted murram/gravel, heavy-duty cabro blocks, surface dressing and hot-mix asphalt (tarmac)',
      },
      {
        term: 'Plant used',
        value: 'Excavators, motor graders, vibratory rollers and bulldozers from our own fleet',
      },
    ],
    intro: [
      'Most road failures in Kenya start below the surface: poor subgrade preparation, inadequate camber, or water that has nowhere to go during the rains. When we build or rehabilitate a road, we start with the ground and the drainage before we lay a stone.',
      'Because Shena Works owns and operates its own excavators, graders and rollers, we do not wait on third-party plant yards to clear a corridor, cut side drains or compact a sub-base. Whether you need a graded murram access road to a farm or lodge, a cabro-paved compound that takes heavy trucks, or tarmac and culvert works on an urban link road, one site team manages the earthworks, drainage and surfacing from setting out to final rolling.',
    ],
    scope: [
      {
        title: 'Earthworks and site clearing',
        description:
          'Bush clearing, topsoil stripping, cut-and-fill to level, and removal of unsuitable black cotton or soft soil.',
      },
      {
        title: 'Precision grading and gravelling',
        description:
          'Formation shaping, cross-fall (camber) grading with motor graders, murram/gravel spreading, watering and vibratory compaction.',
      },
      {
        title: 'Drainage and culverts',
        description:
          'Precast concrete pipe culverts, box culverts, concrete side drains (invert block and trapezoidal), mitre drains, headwalls and scour checks.',
      },
      {
        title: 'Cabro and interlocking block paving',
        description:
          '60 mm and 80 mm heavy-duty interlocking blocks on compacted quarry dust and sub-base for driveways, lounges, yards and petrol stations.',
      },
      {
        title: 'Tarmac and asphalt surfacing',
        description:
          'Prime coat, tack coat, asphalt concrete (AC) wearing course and surface dressing (chipping and bitumen) for urban and feeder roads.',
      },
      {
        title: 'Road repairs and rehabilitation',
        description:
          'Pothole cutting and patching, base reconstruction on failed sections, and shoulder re-grading.',
      },
      {
        title: 'Kerbs, channels and road furniture',
        description:
          'Precast concrete kerbs, channels, road markings, bollards and regulatory signage.',
      },
    ],
    process: [
      {
        title: 'Site walk and levels',
        description:
          'We walk the route or compound with you, check existing soil, water flow and access for low-loaders, and measure lengths and widths.',
      },
      {
        title: 'Specification and itemised quote',
        description:
          'We recommend the layer build-up (sub-base thickness, drainage, murram vs cabro vs tarmac) for your traffic load and give you an itemised quotation.',
      },
      {
        title: 'Earthworks, drainage and base',
        description:
          'Our plant clears, grades and compacts the formation, installs culverts and side drains, and builds up the compacted sub-base.',
      },
      {
        title: 'Surfacing, kerbs and handover',
        description:
          'We lay and compact the final surface, set kerbs and markings, clear the site and walk the finished road with you.',
      },
    ],
    faqs: [
      {
        question: 'Should I choose murram, cabro or tarmac for my access road?',
        answer:
          'It depends on gradient, traffic and budget. Well-compacted murram with proper side drains and culverts works well for farm and rural access roads on moderate slopes. Steep sections, commercial yards, lounges and estate roads carry less maintenance over time when paved with 60 mm or 80 mm cabro blocks or tarmac. We inspect the site first and price both options if you want to compare.',
      },
      {
        question: 'Why do you price drainage alongside the road surface?',
        answer:
          'Water is what destroys roads in Meru and central Kenya. Without side drains, mitre drains and culverts sized for heavy rain, runoff cuts channels through murram and washes out the bedding under cabro or tarmac. We always check where storm water enters and leaves the road.',
      },
      {
        question: 'What thickness of cabro blocks do I need?',
        answer:
          'Use 60 mm blocks for domestic driveways, footpaths and car parking. Use 80 mm heavy-duty interlocking blocks over a compacted crusher-run or stabilized sub-base where delivery trucks, tankers or buses will turn and park.',
      },
      {
        question: 'How do you price a road or paving job?',
        answer:
          'After visiting the site or reviewing your drawings/BoQ, we measure the area in square metres (m²) for paving and earthworks, and linear metres (m) for kerbs and drains, then quote per item including plant, materials and labour.',
      },
      {
        question: 'Can you work outside Meru County?',
        answer:
          'Yes. Our main yard is in Meru and we also operate from Nairobi, moving our plant by low-loader to projects across Kenya.',
      },
    ],
    formHeading: 'Get a quote for road works or earthworks',
    formIntro:
      'Tell us the location, approximate length or area, and whether you need grading, drainage, cabro or tarmac.',
    equipmentSlugs: ['motor-grader', 'crawler-excavator', 'vibratory-roller'],
  },
  {
    slug: 'cabro-paving',
    parentSlug: 'road-construction-and-earthworks',
    title: 'Cabro paving',
    shortTitle: 'Cabro paving',
    group: 'Roads and earthworks',
    _status: 'published',
    primaryKeyword: 'cabro paving Meru',
    formType: 'project',
    ctaLabel: 'Request a cabro quote',
    metaTitle: 'Cabro Paving Contractors in Meru & Nairobi | Shena Works',
    metaDescription:
      'Heavy-duty 60mm and 80mm cabro paving in Meru and Nairobi, from subgrade compaction and kerbs to storm drainage. See our work and request a site measure.',
    heroHeadline: 'Cabro paving for compounds, lounges, driveways and yards',
    heroLead:
      'Cabro only stays level when the ground underneath it is properly excavated, drained and compacted. We prepare the sub-base with our own rollers and lay 60 mm and 80 mm interlocking blocks across Meru and Nairobi.',
    heroImage: {
      url: '/media/service-cabro.jpg',
      alt: 'Herringbone interlocking cabro paving with concrete road kerbs and drainage channel',
      caption: 'Heavy-duty herringbone cabro paving at The Pin Hideout, Meru County.',
    },
    summary:
      '60 mm and 80 mm interlocking cabro paving with machine-compacted sub-base, concrete kerbs and storm drainage for commercial and residential compounds.',
    keyFacts: [
      {
        term: 'Block thicknesses',
        value: '60 mm (cars & light areas) and 80 mm heavy-duty (trucks, yards & petrol stations)',
      },
      {
        term: 'Base preparation',
        value: 'Excavation to level, compacted murram/hardcore sub-base, quarry dust bedding',
      },
      {
        term: 'Edge restraint',
        value: 'Precast concrete road kerbs, flush kerbs and drainage channels haunched in concrete',
      },
      {
        term: 'Completed examples',
        value: 'The Pin Hideout, The Black Perch Lounge',
      },
    ],
    intro: [
      'Anyone can lay paving blocks on a thin layer of quarry dust, and within one rainy season the tyres leave ruts and puddles. Lasting cabro work is mostly civil work: stripping soft topsoil, grading the formation to a fall so water runs to the drains, compacting the sub-base in layers with a vibratory roller, and locking the perimeter with concrete-haunched kerbs before the blocks go down.',
      'We supply and lay complete cabro packages for hospitality venues, petrol stations, commercial complexes, apartment parking and private compounds.',
    ],
    scope: [
      {
        title: 'Site stripping and excavation',
        description:
          'Removing vegetation and soft soil down to firm formation and carting away spoil.',
      },
      {
        title: 'Sub-base construction and compaction',
        description:
          'Spreading and compacting graded murram, hardcore or crusher-run with vibratory rollers to the required falls.',
      },
      {
        title: 'Storm-water drainage and channels',
        description:
          'Concrete side channels, grated catch-pits and pipe culverts so rain clears off the paved surface quickly.',
      },
      {
        title: 'Kerbs and edge restraints',
        description:
          'Setting precast road kerbs, mountable kerbs and edge beams on concrete beds and haunching so blocks cannot spread under turning wheels.',
      },
      {
        title: 'Quarry dust screeding and block laying',
        description:
          'Screeding 30–50 mm of quarry dust, laying 60 mm or 80 mm blocks in herringbone, stretcher or basket-weave patterns, and cutting edges cleanly with a disc cutter.',
      },
      {
        title: 'Joint sanding and plate compaction',
        description:
          'Vibrating the blocks into the bedding and brushing fine dry sand into the joints to lock the pavement.',
      },
    ],
    process: [
      {
        title: 'Measure and traffic check',
        description:
          'We measure the area (m²), check soil conditions and ask what vehicles will use the surface.',
      },
      {
        title: 'Drainage and levels plan',
        description:
          'We set falls toward drains or channels so water never ponds in front of entrances or parking bays.',
      },
      {
        title: 'Groundworks, base and kerbs',
        description:
          'Our plant excavates and compacts the sub-base and our masons fix all kerbs and channels.',
      },
      {
        title: 'Screeding, laying and compaction',
        description:
          'We lay the blocks, cut cleanly around manholes and corners, compact and sand the joints.',
      },
    ],
    faqs: [
      {
        question: 'What drives the cost of cabro paving per square metre?',
        answer:
          'Four things: how much soft soil has to be dug out and replaced, the thickness of the compacted sub-base needed for your vehicles, the length of kerbs and drains around the edges, and whether you choose 60 mm or 80 mm blocks (and standard grey vs coloured/patterned blocks).',
      },
      {
        question: 'Why does cabro sink or develop ruts after a few months?',
        answer:
          'Almost always because the contractor skipped sub-base compaction, laid blocks directly over black cotton soil, used too thick a layer of loose quarry dust, or left water to soak under the blocks without drainage.',
      },
      {
        question: 'Which laying pattern is strongest for cars and trucks?',
        answer:
          '45-degree or 90-degree herringbone locks blocks together in both directions under braking and turning tyres, so we recommend herringbone for driveways, parking bays and commercial yards.',
      },
      {
        question: 'How long does a cabro job take?',
        answer:
          'A typical 500–1,500 m² compound takes between two and four weeks depending on the depth of excavation, drainage works and weather.',
      },
    ],
    formHeading: 'Request a site measure and cabro quote',
    formIntro:
      'Tell us where the site is, the approximate area in square metres (if known), and whether it is for a home, lounge, apartments or heavy commercial vehicles.',
    equipmentSlugs: ['vibratory-roller', 'motor-grader', 'crawler-excavator'],
  },
  {
    slug: 'general-construction',
    title: 'General construction',
    shortTitle: 'General construction',
    group: 'Buildings and interiors',
    _status: 'published',
    primaryKeyword: 'building contractors Meru',
    formType: 'project',
    ctaLabel: 'Request a building quote',
    metaTitle: 'Building Contractors in Meru & Nairobi | Shena Works',
    metaDescription:
      'Commercial, hospitality and residential building contractors in Meru and Nairobi. Lounges, cottages, villas, apartments and commercial premises.',
    heroHeadline: 'Commercial, hospitality and residential building construction',
    heroLead:
      'We build lounges, cottages, villas, commercial buildings and family homes in Meru and Nairobi — handling the groundworks, structural frame, masonry, roofing, services and finishes under one contract.',
    heroImage: {
      url: '/media/service-building.jpg',
      alt: 'Reinforced concrete frame and natural stone masonry building construction in Meru',
      caption: 'Commercial and hospitality building construction in Meru County.',
    },
    summary:
      'Turnkey building construction for hospitality venues, commercial premises, cottages, villas and residential homes, from foundations to handover.',
    keyFacts: [
      {
        term: 'Sectors',
        value: 'Hospitality (lounges, cottages, restaurants), commercial buildings and residential homes',
      },
      {
        term: 'Structure',
        value:
          'Foundations, reinforced concrete frames, natural stone and block masonry, structural steelwork',
      },
      {
        term: 'Site works included',
        value: 'Site grading, storm drainage, cabro parking and perimeter walls',
      },
      {
        term: 'Completed examples',
        value: 'The Black Perch Lounge, Dukes Cottages Restaurant & Garden, Stone Lounge & Villas',
      },
    ],
    intro: [
      'Building a lounge, cottage development, commercial block or home takes coordination between the people digging the ground, the structural team pouring concrete, the masons, roofers, plumbers, electricians and finishers. When those trades are split across separate informal agreements, delays and finger-pointing follow.',
      'Shena Works takes responsibility for the whole build. We set out from your approved drawings and bill of quantities, run the site with a dedicated supervisor, coordinate the external civil works (access, drainage and parking) alongside the building, and report progress clearly at every stage.',
    ],
    scope: [
      {
        title: 'Substructure and foundations',
        description:
          'Site clearance, bulk excavation, strip and pad foundations, column bases, plinth walls, hardcore packing, anti-termite treatment and damp-proof membranes.',
      },
      {
        title: 'Reinforced concrete and structural steel',
        description:
          'Columns, beams, suspended slabs, staircases, retaining walls and structural steel roof/pavilion frames.',
      },
      {
        title: 'Masonry and external walls',
        description:
          'Dressed natural stone, machine-cut quarry stone, hollow concrete blockwork and architectural stone facades.',
      },
      {
        title: 'Roofing and rainwater goods',
        description:
          'Timber and steel roof trusses, versatile/box-profile sheets, stone-coated tiles, flat-roof waterproofing, gutters and downpipes.',
      },
      {
        title: 'Mechanical, electrical and plumbing (MEP) first & second fix',
        description:
          'Coordination of concealed conduits, power and lighting, water supply, drainage, biodigesters/septic tanks and specialist wellness plumbing (saunas, steam rooms, carwash bays).',
      },
      {
        title: 'Plastering, flooring, joinery and finishes',
        description:
          'Internal and external plastering, ceramic/porcelain/grass-tile flooring, ceilings, doors, windows, painting and external works.',
      },
      {
        title: 'Renovations and structural extensions',
        description:
          'Refitting existing commercial properties, converting spaces for hospitality use, and adding new wings or floors.',
      },
    ],
    process: [
      {
        title: 'Drawings and BoQ review',
        description:
          'We review your architectural and structural drawings and price your Bill of Quantities (or visit the site to prepare a detailed scope estimate).',
      },
      {
        title: 'Contract, programme and mobilisation',
        description:
          'We agree the contract sum, payment milestones and build schedule, then mobilise plant, site hoarding and storage.',
      },
      {
        title: 'Staged construction and inspections',
        description:
          'We build stage by stage — substructure, frame, walling, roofing, services and finishes — with inspections at each milestone before the next stage is covered.',
      },
      {
        title: 'Snagging, testing and handover',
        description:
          'We test all plumbing and electrical installations, complete a joint snagging walk-through with you, and hand over the keys and clean site.',
      },
    ],
    faqs: [
      {
        question: 'Do I need finished drawings and a Bill of Quantities before asking for a quote?',
        answer:
          'If you already have approved drawings and a BoQ, send them with your enquiry and we will price them directly. If you are still at the idea stage, contact us anyway — we can inspect the plot and advise on the next steps before construction starts.',
      },
      {
        question: 'How do payments work during a building project?',
        answer:
          'We work on agreed milestone stages or monthly valuations of work actually completed on site (for example: substructure complete, frame complete, roof on, plastering complete, finishes and handover), never 100% upfront.',
      },
      {
        question: 'Can you build both the premises and the parking, drainage and access road?',
        answer:
          'Yes. That is one of the main reasons hospitality and commercial clients in Meru choose Shena Works — our road and earthmoving plant prepares the site, storm drainage and cabro parking while our building team puts up the structures.',
      },
      {
        question:
          'Can you handle specialist hospitality facilities like lounges, restaurants, saunas and carwashes?',
        answer:
          'Yes. Our team built The Black Perch Lounge in Meru (lounges, restaurant areas, sauna, massage rooms and commercial carwash bays) and managed construction on Dukes Cottages, Restaurant & Garden.',
      },
    ],
    formHeading: 'Request a building quote',
    formIntro:
      'Attach your drawings or Bill of Quantities if you have them, or tell us what you plan to build and where the plot is.',
    equipmentSlugs: ['crawler-excavator', 'vibratory-roller'],
  },
  {
    slug: 'interior-design',
    title: 'Interior design',
    shortTitle: 'Interior design',
    group: 'Buildings and interiors',
    _status: 'published',
    primaryKeyword: 'interior design Meru',
    formType: 'consultation',
    ctaLabel: 'Request a consultation',
    metaTitle: 'Interior Design & Commercial Fit-Out in Meru | Shena Works',
    metaDescription:
      'Interior design and turnkey fit-outs for lounges, restaurants, hotels, offices and homes in Meru and Nairobi. Space planning, lighting, joinery and finishes.',
    heroHeadline: 'Interior design and fit-out for hospitality, commercial and residential spaces',
    heroLead:
      'We plan layouts, choose durable materials, design lighting and build custom joinery and finishes for lounges, restaurants, cottages, offices and homes in Meru and Nairobi.',
    heroImage: {
      url: '/media/service-interior.jpg',
      alt: 'Hospitality lounge interior with custom lighting, joinery and flooring in Meru',
      caption: 'Interior fit-out and architectural lighting at The Black Perch Lounge, Meru.',
    },
    summary:
      'Space planning, lighting, custom joinery, flooring and full interior fit-outs for hospitality venues, commercial spaces and homes.',
    keyFacts: [
      {
        term: 'Spaces',
        value: 'Hospitality lounges, restaurants, cottages, offices, retail units and family homes',
      },
      {
        term: 'Scope',
        value:
          'Space planning, 3D concept visuals, material boards, lighting, joinery and full site fit-out',
      },
      {
        term: 'Delivered by',
        value: 'One build team from shell to finished interior',
      },
      {
        term: 'Completed examples',
        value: 'The Black Perch Lounge (Meru), Stone Lounge & Villas',
      },
    ],
    intro: [
      'A hospitality venue or home is judged by how it feels to sit in, how traffic moves between the bar, kitchen, seating and washrooms, how the lighting looks after dark, and whether the finishes survive daily use. When the interior designer and the builder are separate, ideas on paper often get lost or overpriced on site.',
      'Because Shena Works both designs and builds interiors, we choose materials, ceiling details, lighting and joinery that we know how to source and install cleanly in Kenya.',
    ],
    scope: [
      {
        title: 'Space planning and layout',
        description:
          'Seating capacity, bar and service workflows, guest circulation, acoustic separation and furniture layouts.',
      },
      {
        title: 'Finishes and material selection',
        description:
          'Porcelain and ceramic tiling, grass-tile and indoor-outdoor lounge flooring, natural stone feature walls, wall textures and washable commercial paints.',
      },
      {
        title: 'Lighting and ambiance',
        description:
          'Warm ambient and task LED lighting, recessed ceiling bulkheads, pendant and feature fixtures, and outdoor pavilion lighting.',
      },
      {
        title: 'Custom joinery and fittings',
        description:
          'Reception and bar counters, shelving, booths, wardrobes, kitchen cabinetry and vanity units built to measure.',
      },
      {
        title: 'Ceilings and acoustic treatments',
        description:
          'Gypsum bulkheads, timber/baffle features and acoustic control for lounges and dining spaces.',
      },
      {
        title: 'Turnkey fit-out execution',
        description:
          'Managing all electrical, plumbing, tiling, carpentry and painting trades through to final styling and handover.',
      },
    ],
    process: [
      {
        title: 'Site visit and brief',
        description:
          'We measure the space, discuss how it will be used (guest numbers, brand feel, budget) and check existing services.',
      },
      {
        title: 'Layout, materials and pricing',
        description:
          'We propose a floor layout, finishes and lighting plan with an itemised fit-out budget.',
      },
      {
        title: 'Off-site fabrication and site prep',
        description:
          'Joinery is fabricated while electrical, plumbing, ceiling and floor preparation happen on site.',
      },
      {
        title: 'Installation, lighting focus and handover',
        description:
          'We install finishes and fittings, test and aim the lighting, clean the space and hand over ready for use.',
      },
    ],
    faqs: [
      {
        question: 'Can you fit out an existing building that someone else built?',
        answer:
          'Yes. We take on shell-and-core commercial spaces as well as refurbishments of existing lounges, restaurants, offices and homes.',
      },
      {
        question: 'Do you only provide drawings, or do you also do the actual fit-out work?',
        answer:
          'We focus on design-and-build fit-outs where our team carries out the ceiling, flooring, lighting, joinery and painting works on site so the finished room matches the agreed plan and budget.',
      },
      {
        question: 'How do you keep hospitality interiors durable?',
        answer:
          'High-traffic lounges and restaurants need commercial-grade slip-resistant floor tiles, moisture-resistant counters, cleanable wall finishes and accessible LED drivers. We specify materials built for heavy foot traffic rather than fragile domestic finishes.',
      },
      {
        question: 'How much does an interior fit-out cost?',
        answer:
          'Cost depends on the floor area, the condition of the shell, and the level of custom joinery and lighting. After measuring the space and agreeing the scope, we give you an itemised quotation so you can adjust finishes to fit your budget.',
      },
    ],
    formHeading: 'Book an interior consultation',
    formIntro:
      'Tell us what kind of space you are fitting out, where it is, and when you want it open.',
  },
  {
    slug: 'project-management',
    title: 'Project management',
    shortTitle: 'Project management',
    group: 'Planning and delivery',
    _status: 'published',
    primaryKeyword: 'construction project management Kenya',
    formType: 'consultation',
    ctaLabel: 'Request a consultation',
    metaTitle: 'Construction Project Management in Meru & Nairobi | Shena Works',
    metaDescription:
      'On-site construction project management in Meru and Nairobi: scheduling, contractor coordination, quality inspections, cost control and handover.',
    heroHeadline: 'Construction project management and site supervision',
    heroLead:
      'For developers and property owners who want experienced eyes on site every day — managing the programme, checking materials and workmanship, controlling variations and reporting clearly.',
    heroImage: {
      url: '/media/service-pm.jpg',
      alt: 'Site supervisor reviewing construction drawings and progress on site in Meru',
      caption: 'On-site quality inspection and trade coordination in Meru County.',
    },
    summary:
      'End-to-end site supervision, scheduling, subcontractor coordination, quality inspections and cost tracking for private and commercial builds.',
    keyFacts: [
      {
        term: 'For whom',
        value: 'Private developers, diaspora builders, hospitality owners and commercial clients',
      },
      {
        term: 'Core stages',
        value: 'Initiation, planning, execution, monitoring & cost control, closure & handover',
      },
      {
        term: 'Reporting',
        value:
          'Scheduled site progress reports with dated photographs, cost updates and milestone sign-offs',
      },
      {
        term: 'Lead experience',
        value: 'Hospitality complexes and urban road inspection experience',
      },
    ],
    intro: [
      'Many building projects in Kenya go over budget or stall because the owner cannot be on site every day to verify material deliveries, check reinforcement before concrete is poured, or keep subcontractors working in the right sequence.',
      'Led by Managing Director Newton Muthee — who has managed hospitality developments in Meru County and inspected road works for the Kenya Urban Roads Authority — Shena Works provides structured project management from pre-construction planning through to final snagging and handover.',
    ],
    scope: [
      {
        title: 'Pre-construction review and planning',
        description:
          'Reviewing drawings, bills of quantities and permits; setting up a realistic master programme and procurement schedule.',
      },
      {
        title: 'Contractor and trade coordination',
        description:
          'Sequencing civil, structural, MEP and finishing trades so one team does not hold up the next or damage completed work.',
      },
      {
        title: 'Quality assurance and milestone inspections',
        description:
          'Checking setting out, trench depths, steel reinforcement, concrete mixes, road compaction and finishes against specifications before work is covered up.',
      },
      {
        title: 'Cost control and valuation verification',
        description:
          'Measuring completed work on site before interim payments are certified, tracking material usage and assessing variation claims.',
      },
      {
        title: 'Site safety and regulatory compliance',
        description:
          'Enforcing daily site safety practices, county permit conditions and environmental requirements.',
      },
      {
        title: 'Snagging, testing and handover',
        description:
          'Running pre-handover inspections, logging defects, verifying rectification and closing out final accounts.',
      },
    ],
    process: [
      {
        title: 'Brief and project audit',
        description:
          'Whether your project is about to start or is already underway, we review the drawings, budget, contracts and current site status.',
      },
      {
        title: 'Programme and control baseline',
        description:
          'We establish the schedule, milestone inspection points, reporting routine and payment verification process.',
      },
      {
        title: 'Site supervision and reporting',
        description:
          'We supervise execution on site, coordinate trades and send you clear, dated progress and cost updates.',
      },
      {
        title: 'Snagging and closure',
        description:
          'We oversee testing, snagging rectification and final handover documentation.',
      },
    ],
    faqs: [
      {
        question:
          'Can you manage a project if I live in Nairobi or abroad and am building in Meru?',
        answer:
          'Yes. Many clients need a trusted technical representative on the ground in Meru who verifies deliveries, checks quality at every stage and sends regular photo and cost reports before milestones are paid.',
      },
      {
        question:
          'What is the difference between hiring Shena Works as general contractor versus project manager?',
        answer:
          'As general contractor, we employ the site teams, supply the plant and materials, and contract to build the works for an agreed sum. As project manager, we act on your behalf to plan, supervise and verify the work of the contractors and suppliers on your project.',
      },
      {
        question: 'Can you step in on a project that has already started?',
        answer:
          'Yes. We start with a site and commercial audit — measuring what has been built against what has been paid, checking structural and workmanship quality, and setting a clear recovery programme for the remaining works.',
      },
      {
        question: 'How do you charge for project management?',
        answer:
          'Depending on the project size and how often we are needed on site, we agree either a fixed monthly supervision fee for the build duration or a percentage of the construction value, stated upfront in writing.',
      },
    ],
    formHeading: 'Talk to us about managing your build',
    formIntro:
      'Tell us where the project is, what stage it is at, and what support you need on site.',
  },
  {
    slug: 'architecture-and-consultancy',
    title: 'Architecture and consultancy',
    shortTitle: 'Architecture',
    group: 'Planning and delivery',
    _status: 'draft',
    primaryKeyword: 'architectural design Meru',
    formType: 'consultation',
    ctaLabel: 'Request a consultation',
    metaTitle: 'Architectural Design & Building Consultancy in Meru | Shena Works',
    metaDescription:
      'Architectural planning, 2D working drawings, 3D visualisations, site feasibility and county approval coordination in Meru and Nairobi.',
    heroHeadline: 'Architectural planning, working drawings and site feasibility',
    heroLead:
      'Practical architectural design and working drawings coordinated with structural engineering and real construction costs from the start.',
    heroImage: {
      url: '/media/service-pm.jpg',
      alt: 'Architectural working drawings and site layout plans',
      caption: 'Architectural working drawings coordinated with construction planning.',
    },
    summary:
      'Site feasibility, concept design, 2D construction drawings, 3D visualisations and county approval coordination.',
    keyFacts: [
      {
        term: 'Deliverables',
        value: 'Concept layouts, 3D visualisations, architectural working drawings and approval sets',
      },
      {
        term: 'Sectors',
        value: 'Hospitality, commercial developments and custom residential homes',
      },
    ],
    intro: [
      'Good drawings do more than pass approvals — they fit the slope and drainage of the plot, respect your budget, and give the site team clear dimensions to build from without guesswork.',
    ],
    scope: [
      {
        title: 'Site feasibility and brief development',
        description:
          'Assessing plot access, slope, orientation, zoning and utilities to establish what fits the site and budget.',
      },
      {
        title: 'Concept design and spatial planning',
        description:
          'Floor plans, room relationships, site master-planning and traffic/parking layouts.',
      },
    ],
    process: [
      {
        title: 'Plot visit and brief',
        description:
          'We visit the plot, review the survey/beacons and agree your accommodation brief and target budget.',
      },
      {
        title: 'Concept plans and 3D views',
        description:
          'We prepare initial floor layouts and 3D massing for your review and adjustments.',
      },
      {
        title: 'Detailed working drawings',
        description:
          'Once the layout is signed off, we produce complete architectural drawings coordinated with structural design.',
      },
      {
        title: 'Approvals and transition to build',
        description:
          'Drawings are submitted for statutory approvals and handed to the estimating/construction team for pricing.',
      },
    ],
    faqs: [],
    formHeading: 'Book an architectural consultation',
    formIntro: 'Tell us where your plot is and what you would like to design.',
  },
  {
    slug: 'bills-of-quantities-and-estimating',
    title: 'Bills of quantities and estimating',
    shortTitle: 'Bills of quantities',
    group: 'Planning and delivery',
    _status: 'draft',
    primaryKeyword: 'bill of quantities Kenya',
    formType: 'consultation',
    ctaLabel: 'Request an estimate',
    metaTitle: 'Bills of Quantities & Construction Estimating | Shena Works',
    metaDescription:
      'Itemised Bills of Quantities (BoQ), quantity takeoffs, construction cost estimates, tender preparation and interim valuations in Meru and Nairobi.',
    heroHeadline: 'Bills of quantities, quantity takeoffs and construction cost estimates',
    heroLead:
      'Know what your road or building will cost before work starts on site — itemised quantities of materials, plant and labour that let you budget accurately and compare quotes fairly.',
    heroImage: {
      url: '/media/service-pm.jpg',
      alt: 'Construction cost estimating and Bill of Quantities preparation',
      caption: 'Quantity takeoffs and construction estimating.',
    },
    summary:
      'Quantity takeoffs, itemised Bills of Quantities (BoQ), cost estimates, tender pricing and interim payment valuations.',
    keyFacts: [
      {
        term: 'Deliverables',
        value: 'Preliminaries, preambles, measured works, provisional sums, prime cost sums and contingencies',
      },
      {
        term: 'Used for',
        value: 'Project budgeting, bank financing, tender comparisons and stage payments',
      },
    ],
    intro: [
      'Starting a build on a single lump-sum figure or a rough per-square-metre guess is the fastest way to run out of money mid-project.',
    ],
    scope: [],
    process: [],
    faqs: [],
    formHeading: 'Request a Bill of Quantities or cost estimate',
    formIntro: 'Attach your drawings (PDF) and tell us where the project is located.',
  },
]

export const projectsSeed: ProjectRecord[] = [
  {
    slug: 'the-black-perch-lounge',
    title: 'The Black Perch Lounge',
    location: {
      town: 'Meru',
      county: 'Meru County',
    },
    clientType: 'Commercial & Hospitality',
    status: 'Completed',
    year: '2024',
    role: 'General Contractor & Project Manager',
    deliveringCompany: 'Shena Works Limited',
    verificationEvidenceNote: 'Completed hospitality & civil works reference site in Meru County',
    serviceSlugs: [
      'general-construction',
      'interior-design',
      'cabro-paving',
      'road-construction-and-earthworks',
      'project-management',
    ],
    equipmentSlugs: ['crawler-excavator', 'motor-grader', 'vibratory-roller'],
    featured: true,
    _status: 'published',
    metaTitle: 'The Black Perch Lounge, Meru | Shena Works Projects',
    metaDescription:
      'Construction, interior fit-out, wellness facilities, carwash bays and cabro parking for The Black Perch Lounge in Meru County by Shena Works.',
    heroImage: {
      url: '/media/project-black-perch.jpg',
      alt: 'Exterior view of The Black Perch Lounge pavilions and cabro forecourt in Meru',
      caption: 'Lounge pavilions, wellness suites and cabro forecourt at The Black Perch Lounge, Meru.',
    },
    keyFigures: [
      {
        value: '5 zones',
        label: 'Lounge pavilions, restaurant, sauna & massage, carwash bays & cabro parking',
      },
    ],
    brief:
      'The client wanted to turn a Meru site into a multi-service hospitality and lifestyle destination — combining modern indoor and outdoor lounge pavilions, a restaurant, sauna, steam and massage rooms, commercial carwash bays and customer parking on a single plot. Every zone needed its own plumbing, drainage and atmosphere while sharing one coherent layout and entrance.',
    work:
      'We handled both the building construction and the site civil works. Our earthmoving team cleared and graded the plot, installed storm-water drainage and petrol/oil interceptors for the carwash bays, compacted the sub-base and laid heavy-duty cabro paving across the drive-in and parking areas. On the buildings and interiors, we built the lounge pavilions and wellness rooms, installed moisture-resistant plumbing and finishes for the sauna, steam and massage suites, laid custom grass-tile and porcelain flooring in the social areas, and fitted warm architectural and mood lighting for evening service.',
    result:
      'The Black Perch Lounge opened as a complete day-to-night venue where guests can use the carwash, wellness rooms, restaurant and lounges without congestion or drainage issues during heavy Meru rains.',
    gallery: [
      {
        url: '/media/project-black-perch.jpg',
        alt: 'Wide exterior view of the lounge pavilions and cabro forecourt at The Black Perch Lounge',
        caption: 'Exterior view of the lounge pavilions and cabro forecourt at dusk.',
      },
      {
        url: '/media/service-interior.jpg',
        alt: 'Lounge interior showing custom grass-tile flooring, seating and ambient ceiling lighting',
        caption: 'Lounge interior showing custom grass-tile flooring, seating and ambient lighting.',
      },
      {
        url: '/media/service-cabro.jpg',
        alt: 'Cabro-paved parking and drive-through circulation showing kerbs and surface drainage',
        caption: 'Cabro-paved parking and drive-through circulation with concrete kerbs and drainage.',
      },
    ],
  },
  {
    slug: 'the-pin-hideout',
    title: 'The Pin Hideout',
    location: {
      town: 'Meru',
      county: 'Meru County',
    },
    clientType: 'Commercial & Hospitality',
    status: 'Completed',
    year: '2024',
    role: 'Civil Works & Cabro Paving Contractor; Project Management',
    deliveringCompany: 'Shena Works Limited',
    verificationEvidenceNote: 'Completed cabro compound and access road in Meru County',
    serviceSlugs: ['road-construction-and-earthworks', 'cabro-paving', 'project-management'],
    equipmentSlugs: ['crawler-excavator', 'motor-grader', 'vibratory-roller'],
    featured: true,
    _status: 'published',
    metaTitle: 'The Pin Hideout Cabro Paving & Access Roads | Shena Works',
    metaDescription:
      'Site grading, storm-water drainage, access road works and heavy-duty cabro paving for The Pin Hideout commercial complex by Shena Works.',
    heroImage: {
      url: '/media/project-pin-hideout.jpg',
      alt: 'Completed cabro-paved compound and entrance road at The Pin Hideout in Meru County',
      caption: 'Heavy-duty herringbone cabro compound and storm drainage at The Pin Hideout.',
    },
    keyFigures: [
      {
        value: '80 mm',
        label: 'Interlocking cabro paving over machine-compacted sub-base',
      },
    ],
    brief:
      'The Pin Hideout needed an all-weather access road and a level, well-drained cabro compound capable of handling daily guest vehicles and delivery trucks without mud in the wet season or dust in the dry season.',
    work:
      'We started by stripping the soft surface soil and grading the approach road and parking compound to clear falls. Using our own grader and vibratory roller, we built up and compacted the sub-base in layers, installed concrete side drains and culverts at the water crossings, and fixed concrete-haunched road kerbs around every bay and island. We then screeded quarry dust bedding, laid interlocking cabro blocks in a herringbone pattern, cut clean edges around inspection chambers, and compacted and sanded the joints.',
    result:
      'The finished access road and compound drain cleanly during downpours and have stayed level under daily commercial traffic, giving visitors a clean approach from the main road to the entrance.',
    gallery: [
      {
        url: '/media/project-pin-hideout.jpg',
        alt: 'Completed cabro-paved compound and entrance at The Pin Hideout',
        caption: 'Completed cabro-paved compound and entrance at The Pin Hideout.',
      },
      {
        url: '/media/service-cabro.jpg',
        alt: 'Close-up of herringbone cabro joints and kerb haunching',
        caption: 'Close-up of herringbone cabro paving and concrete kerb haunching.',
      },
      {
        url: '/media/equip-roller.jpg',
        alt: 'Vibratory roller compacting the murram sub-base prior to cabro laying',
        caption: 'Compaction stage: vibratory roller locking the murram sub-base.',
      },
    ],
  },
  {
    slug: 'dukes-cottages-restaurant-and-garden',
    title: 'Dukes Cottages, Restaurant & Garden',
    location: {
      town: 'Meru',
      county: 'Meru County',
    },
    clientType: 'Hospitality',
    status: 'Completed',
    year: '2020–2021',
    role: 'Site Project Manager (delivered by Newton Muthee prior to founding Shena Works)',
    deliveringCompany: 'Dukes Limited',
    verificationEvidenceNote: 'Supervised on contract by Newton Muthee for Dukes Limited (2020–2021)',
    serviceSlugs: ['general-construction', 'project-management'],
    equipmentSlugs: [],
    featured: true,
    _status: 'published',
    metaTitle: 'Dukes Cottages, Restaurant & Garden, Meru | Shena Works',
    metaDescription:
      'Site project management for the Dukes Cottages, Restaurant & Garden hospitality complex in Meru County, supervised by Newton Muthee for Dukes Limited.',
    heroImage: {
      url: '/media/project-dukes.jpg',
      alt: 'Guest cottages, dining restaurant and landscaped gardens at Dukes Cottages in Meru',
      caption: 'Guest cottages, central restaurant and landscaped pathways in Meru County.',
    },
    keyFigures: [
      {
        value: '13 months',
        label: 'On-site supervision (Feb 2020 – Feb 2021)',
      },
      {
        value: '3 elements',
        label: 'Guest cottages, full-service restaurant & landscaped gardens',
      },
    ],
    brief:
      'Dukes Cottages, Restaurant & Garden in Meru County brought together detached guest cottages, a central dining restaurant and landscaped grounds on one site. The build required tight daily coordination of masonry, roofing, plumbing, electrical, kitchen/restaurant fit-out and external landscaping teams so all units reached completion together.',
    work:
      'Before founding Shena Works Limited, our Managing Director Newton Muthee served on contract as Site Project Manager for Dukes Limited from February 2020 to February 2021. On site every day, he planned trade sequences, allocated workforces, managed material inventories and deliveries, checked structural and finishing quality across each cottage and the restaurant block, and coordinated the garden pathways and external drainage.',
    result:
      'The cottages, restaurant and grounds were completed to specification and handed over ready for guests — establishing the hands-on hospitality site management approach we now bring to Shena Works projects across Meru.',
    gallery: [
      {
        url: '/media/project-dukes.jpg',
        alt: 'Completed guest cottages and landscaped garden path at Dukes Cottages',
        caption: 'Completed guest cottages and landscaped garden pathways.',
      },
      {
        url: '/media/service-building.jpg',
        alt: 'Cottage roofing, stonework and veranda detail',
        caption: 'Cottage roofing, natural stonework and veranda construction detail.',
      },
      {
        url: '/media/service-pm.jpg',
        alt: 'Site supervision and trade coordination during construction',
        caption: 'Daily site supervision and trade sequence management.',
      },
    ],
  },
  {
    slug: 'stone-lounge-and-villas',
    title: 'Stone Lounge & Villas',
    location: {
      town: 'Meru',
      county: 'Meru County',
    },
    clientType: 'Hospitality & Residential',
    status: 'Completed',
    year: '2024',
    role: 'General Contractor — Building & Interior Fit-Out',
    deliveringCompany: 'Shena Works Limited',
    verificationEvidenceNote: 'Completed stone masonry and interior fit-out in Meru County',
    serviceSlugs: ['general-construction', 'interior-design'],
    equipmentSlugs: ['crawler-excavator', 'vibratory-roller'],
    featured: true,
    _status: 'published',
    metaTitle: 'Stone Lounge & Villas, Meru | Shena Works Projects',
    metaDescription:
      'Natural stone masonry, structural works and contemporary interior finishes for Stone Lounge & Villas by Shena Works.',
    heroImage: {
      url: '/media/project-stone-lounge.jpg',
      alt: 'Dressed natural stone facade and roof lines at Stone Lounge & Villas',
      caption: 'Architectural natural stone masonry and contemporary interiors at Stone Lounge & Villas.',
    },
    keyFigures: [
      {
        value: '2 zones',
        label: 'Private residential villas & social lounge pavilion',
      },
    ],
    brief:
      'Stone Lounge & Villas paired private residential villas with an upscale social lounge, using dressed natural stone facades on the outside and contemporary finishes inside. The client wanted buildings that looked rooted in the landscape while staying dry, bright and easy to maintain.',
    work:
      'We executed the structural foundations and frames, built the load-bearing and architectural natural stone masonry walls with clean mortar jointing, erected the roofs, and completed the internal plastering, tiling, joinery, lighting and bathroom fit-outs. Externally, we graded the compound, built storm drains and paved the approach and parking areas.',
    result:
      'The finished villas and lounge combine heavy natural stone character with clean modern interiors, delivered on a well-drained, accessible compound.',
    gallery: [
      {
        url: '/media/project-stone-lounge.jpg',
        alt: 'Exterior elevation showing natural stone facade and roof lines',
        caption: 'Exterior elevation showing dressed natural stone masonry and roof lines.',
      },
      {
        url: '/media/service-interior.jpg',
        alt: 'Lounge interior showing stone feature wall, lighting and flooring',
        caption: 'Lounge interior with natural stone feature walls and warm lighting.',
      },
      {
        url: '/media/service-building.jpg',
        alt: 'Structural frame and stone masonry construction detail',
        caption: 'Natural stone masonry and structural framing workmanship.',
      },
    ],
  },
  {
    slug: 'meru-access-road-grading-and-drainage',
    title: 'Meru Access Road Grading, Culverts & Drainage Works',
    location: {
      town: 'Meru',
      county: 'Meru County',
    },
    clientType: 'Civil & Roads',
    status: 'Completed',
    year: '2024',
    role: 'Main Civil & Earthworks Contractor',
    deliveringCompany: 'Shena Works Limited',
    verificationEvidenceNote: 'Completed road grading, culverts and drainage works in Meru County',
    serviceSlugs: ['road-construction-and-earthworks'],
    equipmentSlugs: ['motor-grader', 'crawler-excavator', 'vibratory-roller'],
    featured: true,
    _status: 'published',
    metaTitle: 'Road Grading, Culverts & Drainage in Meru | Shena Works',
    metaDescription:
      'Precision road grading, murram gravelling, culvert installation and storm-water drainage in Meru County by Shena Works.',
    heroImage: {
      url: '/media/hero-roads.jpg',
      alt: 'Graded and compacted murram access road with trapezoidal side drains in Meru County',
      caption: 'Graded murram road profile with side drains and concrete pipe culverts in Meru County.',
    },
    keyFigures: [
      {
        value: '3 stages',
        label: 'Culvert crossings, camber grading & vibratory murram compaction',
      },
    ],
    brief:
      'Seasonal rains had cut deep gullies along the access corridor in Meru County, washing out low crossings and leaving the route impassable to cars and farm transport after heavy showers. The brief was to restore the road profile, put in permanent cross-drainage and compact a durable running surface.',
    work:
      'Our excavator cleared encroaching bush, opened blocked outlets and excavated trenches at the low crossing points, where we laid precast concrete pipe culverts with stone-pitched headwalls and aprons. Our motor grader then reshaped the road formation to a true camber, cut trapezoidal side drains and mitre drains to lead water safely off the reserve, and spread selected murram gravel. Finally, we watered and compacted the surface in passes with our vibratory roller.',
    result:
      'Storm water now discharges through the side drains and culverts instead of running down the wheel tracks, keeping the road open year-round for residents and deliveries.',
    gallery: [
      {
        url: '/media/hero-roads.jpg',
        alt: 'Finished graded and compacted road showing camber and clean side drains',
        caption: 'Finished graded and compacted murram road showing camber and side drains.',
      },
      {
        url: '/media/equip-excavator.jpg',
        alt: 'Excavator trenching and lowering precast concrete culvert rings',
        caption: 'Excavator trenching and installing precast concrete culvert rings.',
      },
      {
        url: '/media/equip-grader.jpg',
        alt: 'Motor grader shaping the formation and cutting side drains',
        caption: 'Motor grader shaping the formation camber and cutting V-drains.',
      },
    ],
  },
]

export const equipmentCategoriesSeed: EquipmentCategoryRecord[] = [
  {
    slug: 'excavators',
    name: 'Excavators',
    singular: 'excavator',
    plural: 'excavators',
    article: 'an',
    primaryKeyword: 'excavator hire Meru',
    metaTitle: 'Excavator Hire in Meru and Kenya | Shena Works',
    metaDescription:
      'Hire crawler and wheeled excavators with experienced operators in Meru and across Kenya for bulk excavation, foundation trenching, culverts and dam digging.',
    heroHeadline: 'Excavator hire in Meru and across Kenya',
    heroLead:
      'Crawler and wheeled excavators with experienced operators for bulk excavation, foundation trenching, culvert installation, quarry loading, dam desilting and demolition.',
    heroImage: {
      url: '/media/equip-excavator.jpg',
      alt: 'Shena Works 20-tonne class crawler excavator on site in Meru County',
      caption: 'Crawler excavator with operator during bulk excavation and trenching.',
    },
    summary:
      'Deep excavations, trenching, culvert laying, rock/quarry loading, dam digging and site clearing.',
    intro: [
      'Whether you are digging pad foundations for a commercial building, excavating culvert trenches along an access road, desilting a water pan or loading murram tippers, output depends on having a well-maintained excavator and an operator who knows how to dig cleanly to level.',
      'We hire out our excavators with trained operators from our Meru yard to projects across Meru County, Mount Kenya East, Nairobi and nationwide.',
    ],
    uses: [
      {
        title: 'Foundation and basement excavation',
        description: 'Digging pad bases, strip trenches and deep basements cleanly to level.',
      },
      {
        title: 'Road drainage and culvert trenches',
        description: 'Excavating side-drain channels, culvert crossings and soak pits.',
      },
      {
        title: 'Dam digging and water pans',
        description: 'Excavating and shaping farm dams, reservoirs and water pans.',
      },
      {
        title: 'Quarry and tipper loading',
        description: 'High-output loading of murram, ballast, hardcore and spoil into tippers.',
      },
      {
        title: 'Bush clearing and stump removal',
        description: 'Uprooting trees, boulders and old foundations before construction.',
      },
    ],
    faqs: [
      {
        question: 'Does the excavator come with a trained operator?',
        answer:
          'Yes. Every excavator is hired with our own operator who performs daily pre-shift checks and sets out trenches and excavations accurately.',
      },
      {
        question: 'Can you quote both dry rate and wet rate for excavator hire?',
        answer:
          'Yes. We offer dry hire (machine and operator, client supplies diesel on site) and wet hire (inclusive of fuel) depending on your project structure.',
      },
    ],
  },
  {
    slug: 'graders',
    name: 'Motor graders',
    singular: 'motor grader',
    plural: 'motor graders',
    article: 'a',
    primaryKeyword: 'grader hire Kenya',
    metaTitle: 'Motor Grader Hire in Meru and Kenya | Shena Works',
    metaDescription:
      'Precision motor grader hire with skilled operators in Meru and across Kenya for road grading, camber shaping, murram spreading and side-drain cutting.',
    heroHeadline: 'Motor grader hire in Meru and across Kenya',
    heroLead:
      'Precision motor graders with skilled operators for access road formation, camber shaping, murram spreading, side-drain cutting and bank sloping.',
    heroImage: {
      url: '/media/equip-grader.jpg',
      alt: 'Shena Works motor grader shaping road camber and side drains in Meru',
      caption: 'Motor grader shaping road cross-fall and cutting trapezoidal side drains.',
    },
    summary:
      'Road formation grading, camber shaping, murram spreading, side-drain cutting and sub-base leveling.',
    intro: [
      'A proper road profile cannot be cut with a loader bucket or tractor blade. Motor graders use a long wheelbase and articulated moldboard blade to cut true cross-falls (camber), shape clean side drains and spread murram in uniform lifts ready for compaction.',
      'Our graders are hired with experienced road-grading operators who understand drainage falls and sub-base tolerances.',
    ],
    uses: [
      {
        title: 'Access and feeder road grading',
        description: 'Reshaping rutted murram roads and restoring proper cross-fall (camber).',
      },
      {
        title: 'Sub-base spreading and leveling',
        description:
          'Spreading imported murram or graded crushed stone to uniform thickness before rolling.',
      },
      {
        title: 'Side-drain and mitre-drain cutting',
        description: 'Using blade angle and tilt to cut clean V-drains along road shoulders.',
      },
      {
        title: 'Compound and yard leveling',
        description:
          'Trimming large commercial compounds and parking yards to accurate falls before cabro or tarmac.',
      },
    ],
    faqs: [
      {
        question: 'Why use a motor grader instead of a backhoe or tractor blade?',
        answer:
          'The long wheelbase and 6-way articulated moldboard of a motor grader produce a level, crown-shaped surface and clean V-drains that shed rainwater rather than ponding it.',
      },
      {
        question: 'Can I hire the grader together with a vibratory roller?',
        answer:
          'Yes. Most road and compound clients hire our grader and single-drum vibratory roller together so freshly spread murram is compacted immediately.',
      },
    ],
  },
  {
    slug: 'rollers',
    name: 'Rollers and compactors',
    singular: 'roller',
    plural: 'rollers',
    article: 'a',
    primaryKeyword: 'roller hire Meru',
    metaTitle: 'Vibratory Roller & Compactor Hire in Meru & Kenya | Shena Works',
    metaDescription:
      'Hire single-drum and double-drum vibratory rollers with operators in Meru and across Kenya for soil, murram sub-base, cabro and asphalt compaction.',
    heroHeadline: 'Vibratory roller and compactor hire in Meru and Kenya',
    heroLead:
      'Single-drum and double-drum vibratory rollers with operators for soil, murram sub-base, hardcore and asphalt compaction.',
    heroImage: {
      url: '/media/equip-roller.jpg',
      alt: 'Single-drum vibratory roller compacting a murram sub-base in Meru',
      caption: 'Single-drum vibratory roller compacting road sub-base in Meru County.',
    },
    summary:
      'Subgrade, murram, crusher-run and cabro/asphalt compaction to specification.',
    intro: [
      'Uncompacted murram or sub-base washes away in the first rainy season and leaves ruts under vehicle wheels. Heavy vibratory compaction locks soil and aggregate particles together so roads, parking yards and building slabs stay level.',
    ],
    uses: [
      {
        title: 'Road subgrade and murram compaction',
        description:
          'Compacting watered murram layers so access roads resist rutting and washouts.',
      },
      {
        title: 'Cabro and building sub-base preparation',
        description: 'Locking hardcore and quarry dust sub-bases before paving or floor slabs.',
      },
      {
        title: 'Asphalt and surface dressing rolling',
        description:
          'Compacting hot-mix tarmac and stone chippings to a smooth, sealed finish.',
      },
    ],
    faqs: [
      {
        question: 'What weight class of roller do I need for an access road or cabro yard?',
        answer:
          'A 10 to 12 tonne single-drum vibratory roller provides the static weight and centrifugal force required to compact murram and crusher-run sub-bases in 150–200 mm lifts.',
      },
    ],
  },
  {
    slug: 'bulldozers',
    name: 'Bulldozers',
    singular: 'bulldozer',
    plural: 'bulldozers',
    article: 'a',
    primaryKeyword: 'bulldozer hire Kenya',
    metaTitle: 'Bulldozer Hire in Meru & Kenya | Shena Works',
    metaDescription:
      'Heavy crawler bulldozer hire with operators for bush clearing, ripping, bulk cut-and-fill earthworks and dam construction across Kenya.',
    heroHeadline: 'Bulldozer hire for bush clearing and bulk earthworks',
    heroLead:
      'Heavy crawler dozers with operators for bush clearing, ripping, cut-and-fill earthworks and dam construction across Kenya.',
    heroImage: {
      url: '/media/equip-bulldozer.jpg',
      alt: 'Heavy crawler bulldozer with blade and ripper clearing land',
      caption: 'Crawler bulldozer performing bush clearing and bulk cut-and-fill earthworks.',
    },
    summary:
      'Heavy bush clearing, ripping, bulk cut-and-fill earthmoving and stockpiling.',
    intro: [
      'For opening new road corridors, clearing dense bush on agricultural or estate land, ripping hard murram pits and pushing bulk cut-and-fill volumes, crawler bulldozers deliver the traction and blade force that wheeled machines cannot match.',
    ],
    uses: [
      {
        title: 'Heavy bush and land clearing',
        description:
          'Clearing thick bush, trees and boulders on new farm, estate or road corridors.',
      },
      {
        title: 'Bulk cut-and-fill earthworks',
        description:
          'Pushing large volumes of soil over short-to-medium haul distances to level sloping plots.',
      },
      {
        title: 'Ripping hard ground and murram pits',
        description:
          'Ripping weathered rock and hard murram for excavation or road gravelling.',
      },
    ],
    faqs: [
      {
        question: 'How is the bulldozer transported to site?',
        answer:
          'We move our crawler bulldozer by heavy low-loader from our yard to your site and quote mobilisation and demobilisation upfront based on distance.',
      },
    ],
  },
]

export const defaultHireTerms = {
  operator: 'Included — machine is hired only with a Shena-trained operator',
  fuel: '[CONFIRM: Dry rate (client supplies diesel on site) or wet rate option]',
  transport:
    'Low-loader mobilisation and demobilisation quoted from Meru or Nairobi yard to your site',
  minimumHire: '[CONFIRM: e.g. 1 day (8 working hours)]',
  serviceArea:
    'Meru, Isiolo, Laikipia, Tharaka-Nithi, Nyeri, Embu, Kirinyaga, Nairobi and nationwide for longer hires',
}

export const machinesSeed: MachineRecord[] = [
  {
    slug: 'crawler-excavator',
    name: 'Crawler Excavator',
    categorySlug: 'excavators',
    make: '[CONFIRM: e.g. Caterpillar / Komatsu / Hitachi / Sany]',
    model: '[CONFIRM: e.g. 320D / PC200 / ZX200]',
    capacity: '[CONFIRM: e.g. 20-tonne class, 1.0 m³ bucket]',
    operatingWeight: undefined,
    attachmentSize: undefined,
    enginePower: undefined,
    availability: 'available',
    featured: true,
    _status: 'draft',
    heroImage: {
      url: '/media/equip-excavator.jpg',
      alt: 'Crawler excavator for hire in Meru County',
      caption: 'Crawler excavator available for hire with operator.',
    },
    gallery: [
      {
        url: '/media/equip-excavator.jpg',
        alt: 'Crawler excavator excavating trenches',
        caption: 'Crawler excavator performing trenching and bulk earthworks.',
      },
    ],
    uses: [
      {
        title: 'Bulk excavation and basements',
        description: 'High-volume digging for building substructures, basements and retaining walls.',
      },
      {
        title: 'Culvert and drainage trenching',
        description: 'Digging accurate trenches for precast concrete culvert pipes and side drains.',
      },
      {
        title: 'Water pans, dams and quarry loading',
        description: 'Excavating reservoirs and loading tippers with murram or hardcore.',
      },
    ],
    hireTerms: defaultHireTerms,
  },
  {
    slug: 'motor-grader',
    name: 'Motor Grader',
    categorySlug: 'graders',
    make: '[CONFIRM: e.g. Caterpillar / Komatsu / XCMG]',
    model: '[CONFIRM: e.g. 140K / GD555]',
    capacity: '[CONFIRM: e.g. 140–190 hp, 3.7 m moldboard blade]',
    operatingWeight: undefined,
    attachmentSize: undefined,
    enginePower: undefined,
    availability: 'available',
    featured: true,
    _status: 'draft',
    heroImage: {
      url: '/media/equip-grader.jpg',
      alt: 'Motor grader shaping road camber',
      caption: 'Motor grader with 3.7 m moldboard blade and operator.',
    },
    gallery: [
      {
        url: '/media/equip-grader.jpg',
        alt: 'Motor grader shaping road formation and side drains',
        caption: 'Motor grader cutting road camber and V-drains in Meru County.',
      },
    ],
    uses: [
      {
        title: 'Road formation and camber grading',
        description: 'Cutting and reshaping access roads and feeder roads to true cross-falls.',
      },
      {
        title: 'Murram spreading and sub-base trimming',
        description: 'Spreading murram and crushed stone in even lifts prior to roller compaction.',
      },
      {
        title: 'Side drains and mitre drains',
        description: 'Cutting clean trapezoidal and V-section storm-water drains along road reserves.',
      },
    ],
    hireTerms: defaultHireTerms,
  },
  {
    slug: 'vibratory-roller',
    name: 'Single-Drum Vibratory Roller',
    categorySlug: 'rollers',
    make: '[CONFIRM: e.g. Hamm / Dynapac / Bomag / Caterpillar]',
    model: '[CONFIRM: e.g. 3410 / CA250]',
    capacity: '[CONFIRM: e.g. 10–12 tonne smooth drum]',
    operatingWeight: undefined,
    attachmentSize: undefined,
    enginePower: undefined,
    availability: 'available',
    featured: true,
    _status: 'draft',
    heroImage: {
      url: '/media/equip-roller.jpg',
      alt: 'Single-drum vibratory roller compacting murram road base',
      caption: 'Single-drum vibratory roller with operator.',
    },
    gallery: [
      {
        url: '/media/equip-roller.jpg',
        alt: 'Single-drum vibratory roller on cabro sub-base',
        caption: 'Vibratory roller compacting road and compound sub-base layers.',
      },
    ],
    uses: [
      {
        title: 'Subgrade and murram road compaction',
        description: 'High-amplitude vibratory compaction of watered murram and gravel layers.',
      },
      {
        title: 'Commercial compound and parking sub-bases',
        description: 'Compacting hardcore and crusher-run bases before cabro paving or concrete.',
      },
      {
        title: 'Road embankment and trench backfill compaction',
        description: 'Compacting fill lifts and trench reinstatements to prevent post-construction settlement.',
      },
    ],
    hireTerms: defaultHireTerms,
  },
  {
    slug: 'crawler-bulldozer',
    name: 'Crawler Bulldozer',
    categorySlug: 'bulldozers',
    make: '[CONFIRM: e.g. Caterpillar / Komatsu / Shantui]',
    model: '[CONFIRM: e.g. D6R / D65]',
    capacity: '[CONFIRM: e.g. 18–22 tonne, semi-U blade with ripper]',
    operatingWeight: undefined,
    attachmentSize: undefined,
    enginePower: undefined,
    availability: 'available',
    featured: false,
    _status: 'draft',
    heroImage: {
      url: '/media/equip-bulldozer.jpg',
      alt: 'Crawler bulldozer with semi-U blade and rear ripper',
      caption: 'Crawler bulldozer for bush clearing, ripping and bulk earthworks.',
    },
    gallery: [
      {
        url: '/media/equip-bulldozer.jpg',
        alt: 'Crawler bulldozer clearing land and pushing earthworks',
        caption: 'Crawler bulldozer clearing land and performing cut-and-fill earthworks.',
      },
    ],
    uses: [
      {
        title: 'Bush clearing and corridor opening',
        description: 'Clearing trees, stumps and boulders for new roads, farms and estates.',
      },
      {
        title: 'Bulk cut-and-fill and ripping',
        description: 'Ripping weathered rock and pushing bulk soil to level sloping sites.',
      },
      {
        title: 'Dam embankment pushing and site leveling',
        description: 'Excavating and compacting farm dam walls, water pans and terracing sloping terrain.',
      },
    ],
    hireTerms: defaultHireTerms,
  },
]

export const equipmentIndexSeed = {
  hireTerms: [
    {
      term: 'Operator',
      value: 'Included with every machine',
    },
    {
      term: 'Fuel',
      value: 'Dry rate (client supplies diesel) or wet rate option',
    },
    {
      term: 'Transport',
      value: 'Low-loader delivery quoted by distance',
    },
    {
      term: 'Service area',
      value: 'Meru County and surrounding counties; nationwide by arrangement',
    },
    {
      term: 'Minimum hire',
      value: '1 full day (8 machine working hours)',
    },
    {
      term: 'Rates',
      value: 'Quoted per job',
    },
  ],
  faqs: [
    {
      question: 'Do your machines come with an operator?',
      answer:
        'Yes. Every excavator, grader, roller and bulldozer is hired with our own trained, experienced operator who knows the machine and conducts daily pre-shift checks. We do not hire out bare machines without our operators.',
    },
    {
      question: 'Is fuel included in the hire rate (wet vs dry rate)?',
      answer:
        'We can quote either a dry rate (machine and operator, where you supply clean diesel on site) or a wet rate (inclusive of fuel) depending on how your project is set up. Our quotation states clearly which basis is priced.',
    },
    {
      question: 'How does the machine get to my site?',
      answer:
        'We arrange low-loader transport from our yard to your site and back. Mobilisation and demobilisation are itemised separately on your quote based on the distance and road access.',
    },
    {
      question: 'What is the minimum hire period?',
      answer:
        'Our standard minimum hire is one full day (8 machine working hours). For multi-week road or site works we offer discounted weekly or monthly terms.',
    },
    {
      question: 'What happens if a machine has a mechanical issue during hire?',
      answer:
        'Our mechanics maintain our fleet directly. Logged working hours exclude any mechanical downtime on our side, and we dispatch our service team promptly to keep your job moving.',
    },
  ],
}

export const teamSeed: TeamRecord = {
  slug: 'newton-muthee',
  name: 'Newton M. Muthee',
  role: 'Managing Director',
  summary:
    "Newton leads Shena Works Limited's road, building and equipment operations from Meru and Nairobi, combining public-sector road inspection experience with hands-on hospitality and commercial site management.",
  portrait: {
    url: '/media/newton-portrait.jpg',
    alt: 'Newton M. Muthee, Managing Director of Shena Works Limited',
    caption: 'Newton M. Muthee, Managing Director, Shena Works Limited.',
  },
  phone: '+254718971896',
  email: 'shenaworksltd@gmail.com',
  bio: [
    'Newton M. Muthee is the Managing Director of Shena Works Limited, where he oversees road construction, earthworks, commercial and residential building works, and heavy plant operations across Meru, Nairobi and the wider region.',
    'Before founding Shena Works, Newton worked on both sides of the construction table — as a site manager delivering commercial and hospitality builds and as a public-sector roads inspector checking contractor compliance. From February 2020 to February 2021 he served as Site Project Manager for Dukes Limited in Meru County, supervising the workforce, materials, subcontractors and quality control on hospitality developments including Dukes Cottages, Restaurant & Garden. From February 2021 to January 2022 he worked as a Roads Inspector with the Kenya Urban Roads Authority (KURA), inspecting urban road construction, drainage structures, grading and asphalt works against KURA engineering and safety standards.',
    'On every Shena Works project, Newton remains closely involved from initial site inspection and estimating through to final compaction, snagging and handover.',
  ],
  experience: [
    {
      period: 'September 2024 – Present',
      role: 'Managing Director',
      organisation: 'Shena Works Limited',
      location: 'Meru & Nairobi',
      summary:
        'Directs road and building construction projects, client relations, estimating, procurement and heavy equipment fleet operations across Meru and Nairobi.',
    },
    {
      period: 'February 2021 – January 2022',
      role: 'Roads Inspector',
      organisation: 'Kenya Urban Roads Authority (KURA)',
      location: 'Kenya',
      summary:
        'Inspected road construction, grading, drainage structures, culvert installations and asphalt works for compliance with KURA specifications, road-reserve bylaws and site safety rules.',
    },
    {
      period: 'February 2020 – February 2021',
      role: 'Site Project Manager',
      organisation: 'Dukes Limited',
      location: 'Meru County',
      summary:
        'Supervised site execution, trade scheduling, material inventories and quality standards for hospitality developments in Meru County, including Dukes Cottages, Restaurant & Garden.',
    },
  ],
  areasOfWork: [
    {
      term: 'Roads',
      value: 'Grading, drainage, cabro and tarmac works; road inspection',
    },
    {
      term: 'Buildings',
      value: 'Hospitality and commercial site management',
    },
    {
      term: 'Commercial',
      value: 'Estimating, bills of quantities review and cost control',
    },
    {
      term: 'Compliance',
      value: 'Site safety and environmental requirements; data protection governance',
    },
  ],
}

export const credentialsSeed: CredentialRecord[] = [
  {
    id: 'cred-1',
    name: 'Certificate of Incorporation',
    issuer: 'Registrar of Companies (BRS Kenya)',
    number: 'Pending upload',
    category: 'Limited Company',
    validUntil: '2099-12-31',
    order: 1,
    _status: 'draft',
  },
  {
    id: 'cred-2',
    name: 'National Construction Authority — Road Works',
    issuer: 'National Construction Authority (NCA)',
    number: 'Pending upload',
    category: 'Road Works',
    validUntil: '2027-12-31',
    order: 2,
    _status: 'draft',
  },
  {
    id: 'cred-3',
    name: 'National Construction Authority — Building Works',
    issuer: 'National Construction Authority (NCA)',
    number: 'Pending upload',
    category: 'Building Works',
    validUntil: '2027-12-31',
    order: 3,
    _status: 'draft',
  },
]

export const testimonialsSeed: TestimonialRecord[] = [
  {
    id: 'test-1',
    person: 'Charles Imunde',
    title: 'Director',
    organisation: 'The Pin Hideout',
    projectSlug: 'the-pin-hideout',
    serviceSlugs: ['road-construction-and-earthworks', 'cabro-paving'],
    isPublicOfficial: false,
    date: '2024-10',
    quote:
      'From the initial consultation to the final handover, Shena Works demonstrated professionalism throughout. The team delivered our project with close attention to detail, and the quality of the construction and paving has stood up well to daily use.',
    _status: 'draft',
  },
  {
    id: 'test-2',
    person: 'Eng. Silas M. Kinoti, EBS',
    title: 'Director General',
    organisation: 'Kenya Urban Roads Authority (KURA)',
    serviceSlugs: ['road-construction-and-earthworks'],
    isPublicOfficial: true,
    date: '2022-01',
    quote:
      'Shena Works has proven to be a professional and reliable firm, delivering quality work with technical competence and efficiency. Their commitment to high standards, proper project management, and timely execution makes them a dependable partner in infrastructure development.',
    _status: 'draft',
  },
]

export const locationsSeed: LocationRecord[] = [
  {
    slug: 'meru',
    town: 'Meru',
    county: 'Meru County',
    _status: 'published',
    primaryKeyword: 'road construction Meru',
    metaTitle: 'Road and Building Contractors in Meru | Shena Works',
    metaDescription:
      "Shena Works Limited's Meru headquarters and plant yard. Road construction, cabro paving, building construction and excavator/grader hire across Meru County.",
    heroHeadline: 'Road and building contractors in Meru',
    heroLead:
      'Meru is our home base and plant yard. We grade and pave roads, build hospitality, commercial and residential projects, and hire out excavators, graders and rollers across Meru County and Mount Kenya East.',
    heroImage: {
      url: '/media/cta-site.jpg',
      alt: 'Shena Works plant yard and road construction operations in Meru County',
      caption: 'Shena Works headquarters and heavy equipment yard in Meru County.',
    },
    address: 'Meru Town, Meru County, Kenya',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Meru+Town+Kenya',
    mapEmbedUrl: 'https://www.google.com/maps?q=Meru,Kenya&output=embed',
    phone: '+254 718 971 896',
    email: 'shenaworksltd@gmail.com',
    hours: 'Monday – Friday 8:00 am – 5:00 pm, Saturday 8:00 am – 1:00 pm',
    intro: [
      'Working in Meru County means building for steep volcanic slopes, heavy seasonal rainfall, red loam and pockets of black cotton soil. Because our yard, team and heavy plant are based right here in Meru, we can visit your plot quickly, mobilise excavators, graders and rollers without long-haul transport delays, and supervise work on site every day.',
      'We work across Imenti North, Imenti South, Imenti Central, Tigania, Igembe, Buuri and neighbouring counties (Tharaka-Nithi, Isiolo, Laikipia, Nyeri and Embu).',
    ],
    faqs: [
      {
        question: 'How quickly can you visit a site in Meru County for a quote?',
        answer:
          'For sites within Meru town, Makutano, Nkubu, Maua, Timau and surrounding areas, we can usually arrange a site visit within two to three working days of your call.',
      },
      {
        question: 'Do you keep your excavators, graders and rollers in Meru?',
        answer:
          'Yes. Our primary plant yard is in Meru, which keeps low-loader mobilisation costs down for road, earthworks and plant-hire jobs in the region.',
      },
      {
        question: 'Can we visit your Meru office or see completed projects nearby?',
        answer:
          'Yes. Call or WhatsApp us on +254 718 971 896 to book a time at our office or arrange a visit to a completed reference site in Meru such as The Black Perch Lounge or The Pin Hideout.',
      },
    ],
  },
  {
    slug: 'nairobi',
    town: 'Nairobi',
    county: 'Nairobi County',
    _status: 'draft',
    primaryKeyword: 'contractors Nairobi',
    metaTitle: 'Building and Road Contractors in Nairobi | Shena Works',
    metaDescription:
      "Shena Works Limited's Nairobi office: commercial and residential building construction, cabro paving, interior fit-outs, civil works and plant hire.",
    heroHeadline: 'Building, paving and civil contractors in Nairobi',
    heroLead:
      'From our Nairobi office we handle residential and commercial building construction, cabro compounds, interior fit-outs, road works and project management across Nairobi, Kiambu, Machakos and Kajiado.',
    heroImage: {
      url: '/media/cta-site.jpg',
      alt: 'Shena Works building and civil engineering operations in Nairobi',
      caption: 'Commercial and residential construction across Nairobi and surrounding counties.',
    },
    address: 'Nairobi, Kenya',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Nairobi+Kenya',
    phone: '+254 718 971 896',
    email: 'shenaworksltd@gmail.com',
    hours: 'Monday – Friday 8:00 am – 5:00 pm',
    intro: [
      'Our Nairobi office serves commercial clients, property developers and homeowners across Nairobi and the surrounding metropolitan counties, as well as Nairobi-based clients who are developing land or hospitality projects in Meru and Mount Kenya.',
    ],
    faqs: [
      {
        question: 'Which areas around Nairobi do you cover?',
        answer:
          'We work across Nairobi County as well as Kiambu, Machakos and Kajiado for building construction, cabro paving, drainage works, interior fit-outs and project management.',
      },
      {
        question: 'Can I meet you in Nairobi to plan a project being built in Meru?',
        answer:
          'Yes. Many of our clients live or work in Nairobi while building homes, cottages or commercial premises in Meru County. We can review drawings and contracts in Nairobi and supervise the build from our Meru base.',
      },
    ],
  },
]

export const postCategoriesSeed: PostCategoryRecord[] = [
  { slug: 'roads-and-paving', name: 'Roads and paving' },
  { slug: 'equipment', name: 'Equipment' },
  { slug: 'building', name: 'Building' },
  { slug: 'planning-and-costs', name: 'Planning and costs' },
]

export const postsSeed: PostRecord[] = [
  {
    slug: 'cabro-paving-cost-kenya',
    title: 'Cabro paving in Kenya: what actually drives the cost per square metre',
    categorySlug: 'roads-and-paving',
    relatedServiceSlug: 'cabro-paving',
    excerpt:
      'Why two per-square-metre cabro quotes can differ by 40%, and how sub-base compaction, kerbs and storm drainage determine whether paving stays level.',
    publishedAt: '2026-10-15',
    readingTimeMinutes: 5,
    authorSlug: 'newton-muthee',
    coverImage: {
      url: '/media/service-cabro.jpg',
      alt: 'Cabro paving blocks being laid over compacted sub-base and quarry dust',
      caption: 'Screeding quarry dust and laying 80 mm herringbone cabro blocks over compacted sub-base.',
    },
    sections: [
      {
        heading: 'Why two "per m²" cabro quotes can differ by 40%',
        paragraphs: [
          'When comparing cabro paving quotes, the concrete block itself is only one part of the bill. The difference between a driveway or compound that stays flat for years and one that ruts in the first heavy rains lies underground in the excavation depth, sub-base thickness and edge restraint.',
          'A low per-square-metre rate almost always leaves something out: shallow scraping instead of removing weak topsoil, uncompacted hardcore, thin quarry dust bedding, or missing kerbs and channels.',
        ],
      },
      {
        heading: 'Ground excavation and black cotton replacement',
        paragraphs: [
          'On firm red volcanic soils common around upper Meru, formation excavation is straightforward once topsoil and vegetation are cleared. On dark clay or black cotton soil pockets, shallow skimming does not work because the clay swells when wet and shrinks in dry months.',
          'Where weak clay exists, we cut down to firm ground or backfill with imported murram or crushed rock fill before placing the sub-base. Skipping that step turns the paving wavy within a single wet season.',
        ],
      },
      {
        heading: 'Sub-base thickness and roller compaction',
        paragraphs: [
          'Hardcore, graded crushed stone (crusher run) or good murram sub-base needs controlled watering and vibration compaction in layers rather than tipping a thick heap and rolling the surface once. Compaction with a vibrating roller locks the stone matrix together before any bedding sand or quarry dust goes down.',
          'Quarry dust should only be a tight 25 mm to 40 mm levelling screed under the blocks. Using thick layers of quarry dust to compensate for an uneven sub-base leads to wheel depressions where vehicles brake or turn.',
        ],
      },
      {
        heading: '60 mm vs 80 mm blocks, colours and patterns',
        paragraphs: [
          'Use 60 mm interlocking concrete blocks for domestic driveways, residential courtyards, walkways and light car parking. Specify 80 mm heavy-duty blocks where delivery lorries, water bowsers, coaches or fuel tankers will travel and steer.',
          'Uniform grey blocks usually cost less per square metre than full-body pigmented red or charcoal mixes, while herringbone laying patterns lock more firmly under turning wheels than running-bond courses.',
        ],
      },
      {
        heading: 'Kerbs, channels and storm drainage',
        paragraphs: [
          'Cabro relies on lateral restraint to stay tight. Concrete road kerbs or flush concrete haunching hold the perimeter blocks from creeping outward when vehicles pass near the edge.',
          'Storm water must also be directed along falls to catchpits, concrete channels or roadside drains so surface runoff does not undermine the bedding layer.',
        ],
      },
      {
        heading: 'Checklist before you accept a cabro quote',
        paragraphs: [
          'Ask every contractor to state the assumed excavation depth, whether spoil cart-away is included, sub-base material and compacted thickness, block strength and thickness (60 mm or 80 mm), linear metres of kerbs included, and how storm water leaves the yard.',
          'Send us your approximate compound area and what vehicles will use it. We will inspect the soil on site and put every layer clearly in writing.',
        ],
      },
    ],
    _status: 'published',
  },
  {
    slug: 'murram-gravel-cabro-or-tarmac-access-road',
    title: 'Murram, cabro or tarmac: choosing the right surface for an access road',
    categorySlug: 'roads-and-paving',
    relatedServiceSlug: 'road-construction-and-earthworks',
    excerpt:
      'Matching road surfacing to slope, traffic and rainfall across Meru and central Kenya, and why drainage matters more than the top layer.',
    publishedAt: '2026-10-20',
    readingTimeMinutes: 4,
    authorSlug: 'newton-muthee',
    coverImage: {
      url: '/media/service-roads.jpg',
      alt: 'Comparison of graded murram, cabro and tarmac access roads',
      caption: 'Selecting between graded murram, cabro blocks and tarmac for slope and traffic.',
    },
    sections: [
      {
        heading: 'Match the surface to the slope, the traffic and the rain',
        paragraphs: [
          'Choosing between murram, cabro and tarmac depends on gradient, traffic and budget. There is no single right answer, which is why we inspect the site first and, if you want to compare, price more than one option.',
        ],
      },
      {
        heading: 'When graded murram is enough',
        paragraphs: [
          'Well-compacted murram with proper side drains and culverts works well for farm and rural access roads on moderate slopes. The words that matter are compacted and drained: murram that is only spread, not compacted, will not hold up under rain and traffic.',
        ],
      },
      {
        heading: 'Where cabro beats murram',
        paragraphs: [
          'Steep sections, commercial yards, lounges and estate roads carry less maintenance over time when they are paved with 60 mm or 80 mm cabro blocks, or with tarmac.',
          'Use 60 mm blocks for domestic driveways, footpaths and car parking. Use 80 mm heavy-duty interlocking blocks over a compacted crusher-run or stabilised sub-base where delivery trucks, tankers or buses will turn and park.',
        ],
      },
      {
        heading: 'When tarmac or surface dressing pays back',
        paragraphs: [
          'Tarmac suits urban and feeder roads: a prime coat, a tack coat and an asphalt concrete wearing course, or surface dressing with chippings and bitumen. A good surface needs a layer build-up beneath it that matches the traffic it will carry.',
        ],
      },
      {
        heading: 'Drainage matters more than the top layer',
        paragraphs: [
          'Water is what destroys roads in Meru and central Kenya. Without side drains, mitre drains and culverts sized for heavy rain, runoff cuts channels through murram and washes out the bedding under cabro or tarmac. Whichever surface you choose, check where storm water enters and leaves the road before you check anything else.',
          'If you are comparing options for your own access road, send us the location, the approximate length and what the road needs to carry. We will tell you what we would build and why.',
        ],
      },
    ],
    _status: 'published',
  },
  {
    slug: 'hiring-an-excavator-in-meru-what-to-ask',
    title: 'Hiring an excavator in Meru: 7 questions to ask before the machine leaves the yard',
    categorySlug: 'equipment',
    relatedServiceSlug: 'road-construction-and-earthworks',
    excerpt:
      'Bucket size, wet vs dry hire rates, low-loader transport, operator experience and daily hour logs explained for Meru site owners.',
    publishedAt: '2026-10-25',
    readingTimeMinutes: 5,
    authorSlug: 'newton-muthee',
    coverImage: {
      url: '/media/equip-excavator.jpg',
      alt: 'Crawler excavator loading tipper truck on a Meru construction site',
      caption: 'Confirming machine weight, low-loader access and hire terms before mobilisation.',
    },
    sections: [
      {
        heading: '1. Match machine tonnage and bucket width to the work',
        paragraphs: [
          'A 20-tonne excavator moves bulk earth and loads tippers far faster than a compact unit, but on a narrow residential plot with masonry boundary walls it can have no room to slew safely. Before booking, confirm both the trench or foundation width and the turning clearance on site.',
        ],
      },
      {
        heading: '2. Clarify wet rate vs dry rate before quoting compares',
        paragraphs: [
          'A dry rate covers only the machine (and sometimes the operator), leaving diesel, daily greasing and mobilisation to the hirer. A wet rate normally bundles machine, operator and fuel for an agreed number of hours per shift. Make sure every quote states clearly who supplies diesel and at what daily hour minimum.',
        ],
      },
      {
        heading: '3. Check low-loader transport and site gate access',
        paragraphs: [
          'Tracked excavators cannot walk long distances on paved roads and always require a low-loader trailer to mobilise and demobilise. Check bridge weight limits, overhanging trees, power drops and gate widths along the final few hundred metres to your plot before dispatching the trailer.',
        ],
      },
      {
        heading: '4. Ask what operator experience fits your task',
        paragraphs: [
          'Bulk excavation into waiting tippers requires speed and tidy benching, while foundation trenches, septic pits and drainage channels require neat vertical walls at design depth without over-digging concrete volume. Let the yard know what work comes first so the right operator and bucket arrive.',
        ],
      },
      {
        heading: '5. Agree how daily machine hours and stand-by time are logged',
        paragraphs: [
          'Every shift should be signed off daily by the site supervisor against the machine hour meter or shift sheet, noting active digging hours separately from weather delays or waiting-for-fuel stoppages. Clear sign-offs prevent end-of-job disputes.',
        ],
      },
      {
        heading: '6 & 7. Confirm attachment needs and breakdown cover',
        paragraphs: [
          'If your site sits on hard volcanic rock or murram pan, a standard digging bucket alone will burn hours and wear teeth; check whether a hydraulic rock breaker attachment is available if rock is struck. Finally, confirm who pays stand-down charges if a hydraulic hose bursts and how quickly a field mechanic can reach the site.',
        ],
      },
    ],
    _status: 'published',
  },
  {
    slug: 'what-a-motor-grader-does-on-a-road-job',
    title: "What a motor grader actually does on a road job (and why a tractor blade isn't the same)",
    categorySlug: 'equipment',
    relatedServiceSlug: 'road-construction-and-earthworks',
    excerpt:
      'How wheelbase length and moldboard articulation create true road camber, V-drains and uniform murram lifts ready for compaction.',
    publishedAt: '2026-10-28',
    readingTimeMinutes: 5,
    authorSlug: 'newton-muthee',
    coverImage: {
      url: '/media/equip-grader.jpg',
      alt: 'Motor grader blade cutting road camber and side drain',
      caption: 'Long wheelbase frame and articulated moldboard shaping true road cross-fall.',
    },
    sections: [
      {
        heading: 'Wheelbase length, blade articulation and true levels',
        paragraphs: [
          'An agricultural tractor towing a rear grader blade bounces up and down with every bump its rear tyres roll over, copying old corrugations back into the road. A motor grader carries its moldboard suspended midway along a long rigid frame between front steering axles and rear tandem drive axles.',
          'Because the blade sits in the middle of that long wheelbase, high spots are shaved down and hollows fill naturally instead of being mirrored.',
        ],
      },
      {
        heading: 'Cutting the road formation and cross-fall (camber)',
        paragraphs: [
          'A gravel or murram road should never be flat across its width. Flat sections hold puddles that soften the subgrade under every passing axle. The grader tilts its moldboard accurately to cut a 3% to 4% crown from the centreline toward each shoulder so rainwater runs sideways off the carriageway immediately.',
        ],
      },
      {
        heading: 'Shaping V-drains and mitre drains',
        paragraphs: [
          'By rotating the circle and extending the moldboard outward beyond the rear wheels, a grader tilts the blade sharply to cut clean V-shaped roadside drains and turnout mitre drains without driving the heavy tyres into the ditch bottom.',
        ],
      },
      {
        heading: 'Spreading murram in even lifts for the roller',
        paragraphs: [
          'Tipped murram arrives in heaps. A motor grader windrows, mixes moisture through the borrow material and lays uniform 150 mm loose lifts so the vibrating drum roller achieves consistent compaction from edge to edge.',
        ],
      },
      {
        heading: 'Planning daily production realistically',
        paragraphs: [
          'Output on a road job depends on whether the grader is lightly re-profiling existing gravel or performing heavy reshaping, ditch cutting and murram spreading ahead of a roller and water bowser. Matching grader passes to bowser and roller speed keeps the compacted road uniform rather than rushing uncompacted loose dirt ahead.',
        ],
      },
    ],
    _status: 'published',
  },
  {
    slug: 'how-to-read-a-bill-of-quantities-kenya',
    title: 'How to read a Bill of Quantities before you sign a building contract',
    categorySlug: 'planning-and-costs',
    relatedServiceSlug: 'general-construction',
    excerpt:
      'Preliminaries, measured works, provisional sums and prime cost sums explained so you can compare contractor quotes line by line.',
    publishedAt: '2026-11-01',
    readingTimeMinutes: 6,
    authorSlug: 'newton-muthee',
    coverImage: {
      url: '/media/service-pm.jpg',
      alt: 'Construction drawings and Bill of Quantities review on site',
      caption: 'Checking measured quantities, preliminaries and provisional sums before signing.',
    },
    sections: [
      {
        heading: 'What a BoQ is and why lump-sum quotes hide risk',
        paragraphs: [
          'A lump-sum total gives no breakdown of what concrete grade, steel tonnage, block thickness or sanitary fittings are actually priced. If two contractors submit totals 20% apart, only an itemised Bill of Quantities (BoQ) reveals whether one price is genuinely leaner or simply left out foundation depth, external drainage or finishes.',
        ],
      },
      {
        heading: 'Preliminaries and preambles explained',
        paragraphs: [
          'Preliminaries cover site setup that does not turn into bricks and mortar: temporary site office, water and power connections, hoarding, site supervision, scaffolding, insurance and statutory compliance. Review this section carefully so you know which running costs rest with the contractor and which belong to the employer.',
        ],
      },
      {
        heading: 'Measured works: checking quantities against your drawings',
        paragraphs: [
          'Measured trade sections break substructures, superstructures, roofing, finishes and MEP into clear units — cubic metres of concrete, kilograms of reinforcement, square metres of walling and tiling. Check major items against the approved architectural and structural drawings before awarding.',
        ],
      },
      {
        heading: 'Provisional sums and Prime Cost (PC) sums — where budgets blow up',
        paragraphs: [
          'A Provisional Sum is a placeholder allowance for work whose full scope is not yet finalised (such as uncertain rock excavation, borehole power tie-in or external landscaping). A Prime Cost (PC) sum sets an allowance for owner-selected items like kitchen cabinetry, specialist tiles or imported light fittings.',
          'If those allowances are plugged in unrealistically low to make the tender look cheap, real costs climb sharply once you pick actual materials on site.',
        ],
      },
      {
        heading: 'Using the BoQ to value stage payments on site',
        paragraphs: [
          'During construction, an itemised BoQ provides an objective measure for interim valuations: payments match percentages of completed, inspected work rather than vague calendar milestones.',
        ],
      },
    ],
    _status: 'published',
  },
  {
    slug: 'what-nca-categories-mean-when-choosing-a-contractor',
    title: 'What NCA categories and classes mean when you choose a contractor in Kenya',
    categorySlug: 'planning-and-costs',
    relatedServiceSlug: 'general-construction',
    excerpt:
      'Understanding NCA 1 to NCA 8 contract value limits, road vs building classes, and why checking an active practising licence matters.',
    publishedAt: '2026-11-04',
    readingTimeMinutes: 5,
    authorSlug: 'newton-muthee',
    coverImage: {
      url: '/media/statement-keys.jpg',
      alt: 'NCA compliance and site safety board on a Kenyan building project',
      caption: 'Verifying NCA work classes and active annual practising licences before contract award.',
    },
    sections: [
      {
        heading: 'Building works vs road works vs specialist classes',
        paragraphs: [
          'Under the National Construction Authority (NCA), contractors are registered separately by class of work. Building Works covers residential, commercial and institutional structures; Civil / Road Works covers highways, access roads, drainage, bridges and earthworks; Specialist classes cover electrical, mechanical and plumbing trades.',
          'A contractor registered only for Building Works is not automatically registered for Civil / Road Works, so check that the certificate matches the primary scope of your project.',
        ],
      },
      {
        heading: 'Categories NCA 1 to NCA 8 and contract value limits',
        paragraphs: [
          'Within each class, NCA assigns a category from NCA 1 down to NCA 8 based on a contractor’s financial standing, audited accounts, plant and technical capacity. NCA 1 carries an unlimited contract value ceiling, whereas NCA 2 through NCA 8 step down progressively in maximum single-contract value.',
          'Confirming the category ensures the contractor is legally permitted to sign and insure a contract of your project size.',
        ],
      },
      {
        heading: "Checking a contractor's current Annual Practising Licence",
        paragraphs: [
          'A registration certificate proves past admission, while the Annual Practising Licence confirms the contractor is active and in good standing for the current calendar year. Always ask to inspect the active licence rather than an expired certificate.',
        ],
      },
      {
        heading: 'Why project registration with NCA protects the owner',
        paragraphs: [
          'Beyond contractor registration, qualifying construction projects must be registered with NCA prior to commencement alongside county building approvals and NEMA clearance where applicable. Proper project registration reinforces site safety compliance, quality audits and clean documentation through to occupation.',
        ],
      },
    ],
    _status: 'published',
  },
  {
    slug: 'why-roads-fail-without-drainage',
    title: 'Why Kenyan roads fail without drainage: side drains, mitre drains and culverts explained',
    categorySlug: 'roads-and-paving',
    relatedServiceSlug: 'road-construction-and-earthworks',
    excerpt:
      'How storm runoff weakens road subgrades on Meru slopes, and how camber, side drains, mitre drains and 600–900 mm pipe culverts protect the surface.',
    publishedAt: '2026-11-07',
    readingTimeMinutes: 6,
    authorSlug: 'newton-muthee',
    coverImage: {
      url: '/media/statement-machines.jpg',
      alt: 'Precast concrete culvert headwall and trapezoidal side drain on a Meru road',
      caption: 'Road camber, lined side drains, mitre drains and concrete pipe culverts working together.',
    },
    sections: [
      {
        heading: 'How water weakens subgrade and washes out murram',
        paragraphs: [
          'Most access roads do not fail because vehicles are too heavy for the top layer — they fail because rainwater saturates the soil underneath. Once clay or red volcanic subgrade softens with trapped moisture, tyre loads punch down into ruts and potholes within weeks.',
          'On sloped approaches around Meru, fast surface water flowing down wheel tracks strips out uncompacted murram gravel faster than traffic wears it away.',
        ],
      },
      {
        heading: 'Camber (cross-fall): getting water off the running surface',
        paragraphs: [
          'Every graded gravel or paved road needs a deliberate cross-fall away from its crown (or a single cross-slope into an inside drain on hillside cuts). Getting runoff sideways off the road within a couple of metres keeps longitudinal gullies from forming down the middle of the track.',
        ],
      },
      {
        heading: 'Side drains, mitre drains and scour checks on Meru slopes',
        paragraphs: [
          'Side drains collect water shed by the road shoulders and uphill verges, while mitre (turnout) drains cut into the adjacent bush or stormwater swales every few dozen metres empty that ditch before volume builds up.',
          'On steeper gradients, stone or concrete scour checks stepped down the invert slow water speed so earth ditches do not erode into deep ravines.',
        ],
      },
      {
        heading: 'Sizing pipe culverts (600 mm vs 900 mm) and headwalls',
        paragraphs: [
          'Where natural watercourses or full roadside ditches must cross beneath the carriage, concrete pipe culverts (commonly 600 mm or 900 mm internal diameter, bedded and surrounded cleanly with concrete) carry storm flows safely underground. Reinforced masonry or concrete headwalls and wingwalls at both inlet and outlet prevent water from bypassing around the pipe barrel.',
        ],
      },
      {
        heading: 'Simple maintenance after the rains',
        paragraphs: [
          'Before and immediately after the long and short rains, clearing silt, leaves and farm debris from culvert inlets and mitre drain outlets keeps drainage open for years at a fraction of the cost of rebuilding washed-out roadbed.',
        ],
      },
    ],
    _status: 'published',
  },
  {
    slug: 'planning-a-hospitality-build-from-drawings-to-handover',
    title: 'Planning a lounge, cottage or hotel build in Meru: from plot to opening night',
    categorySlug: 'building',
    relatedServiceSlug: 'general-construction',
    excerpt:
      'Site zoning, underground drainage, acoustic and lighting coordination, and external cabro sequencing from hospitality builds in Meru.',
    publishedAt: '2026-11-09',
    readingTimeMinutes: 7,
    authorSlug: 'newton-muthee',
    coverImage: {
      url: '/media/project-black-perch.jpg',
      alt: 'Hospitality lounge pavilions and cabro forecourt layout',
      caption: 'Coordinating site zoning, underground services, building works and external paving.',
    },
    sections: [
      {
        heading: 'Site zoning: separating guest arrival, service deliveries and parking',
        paragraphs: [
          'A hospitality plot works smoothly when cars, kitchen deliveries, waste collection and seated guest areas do not fight for the same narrow lane. Before pouring strip foundations, peg out guest parking bays, turning circles, delivery access to stores and quiet outdoor terraces together on the ground.',
        ],
      },
      {
        heading: 'Getting drainage, power, water storage and waste right underground first',
        paragraphs: [
          'Kitchens, washrooms and paved courtyards demand far higher water storage, grease-trap sizing, storm runoff capacity and three-phase power ducting than a typical home. Laying sewer lines, stormwater drains, water tank bases and electrical sleeves in the right sequence prevents breaking freshly laid concrete or cabro later.',
        ],
      },
      {
        heading: 'Coordinating building structure with interior lighting and acoustics',
        paragraphs: [
          'In lounges and dining spaces, ambiance comes from first-fix discipline: concealing conduit runs for layered warm lighting, planning bar back-wall plumbing, and controlling reverberation across tiled floors and roofed gazebos before painting and joinery start.',
        ],
      },
      {
        heading: 'Sequencing external cabro and landscaping',
        paragraphs: [
          'Heavy material tippers and scaffolding tear up finished drives if external paving goes down too early. Leave final quarry-dust screeding and cabro laying until heavy structural masonry, plastering and roof works are out of the way, right after kerbs and storm catchpits are cured.',
        ],
      },
      {
        heading: 'Lessons from The Black Perch Lounge and Dukes Cottages',
        paragraphs: [
          'Across hospitality sites we have built — including The Black Perch Lounge in Meru (site clearance, cabro forecourt, open-air pavilions and perimeter lighting delivered by Shena Works) and earlier work at Dukes Cottages (delivered by Dukes Limited with Newton Muthee serving as Site Project Manager in 2020–2021) — clear setting-out of outdoor seating, parking circulation and drainage proved just as decisive for opening week as interior finishes.',
        ],
      },
    ],
    _status: 'published',
  },
]

export const legalPagesSeed: LegalPageRecord[] = [
  {
    slug: 'privacy',
    title: 'Privacy notice',
    lastUpdated: '10 November 2026',
    metaTitle: 'Privacy Notice | Shena Works',
    metaDescription:
      "How Shena Works Limited collects, uses and protects personal data under Kenya's Data Protection Act, 2019.",
    sections: [
      {
        heading: '1. Who we are (Data Controller)',
        paragraphs: [
          'This website (shenaworksltd.com) is operated by Shena Works Limited ("we", "us", "our"), a company registered in Kenya with offices in Meru and Nairobi, Kenya. For the purposes of Kenya\'s Data Protection Act, 2019, Shena Works Limited is the data controller of the personal data collected through this website.',
        ],
        bullets: [
          'Email: shenaworksltd@gmail.com',
          'Telephone: +254 718 971 896',
          'Physical address: Meru Town, Meru County, Kenya',
        ],
      },
      {
        heading: '2. Personal data we collect',
        paragraphs: [
          'We collect only the personal data you choose to give us or that is needed to run and secure this website:',
        ],
        bullets: [
          'Enquiry and quote details: your name, phone number, email address (if provided), company or organisation name, site location, project or equipment hire details, budget band, timeline, and any drawings, Bills of Quantities or photographs you attach when you submit a form on our site.',
          'Direct communications: records of phone calls, emails or WhatsApp messages when you contact us using the links on this site.',
          'Technical and security data: your IP address, browser type, device type, pages visited and Cloudflare Turnstile anti-spam verification tokens.',
          'Analytics data (only with your consent): anonymised page views and interaction events (such as button clicks) collected via Google Analytics 4 if you click "Accept analytics" on our cookie banner.',
        ],
      },
      {
        heading: '3. Why we use your data and our lawful basis',
        paragraphs: [
          'Under Section 30 of the Data Protection Act, 2019, we process your personal data on the following lawful bases:',
        ],
        bullets: [
          'To take steps at your request before entering into a contract (and to perform a contract): reviewing your site requirements, preparing a construction quotation or equipment-hire quote, calling or messaging you back, and delivering our services.',
          'Your consent: when you tick the consent box on our enquiry form, or when you accept analytics cookies or load an embedded Google Map. You may withdraw consent at any time.',
          'Legitimate interests: protecting our website and forms from spam, abuse and security threats, and maintaining internal records of business enquiries.',
          'Legal obligations: keeping accounting, tax and contractual records required under Kenyan law.',
        ],
      },
      {
        heading: '4. Who we share your data with',
        paragraphs: [
          'We never sell your personal data. We share data only with trusted service providers (data processors) that help us run this website and respond to you, under strict confidentiality and data protection terms:',
        ],
        bullets: [
          'Hosting, database and content delivery: Vercel (application hosting), Neon (NeonDB) (managed PostgreSQL database hosting), and Cloudflare (CDN, DDoS protection, R2 media storage and Turnstile spam protection).',
          'Transactional email: Resend, to deliver your enquiry to our staff and send your confirmation email.',
          'Messaging (if you contact us via WhatsApp): WhatsApp (Meta), when you choose to click a WhatsApp link to chat with us.',
          'Analytics (only if you consent): Google Ireland Limited (Google Analytics 4).',
        ],
      },
      {
        heading: '5. How long we keep your data',
        paragraphs: [],
        bullets: [
          'Unsuccessful or general enquiries: kept for 24 months from our last contact with you so we can follow up if your project restarts, then securely deleted from our database and media storage.',
          'Enquiries that become contracts or projects: kept for 7 years after completion of the contract in line with Kenyan tax and limitation-of-actions laws.',
          'Server and security logs: kept for up to 90 days.',
        ],
      },
      {
        heading: '6. Your rights under the Data Protection Act, 2019',
        paragraphs: [
          'Under Section 26 of the Kenya Data Protection Act, 2019, you have the right to be informed of the use to which your personal data is to be put; access your personal data in our custody; object to the processing of all or part of your personal data; correct false or misleading data; and request deletion of false, misleading or no-longer-needed personal data.',
          'To exercise any of these rights, email shenaworksltd@gmail.com or call +254 718 971 896. We will respond within 30 days. You also have the right to lodge a complaint with the Office of the Data Protection Commissioner (ODPC) at https://www.odpc.go.ke.',
        ],
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie notice',
    lastUpdated: '10 November 2026',
    metaTitle: 'Cookie Notice | Shena Works',
    metaDescription: 'The cookies shenaworksltd.com uses and how to change your choice.',
    sections: [
      {
        heading: '1. How we use cookies',
        paragraphs: [
          'A cookie is a small text file stored on your phone or computer when you visit a website. We keep cookies to a minimum:',
        ],
        bullets: [
          'Essential cookies are always active because the site, spam protection and your cookie preference cannot work without them.',
          'Analytics cookies are off by default and are set only if you click "Accept analytics" on our cookie banner.',
          'Third-party maps (Google Maps on our location and contact pages) are blocked by default until you click "Load map".',
        ],
      },
      {
        heading: '2. Cookies used on this site',
        paragraphs: [],
        table: {
          headers: ['Cookie name', 'Provider', 'Category', 'Purpose', 'Expiry'],
          rows: [
            [
              'sw_consent',
              'shenaworksltd.com',
              'Essential',
              'Remembers whether you chose "Accept analytics" or "Essential only"',
              '12 months',
            ],
            [
              'cf_clearance / Turnstile tokens',
              'Cloudflare',
              'Essential',
              'Protects our enquiry forms against automated spam without tracking you across sites',
              'Session / up to 30 minutes',
            ],
            [
              'payload-token',
              'shenaworksltd.com',
              'Essential (staff only)',
              'Keeps Shena Works staff signed in to the CMS admin panel; never set for normal visitors',
              'Session / 7 days',
            ],
            [
              '_ga, _ga_*',
              'Google Analytics 4',
              'Analytics (consent required)',
              'Counts visits and helps us see which pages and forms are useful; IP addresses are anonymised',
              'Up to 13 months',
            ],
          ],
        },
      },
      {
        heading: '3. Changing your choice',
        paragraphs: [
          'You can change or withdraw your analytics consent at any time using the button below, or via the "Cookie settings" link in the footer of every page. When you switch to "Essential only", we immediately stop sending analytics events and delete existing _ga cookies on our domain.',
        ],
      },
    ],
  },
]
