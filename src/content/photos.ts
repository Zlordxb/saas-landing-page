/**
 * Every photo on the site, in one place: swap a photo by changing its id here.
 * All photos come from Unsplash (free to use under the Unsplash License).
 * The id is the part after "photo-" in an images.unsplash.com address.
 */
export type Photo = {
  id: string;
  alt: string;
  /** Photographer, credited on the site and in the README. */
  credit: string;
  /** CSS object-position, when the important part isn't in the middle. */
  position?: string;
};

export function photoUrl(photo: Photo): string {
  return `https://images.unsplash.com/photo-${photo.id}`;
}

export const photos = {
  chair: {
    id: "1728342057953-94bfad8f0e7e",
    alt: "A white dental chair next to a bright window",
    credit: "Katarzyna Zygnerska",
  },
  nile: {
    id: "1719659018185-8a239c35fb4a",
    alt: "A felucca sailing on the Nile in front of the Cairo Tower",
    credit: "Hatem Ramadan",
    position: "50% 35%",
  },
  mirror: {
    id: "1698749778813-ad5f2814e50f",
    alt: "A dental mirror held up in a treatment room",
    credit: "Katarzyna Zygnerska",
  },
  smile: {
    id: "1567516364473-233c4b6fcfbe",
    alt: "A woman smiling",
    credit: "Alexander Krivitskiy",
    position: "40% 50%",
  },
  doctor: {
    id: "1527613426441-4da17471b66d",
    alt: "A dentist in a white coat and mask getting ready for a treatment",
    credit: "Ani Kolleshi",
    position: "32% 35%",
  },
  explain: {
    id: "1606811841689-23dfddce3e95",
    alt: "A dentist explaining an X-ray to a patient before treatment",
    credit: "Caroline LM",
  },
  tray: {
    id: "1619988252418-a1e6ee10b122",
    alt: "Sterilized dental instruments laid out on a tray",
    credit: "Quilia",
  },
  nileNight: {
    id: "1697571349572-e73357ca5e19",
    alt: "The Nile at dusk as Cairo's lights come on",
    credit: "Michael Starkie",
  },
  laugh: {
    id: "1617812191081-2a24e3f30e45",
    alt: "A woman laughing",
    credit: "Street Og'",
    position: "50% 30%",
  },
  room: {
    id: "1629909613654-28e377c37b09",
    alt: "A treatment room with a teal dental chair and soft daylight",
    credit: "Benyamin Bohlouli",
  },
  waiting: {
    id: "1762625570087-6d98fca29531",
    alt: "A quiet waiting room with black chairs and a plant",
    credit: "Amy Vosters",
  },
  consult: {
    id: "1777331903190-341a3dd0441b",
    alt: "A dentist talking with a patient before her treatment",
    credit: "Harold Hisona",
  },
  loupes: {
    id: "1560070201-d3d11effa179",
    alt: "A dentist wearing magnifying loupes while treating a patient",
    credit: "Geo Days",
  },
} satisfies Record<string, Photo>;

/** One photo per treatment, matched by the service's slug. */
export const servicePhotos: Record<string, Photo> = {
  "check-up-and-consultation": {
    id: "1606811971618-4486d14f3f99",
    alt: "A dentist checking teeth with a mirror and probe",
    credit: "Caroline LM",
  },
  "scaling-and-polishing": {
    id: "1681939278218-a755fb2bf2d3",
    alt: "A dentist cleaning a patient's teeth",
    credit: "SoyBreno",
  },
  "tooth-colored-filling": {
    id: "1606811856475-5e6fcdc6e509",
    alt: "A dental mirror and explorer on a white surface",
    credit: "Caroline LM",
  },
  "teeth-whitening": {
    id: "1654373535457-383a0a4d00f9",
    alt: "A close-up of a smile with white teeth",
    credit: "Tony Litvyak",
  },
  "root-canal-treatment": {
    id: "1588776814546-1ffcf47267a5",
    alt: "A dentist examining dental X-rays on a light box",
    credit: "Jonathan Borba",
    position: "60% 50%",
  },
  "orthodontic-consultation": {
    id: "1564420228450-d9a5bc8d6565",
    alt: "Hands holding clear aligners and their case",
    credit: "Candid",
  },
  "kids-dental-check-up": {
    id: "1631051103633-24959376b92d",
    alt: "A smiling boy in a dental chair",
    credit: "Nate Johnston",
    position: "70% 40%",
  },
  "implant-consultation": {
    id: "1593022356769-11f762e25ed9",
    alt: "A model of a dental implant between two natural teeth",
    credit: "Jonathan Borba",
  },
};

/** A treatment's photo, or a calm studio photo for treatments added later in Supabase. */
export function photoForService(slug: string): Photo {
  return servicePhotos[slug] ?? photos.room;
}

/** For the photo credits list. */
export const allPhotos: Photo[] = [...Object.values(photos), ...Object.values(servicePhotos)];
