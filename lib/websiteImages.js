/**
 * Centralized website image assets hosted on Cloudinary
 * Target account folder: gharpadharo-careers/website/
 * 
 * Safe fallback is preserved: if an image path is not in the map,
 * the fallback original path is returned.
 */

export const WEBSITE_IMAGES = {
  // Brand / Shared
  brand: {
    logo: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370929/gharpadharo-careers/website/shared/logo.png",
    aboutProperty: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370932/gharpadharo-careers/website/shared/about-property.jpg",
    careersHeroOffice: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370934/gharpadharo-careers/website/shared/careers-hero-office.jpg",
    careersHero: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370935/gharpadharo-careers/website/shared/careers-hero.jpg",
  },

  // Home Page
  home: {
    heroOfficeTeam: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370937/gharpadharo-careers/website/home/hero-office-team.jpg",
    heroCollaboration: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370939/gharpadharo-careers/website/home/hero-collaboration.jpg",
    officeTeam: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370942/gharpadharo-careers/website/home/office-team.jpg",
    gharpadharoOffice: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370943/gharpadharo-careers/website/home/gharpadharo-office.jpg",
    gharpadharoTeam: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370944/gharpadharo-careers/website/home/gharpadharo-team.jpg",
    gharpadharoTeam2: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370946/gharpadharo-careers/website/home/gharpadharo-team-2.jpg",
  },

  // People / Team Members
  people: {
    dipanshuSandhaki: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370948/gharpadharo-careers/website/people/dipanshu-sandhaki.jpg",
    dipanshuSandhakiAlt: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370950/gharpadharo-careers/website/people/dipanshu-sandhaki-alt.jpg",
    anshikaBisht: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370951/gharpadharo-careers/website/people/anshika-bisht.jpg",
    ricaRai: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370953/gharpadharo-careers/website/people/rica-rai.jpg",
  },

  // Life at GharPadharo Page & Sections
  life: {
    teamGathering: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370954/gharpadharo-careers/website/life-at-gharpadharo/team-gathering.jpg",
    teamWorkspaceWork: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370955/gharpadharo-careers/website/life-at-gharpadharo/team-workspace-work.jpg",
    placeholderCollaboration: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370959/gharpadharo-careers/website/life-at-gharpadharo/placeholder-collaboration.jpg",
    placeholderMountains: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370961/gharpadharo-careers/website/life-at-gharpadharo/placeholder-mountains.jpg",
    placeholderWorkspace: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370962/gharpadharo-careers/website/life-at-gharpadharo/placeholder-workspace.jpg",
    
    // Gallery Slides (for /life-at-gharpadharo carousel)
    galleryTeamGifts: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370964/gharpadharo-careers/website/life-at-gharpadharo/gallery-team-gifts.jpg",
    galleryHavan: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370966/gharpadharo-careers/website/life-at-gharpadharo/gallery-havan.jpg",
    galleryCoworking: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370967/gharpadharo-careers/website/life-at-gharpadharo/gallery-coworking.jpg",
    galleryTeamGathering: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370970/gharpadharo-careers/website/life-at-gharpadharo/gallery-team-gathering.jpg",
    galleryTeamWorking: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370971/gharpadharo-careers/website/life-at-gharpadharo/gallery-team-working.jpg",
    
    // Gallery Assets used in landing page sections
    officeDeskSingle: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370981/gharpadharo-careers/website/life-at-gharpadharo/office-desk-single.jpg",
    officeDeskDuo: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370979/gharpadharo-careers/website/life-at-gharpadharo/office-desk-duo.jpg",
    teamCelebration: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370986/gharpadharo-careers/website/life-at-gharpadharo/team-celebration.jpg",
    teamGroupPhoto: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370988/gharpadharo-careers/website/life-at-gharpadharo/team-group-photo.jpg",
    coworkingColleagues: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370974/gharpadharo-careers/website/life-at-gharpadharo/coworking-colleagues.jpg",
    havanCeremony: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370975/gharpadharo-careers/website/life-at-gharpadharo/havan-ceremony.jpg",
    officeTeam: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370982/gharpadharo-careers/website/life-at-gharpadharo/office-team.jpg",
    officeWorkspace: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370985/gharpadharo-careers/website/life-at-gharpadharo/office-workspace.jpg",
    teamGroup: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370990/gharpadharo-careers/website/life-at-gharpadharo/team-group.jpg",
    teamWorking: "https://res.cloudinary.com/ddhj7zz9q/image/upload/v1791370991/gharpadharo-careers/website/life-at-gharpadharo/team-working.jpg",
  },
};

// Direct mapping from local paths to Cloudinary URLs for seamless backwards compatibility
export const LOCAL_PATH_MAP = {
  "/logo.png": WEBSITE_IMAGES.brand.logo,
  "/images/about/about-property.jpg": WEBSITE_IMAGES.brand.aboutProperty,
  "/images/careers/careers-hero-office.jpg": WEBSITE_IMAGES.brand.careersHeroOffice,
  "/images/careers/careers-hero.jpg": WEBSITE_IMAGES.brand.careersHero,
  "/images/home/hero-office-team.jpg": WEBSITE_IMAGES.home.heroOfficeTeam,
  "/images/home/hero-collaboration.jpg": WEBSITE_IMAGES.home.heroCollaboration,
  "/images/home/office-team.jpg": WEBSITE_IMAGES.home.officeTeam,
  "/images/home/gharpadharo-office.jpg": WEBSITE_IMAGES.home.gharpadharoOffice,
  "/images/home/gharpadharo-team.jpg": WEBSITE_IMAGES.home.gharpadharoTeam,
  "/images/home/gharpadharo-team-2.jpg": WEBSITE_IMAGES.home.gharpadharoTeam2,
  "/images/home/people/dipanshu-sandhaki.jpg": WEBSITE_IMAGES.people.dipanshuSandhaki,
  "/images/home/dipanshu-sandhaki.jpg": WEBSITE_IMAGES.people.dipanshuSandhakiAlt,
  "/images/home/anshika-bisht.jpg": WEBSITE_IMAGES.people.anshikaBisht,
  "/images/home/rica-rai.jpg": WEBSITE_IMAGES.people.ricaRai,
  "/images/life-at-gharpadharo/team-gathering.jpg": WEBSITE_IMAGES.life.teamGathering,
  "/images/life-at-gharpadharo/team-workspace-work.jpg": WEBSITE_IMAGES.life.teamWorkspaceWork,
  "/images/life-at-gharpadharo/placeholder-collaboration.jpg": WEBSITE_IMAGES.life.placeholderCollaboration,
  "/images/life-at-gharpadharo/placeholder-mountains.jpg": WEBSITE_IMAGES.life.placeholderMountains,
  "/images/life-at-gharpadharo/placeholder-workspace.jpg": WEBSITE_IMAGES.life.placeholderWorkspace,
  "/images/life-at-gharpadharo/gallery/gallery-team-gifts.jpg": WEBSITE_IMAGES.life.galleryTeamGifts,
  "/images/life-at-gharpadharo/gallery/gallery-havan.jpg": WEBSITE_IMAGES.life.galleryHavan,
  "/images/life-at-gharpadharo/gallery/gallery-coworking.jpg": WEBSITE_IMAGES.life.galleryCoworking,
  "/images/life-at-gharpadharo/gallery/gallery-team-gathering.jpg": WEBSITE_IMAGES.life.galleryTeamGathering,
  "/images/life-at-gharpadharo/gallery/gallery-team-working.jpg": WEBSITE_IMAGES.life.galleryTeamWorking,
  "/images/life-at-gharpadharo/gallery/coworking-colleagues.jpg": WEBSITE_IMAGES.life.coworkingColleagues,
  "/images/life-at-gharpadharo/gallery/havan-ceremony.jpg": WEBSITE_IMAGES.life.havanCeremony,
  "/images/life-at-gharpadharo/gallery/office-desk-duo.jpg": WEBSITE_IMAGES.life.officeDeskDuo,
  "/images/life-at-gharpadharo/gallery/office-desk-single.jpg": WEBSITE_IMAGES.life.officeDeskSingle,
  "/images/life-at-gharpadharo/gallery/office-team.jpg": WEBSITE_IMAGES.life.officeTeam,
  "/images/life-at-gharpadharo/gallery/office-workspace.jpg": WEBSITE_IMAGES.life.officeWorkspace,
  "/images/life-at-gharpadharo/gallery/team-celebration.jpg": WEBSITE_IMAGES.life.teamCelebration,
  "/images/life-at-gharpadharo/gallery/team-group-photo.jpg": WEBSITE_IMAGES.life.teamGroupPhoto,
  "/images/life-at-gharpadharo/gallery/team-group.jpg": WEBSITE_IMAGES.life.teamGroup,
  "/images/life-at-gharpadharo/gallery/team-working.jpg": WEBSITE_IMAGES.life.teamWorking,
};

/**
 * Returns the Cloudinary URL for a given local path or URL, with fallback.
 * @param {string} pathOrKey
 * @returns {string}
 */
export function getWebsiteImage(pathOrKey) {
  if (!pathOrKey) return "";
  if (LOCAL_PATH_MAP[pathOrKey]) {
    return LOCAL_PATH_MAP[pathOrKey];
  }
  return pathOrKey;
}
