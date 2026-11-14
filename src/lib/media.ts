/**
 * Centralized fallback media manifest matching public/media/*.jpg.
 *
 * Payload CMS uploads (served from R2 media.shenaworksltd.com) automatically override
 * these local fallbacks inside resolveMedia() once client photography is uploaded in /admin.
 */

export const MEDIA_PATHS = {
  heroRoads: '/media/hero-roads.jpg',
  statementMachines: '/media/statement-machines.jpg',
  statementKeys: '/media/statement-keys.jpg',
  whyCrew: '/media/why-crew.jpg',
  ctaSite: '/media/cta-site.jpg',
  newtonPortrait: '/media/newton-portrait.jpg',
  serviceRoads: '/media/service-roads.jpg',
  serviceBuilding: '/media/service-building.jpg',
  serviceCabro: '/media/service-cabro.jpg',
  serviceInterior: '/media/service-interior.jpg',
  servicePm: '/media/service-pm.jpg',
  projectBlackPerch: '/media/project-black-perch.jpg',
  projectPinHideout: '/media/project-pin-hideout.jpg',
  projectDukes: '/media/project-dukes.jpg',
  projectStoneLounge: '/media/project-stone-lounge.jpg',
  projectMeruRoad: '/media/hero-roads.jpg',
  equipExcavator: '/media/equip-excavator.jpg',
  equipExcavatorTrench: '/media/equip-excavator-trench.jpg',
  equipExcavatorLoading: '/media/equip-excavator-loading.jpg',
  equipGrader: '/media/equip-grader.jpg',
  equipRoller: '/media/equip-roller.jpg',
  equipBulldozer: '/media/equip-bulldozer.jpg',
} as const

export const VALID_PUBLIC_MEDIA = new Set<string>(Object.values(MEDIA_PATHS))

export const SERVICE_FALLBACK_MEDIA: Record<string, string> = {
  'road-construction-and-earthworks': MEDIA_PATHS.serviceRoads,
  'cabro-paving': MEDIA_PATHS.serviceCabro,
  'general-construction': MEDIA_PATHS.serviceBuilding,
  'interior-design': MEDIA_PATHS.serviceInterior,
  'project-management': MEDIA_PATHS.servicePm,
  'architecture-and-consultancy': MEDIA_PATHS.servicePm,
  'bills-of-quantities-and-estimating': MEDIA_PATHS.servicePm,
}

export const PROJECT_FALLBACK_MEDIA: Record<string, string> = {
  'the-black-perch-lounge': MEDIA_PATHS.projectBlackPerch,
  'the-pin-hideout': MEDIA_PATHS.projectPinHideout,
  'dukes-cottages-restaurant-and-garden': MEDIA_PATHS.projectDukes,
  'stone-lounge-and-villas': MEDIA_PATHS.projectStoneLounge,
  'the-stone-lounge-and-villas': MEDIA_PATHS.projectStoneLounge,
  'meru-access-road-grading-and-drainage': MEDIA_PATHS.projectMeruRoad,
  'meru-access-road-and-drainage': MEDIA_PATHS.projectMeruRoad,
}

export const EQUIPMENT_FALLBACK_MEDIA: Record<string, string> = {
  excavators: MEDIA_PATHS.equipExcavator,
  'crawler-excavator': MEDIA_PATHS.equipExcavator,
  graders: MEDIA_PATHS.equipGrader,
  'motor-grader': MEDIA_PATHS.equipGrader,
  rollers: MEDIA_PATHS.equipRoller,
  'vibratory-roller': MEDIA_PATHS.equipRoller,
  bulldozers: MEDIA_PATHS.equipBulldozer,
  'crawler-bulldozer': MEDIA_PATHS.equipBulldozer,
}

export const POST_FALLBACK_MEDIA: Record<string, string> = {
  'cabro-paving-cost-kenya': MEDIA_PATHS.serviceCabro,
  'murram-gravel-cabro-or-tarmac-access-road': MEDIA_PATHS.serviceRoads,
  'hiring-an-excavator-in-meru-what-to-ask': MEDIA_PATHS.equipExcavator,
  'what-a-motor-grader-does-on-a-road-job': MEDIA_PATHS.equipGrader,
  'how-to-read-a-bill-of-quantities-kenya': MEDIA_PATHS.servicePm,
  'what-nca-categories-mean-when-choosing-a-contractor': MEDIA_PATHS.statementKeys,
  'why-roads-fail-without-drainage': MEDIA_PATHS.statementMachines,
  'planning-a-hospitality-build-from-drawings-to-handover': MEDIA_PATHS.projectBlackPerch,
}

export const PROJECT_GALLERY_FALLBACKS: Record<string, string[]> = {
  'the-black-perch-lounge': [
    MEDIA_PATHS.projectBlackPerch,
    MEDIA_PATHS.serviceInterior,
    MEDIA_PATHS.serviceCabro,
  ],
  'the-pin-hideout': [
    MEDIA_PATHS.projectPinHideout,
    MEDIA_PATHS.serviceCabro,
    MEDIA_PATHS.equipRoller,
  ],
  'dukes-cottages-restaurant-and-garden': [
    MEDIA_PATHS.projectDukes,
    MEDIA_PATHS.serviceBuilding,
    MEDIA_PATHS.servicePm,
  ],
  'stone-lounge-and-villas': [
    MEDIA_PATHS.projectStoneLounge,
    MEDIA_PATHS.serviceInterior,
    MEDIA_PATHS.serviceBuilding,
  ],
  'meru-access-road-grading-and-drainage': [
    MEDIA_PATHS.heroRoads,
    MEDIA_PATHS.equipExcavator,
    MEDIA_PATHS.equipGrader,
  ],
}

export const EQUIPMENT_GALLERY_FALLBACKS: Record<string, string[]> = {
  'crawler-excavator': [
    MEDIA_PATHS.equipExcavator,
    MEDIA_PATHS.equipExcavatorTrench,
    MEDIA_PATHS.equipExcavatorLoading,
  ],
}

