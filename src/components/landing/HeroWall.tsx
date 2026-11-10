"use client";

import { motion, MotionConfig } from "motion/react";
import { Photo } from "@/components/ui/Photo";
import { photos, type Photo as PhotoData } from "@/content/photos";
import type { Service } from "@/data/services";
import { cn } from "@/lib/format";
import { AppointmentCard } from "./AppointmentCard";

const ease = [0.22, 1, 0.36, 1] as const;

type Tile =
  | { kind: "photo"; photo: PhotoData; className: string; preload?: boolean }
  | { kind: "glaze"; className: string };

/**
 * Desktop: a 3 × 12 grid. Column 2's bottom rows stay empty for the booking card,
 * which sits over them like the keystone of the wall.
 */
const tiles: Tile[] = [
  {
    kind: "photo",
    photo: photos.chair,
    className: "col-start-1 row-span-7 row-start-1",
    preload: true,
  },
  { kind: "glaze", className: "col-start-2 row-span-3 row-start-1 bg-primary" },
  { kind: "photo", photo: photos.mirror, className: "col-start-2 row-span-5 row-start-4" },
  {
    kind: "photo",
    photo: photos.nile,
    className: "col-start-3 row-span-8 row-start-2",
    preload: true,
  },
  { kind: "glaze", className: "col-start-1 row-span-5 row-start-8 bg-faience-400" },
  { kind: "photo", photo: photos.smile, className: "col-start-3 row-span-3 row-start-10" },
];

/** Phones: three tiles in a row above the card. */
const strip = [photos.chair, photos.nile, photos.smile];

/**
 * The hero's tile wall. One orchestrated entrance: the tiles are laid one by one,
 * then the booking card rises into its place. Reduced-motion users see it all at once.
 */
export function HeroWall({ service }: { service?: Service }) {
  return (
    <MotionConfig reducedMotion="user">
      {/* Desktop wall */}
      <div className="relative hidden h-[37rem] lg:block">
        <div className="grid h-full grid-cols-3 grid-rows-12 gap-3">
          {tiles.map((tile, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.08 + index * 0.07, duration: 0.6, ease }}
              className={cn(
                "relative overflow-hidden tile-dome",
                tile.kind === "glaze" && "glaze",
                tile.className,
              )}
            >
              {tile.kind === "photo" ? (
                <Photo
                  photo={tile.photo}
                  sizes="(min-width: 1280px) 15rem, 25vw"
                  preload={tile.preload}
                />
              ) : null}
            </motion.div>
          ))}
        </div>
        {service ? (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.75, ease }}
            className="absolute bottom-0 left-[9%] w-[min(25rem,70%)]"
          >
            <AppointmentCard service={service} />
          </motion.div>
        ) : null}
      </div>

      {/* Phones and tablets */}
      <div className="flex flex-col lg:hidden">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {strip.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + index * 0.07, duration: 0.5, ease }}
              className="relative h-36 overflow-hidden tile-dome sm:h-52"
            >
              <Photo photo={photo} sizes="33vw" preload={index < 2} />
            </motion.div>
          ))}
        </div>
        {service ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="relative z-10 mx-auto -mt-10 w-full max-w-[25rem] px-3 sm:-mt-14"
          >
            <AppointmentCard service={service} />
          </motion.div>
        ) : null}
      </div>
    </MotionConfig>
  );
}
