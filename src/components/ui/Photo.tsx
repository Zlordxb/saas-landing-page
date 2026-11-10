import Image from "next/image";
import { photoUrl, type Photo as PhotoData } from "@/content/photos";
import { cn } from "@/lib/format";

/**
 * A photo that fills its parent (the parent sets the size and shape).
 * `sizes` tells the browser how wide the photo shows, so it downloads the right size.
 */
export function Photo({
  photo,
  sizes,
  preload = false,
  decorative = false,
  className,
}: {
  photo: PhotoData;
  sizes: string;
  preload?: boolean;
  /** Purely visual: hidden from screen readers. */
  decorative?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={photoUrl(photo)}
      alt={decorative ? "" : photo.alt}
      fill
      sizes={sizes}
      preload={preload}
      className={cn("object-cover", className)}
      style={photo.position ? { objectPosition: photo.position } : undefined}
    />
  );
}
