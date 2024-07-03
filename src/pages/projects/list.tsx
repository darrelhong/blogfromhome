import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  type ElementRef,
  forwardRef,
  type ComponentPropsWithoutRef,
} from "react";
import type { ImageMetadata } from "astro";

import NMETheCoverImage from "./images/nme-the-cover.avif";
import BLLicensing from "./images/bandlab-licensing.avif";
import RNPublishing from "./images/rn-publishing.avif";
import BLDeals from "./images/bandlab-deals.avif";
import ExperienceSL from "./images/experience-sweelee.avif";
import SLListeningStations from "./images/sweelee-listening-stations.avif";
import BLT from "./images/bandlab-technologies.avif";
import C24 from "./images/c24.avif";
import StepIntoTheBeat from "./images/step-into-the-beat.avif";
import TTCoins from "./images/tiktok-coins.avif";
import TTBalance from "./images/tiktok-balance.avif";
import NNco from "./images/99co.avif";
import SupportLocal from "./images/supportlocal.avif";
import HDBResale from "./images/hdb-resale-prices.avif";
import Arewecarliteyet from "./images/arewecarliteyet.avif";
import Eliss from "./images/eliss.avif";
import MicroURL from "./images/microurl.avif";
import CheckInLah from "./images/check-in-lah.avif";
import Sudoko from "./images/sudoku.avif";
import Mannys from "./images/mannys.avif";
import CMG from "./images/cmg.avif";

type Project = {
  title: string;
  link?: string;
  href?: string;
  description: string;
  image?: ImageMetadata;
};

const projects = [
  {
    title: "NME The Cover",
    link: "https://www.nme.com/the-cover",
    description: "Next.js, Framer Motion, WordPress, Tailwind CSS",
    image: NMETheCoverImage,
  },
  {
    title: "BandLab Licensing",
    href: "https://deploy-preview-2--bandlab-licensing.netlify.app/details",
    link: "https://licensing.bandlab.com/details/",
    description: "Form validation (react-hook-form with zod), AWS S3",
    image: BLLicensing,
  },
  {
    title: "ReverbNation Publishing",
    link: "https://publishing.reverbnation.com",
    description: "Framer Motion, Airtable, interactive carousel",
    image: RNPublishing,
  },

  {
    title: "Experience Swee Lee",
    link: "https://experience.sweelee.com/",
    description: "Next.js, Server Actions, Tailwind CSS",
    image: ExperienceSL,
  },
  {
    title: "Swee Lee Listening Stations",
    link: "https://experience.sweelee.com/listening-stations",
    description: "Interactive stories UX (best viewed on mobile) ",
    image: SLListeningStations,
  },
  {
    title: "BandLab Technologies",
    link: "https://bandlabtechnologies.com/",
    description: "Gastby, WordPress, GSAP",
    image: BLT,
  },
  {
    title: "Caldecott Music Group",
    link: "https://cmg-web-vista.netlify.app/",
    description: "Next.js, WordPress, Framer Motion",
    image: CMG,
  },
  {
    title: "Bose x NME C24",
    link: "https://bose-x-nme-c24.bandlab.com/",
    description: "Framer Motion, Netlify, Airtable",
    image: C24,
  },
  {
    title: "Nike x Steezy x BandLab",
    link: "https://stepintothebeat.bandlab.com/",
    description: "Tailwind CSS, Framer Motion, CSS Animations",
    image: StepIntoTheBeat,
  },
  {
    title: "Manny's",
    link: "https://mannys.com/",
    description: "Next.js, Tailwind CSS, CSS Animations",
    image: Mannys,
  },
  {
    title: "BandLab Deals",
    link: "https://deals.bandlab.com?webview",
    description: "Framer Motion, Tailwind CSS, Netlify",
    image: BLDeals,
  },
  {
    title: "TikTok Live Coins",
    link: "https://www.tiktok.com/coin",
    image: TTCoins,
    description: "SSR, Styled Components, Webpack, TypeScript",
  },
  {
    title: "TikTok Live Balance",
    description: "WebView, Multi-page app, native APIs integration",
    image: TTBalance,
  },
  {
    title: "99.co",
    link: "https://www.99.co/",
    description: "Single-page app, SSR, Responsive design, SEO",
    image: NNco,
  },
] satisfies Project[];

const ownProjects = [
  {
    title: "#supportlocal",
    link: "https://supportlocal-sg.pages.dev/",
    description: "SvelteKit, Supabase, PostgreSQL",
    image: SupportLocal,
  },
  {
    title: "HDB resale price explorer",
    link: "https://hdb-resale-prices.fly.dev/resale/resale_prices",
    description: "SQLite, Datasette, Fly.io, Docker",
    image: HDBResale,
  },
  {
    title: "microURL",
    link: "https://microurl-koyebapp.koyeb.app/",
    description: "Database per tenant, Turso, SQLite, GoLang",
    image: MicroURL,
  },
  {
    title: "Are we car-lite yet?",
    link: "https://arewecarliteyet.pages.dev/",
    description: "SvelteKit",
    image: Arewecarliteyet,
  },

  {
    title: "FormSG",
    link: "https://github.com/opengovsg/FormSG",
    description: "React performance, Docker",
  },
  {
    title: "GoGovSG",
    link: "https://github.com/opengovsg/GoGovSG",
    description: "EJS, Express",
  },

  {
    title: "check-in-lah",
    link: "https://check-in-lah.pages.dev/",
    description: "SvelteKit, PocketBase",
    image: CheckInLah,
  },
  {
    title: "Sudoku",
    link: "https://sudoku-darrelhong.vercel.app/",
    description: "State management, re-rendering performance",
    image: Sudoko,
  },
  {
    title: "Mobile ELISS",
    link: "https://github.com/darrelhong/eliss",
    description: "Python, OpenCV, SwiftUI",
    image: Eliss,
  },
] satisfies Project[];

export function ProjectList() {
  return (
    <Accordion.Root
      type="multiple"
      className="grid sm:grid-cols-2 sm:divide-x-2"
    >
      <div>
        {projects.map((proj) => (
          <ProjectItem {...proj} key={proj.title} />
        ))}
      </div>
      <div className="mt-6 sm:mt-0 border-t-2 sm:border-t-0">
        {ownProjects.map((proj) => (
          <ProjectItem {...proj} key={proj.title} />
        ))}
      </div>
    </Accordion.Root>
  );
}

function ProjectItem({ title, description, image, link, href }: Project) {
  return (
    <AccordionItem value={title!!}>
      <AccordionTrigger>
        <div className="text-start">
          <p className="font-medium text-lg">{title}</p>
          <p className="text leading-tight">{description}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-3">
        <div className="space-y-2 px-4">
          {link && (
            <a
              href={href || link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group break-all "
            >
              <span className="font-medium decoration-dashed underline-offset-4 group-hover:text-x-marine decoration-x-marine underline duration-200 ease-in">
                {link}
              </span>
              &nbsp;
              <span className="text-darkpink">➜</span>
            </a>
          )}
        </div>
        {image ? (
          <img
            src={image.src}
            height={image.height}
            width={image.width}
            alt={title}
          />
        ) : (
          <div></div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

const AccordionItem = forwardRef<
  ElementRef<typeof Accordion.Item>,
  ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ children, className, ...props }, ref) => (
  <Accordion.Item ref={ref} className={`border-b-2 ${className}`} {...props}>
    {children}
  </Accordion.Item>
));

AccordionItem.displayName = Accordion.Item.displayName;

const AccordionTrigger = forwardRef<
  ElementRef<typeof Accordion.Trigger>,
  ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, className, ...props }, ref) => (
  <Accordion.Header>
    <Accordion.Trigger
      ref={ref}
      className={`py-2 px-4 w-full flex justify-between items-center [&[data-state=open]>svg]:rotate-180 ${className}`}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-6 shrink-0 transition-transform duration-200" />
    </Accordion.Trigger>
  </Accordion.Header>
));

AccordionTrigger.displayName = Accordion.Trigger.displayName;

const AccordionContent = forwardRef<
  ElementRef<typeof Accordion.Content>,
  ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ className, children, ...props }, ref) => (
  <Accordion.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={`${className}`}>{children}</div>
  </Accordion.Content>
));

AccordionContent.displayName = Accordion.Content.displayName;
