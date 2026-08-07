import type { StaticImageData } from "next/image";
import freedomShot from "@/media/site-freedom-septic.png";
import countryShot from "@/media/site-country-auto.png";
import landworxShot from "@/media/site-landworx.png";
import rrLawnShot from "@/media/site-rr-premier-lawn.png";

/**
 * Sites built for local businesses. Kept separate from `projects` on purpose:
 * these are simple marketing sites, and lumping them in with the certified
 * game and the live agent would flatten the difference. This section has its
 * own, plainer pitch, aimed at a local owner who wants a site rather than a
 * recruiter reading the software work above.
 */
export type Website = {
  name: string;
  /** One line a non-technical owner understands. Not a feature list. */
  descriptor: string;
  location: string;
  shot: { src: StaticImageData; alt: string };
  /**
   * The live URL, present only once the site is actually on a public domain.
   * When it is absent the card says "Built, launching soon" instead of
   * linking, so a not-yet-launched site never ships a dead link.
   */
  href?: string;
};

export const websites: Website[] = [
  {
    name: "Freedom Septic",
    descriptor: "Septic systems, repairs, and storm shelters.",
    location: "Central Oklahoma",
    href: "https://freedomsepticllc.com",
    shot: {
      src: freedomShot,
      alt: "Homepage of the Freedom Septic LLC website. A navy hero reading 'Reliable Septic Service, Done Right the First Time' sits beside a photo of a septic pump truck in a field.",
    },
  },
  {
    name: "Country Auto Service",
    descriptor: "A repair shop that does all types of auto work.",
    location: "McLoud, Oklahoma",
    href: "https://countryautoservicellc.com",
    shot: {
      src: countryShot,
      alt: "Homepage of the Country Auto Service website. A navy and red hero reading 'All Types of Auto Repair' sits beside a shop-hours panel.",
    },
  },
  {
    name: "R&R Premier Lawn Services",
    descriptor: "Mowing, flower beds, and yard cleanup.",
    location: "Oklahoma City metro",
    href: "https://rrpremierlawnservices.com",
    shot: {
      src: rrLawnShot,
      alt: "Homepage of the R&R Premier Lawn Services website. A green hero reading 'Lawn Care You Can Count On' over a grass background sits beside a photo of a landscaped flower bed in front of a house.",
    },
  },
  {
    name: "Landworx Construction",
    descriptor: "Concrete, excavation, and land clearing.",
    location: "Central Oklahoma",
    shot: {
      src: landworxShot,
      alt: "Homepage of the Landworx Construction website. A black and white hero over a jobsite photo reads 'Built on Solid Ground'.",
    },
  },
];
