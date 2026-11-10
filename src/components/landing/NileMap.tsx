import { cn } from "@/lib/format";

/**
 * A drawn map, not a live one: Gezira island in the Nile, with Zamalek at its north
 * end and the Cairo Tower further south. The clinic's pin is the brand's nfr tile.
 * Pure SVG, so it costs no third-party scripts and matches the palette.
 */
export function NileMap({ className }: { className?: string }) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="relative overflow-hidden border border-line tile-dome-lg">
        <svg
          viewBox="0 0 480 560"
          role="img"
          aria-labelledby="nile-map-title"
          className="block h-auto w-full font-sans"
        >
          <title id="nile-map-title">
            Map: Nefer Dental Studio is in Zamalek, at the north end of Gezira island in the Nile,
            north of the Cairo Tower.
          </title>

          {/* The river */}
          <rect width="480" height="560" fill="var(--faience-200)" />
          <g fill="none" stroke="var(--faience-300)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M318 92q8-6 16 0t16 0" />
            <path d="M330 236q8-6 16 0t16 0" />
            <path d="M322 402q8-6 16 0t16 0" />
            <path d="M156 268q6-5 12 0t12 0" />
            <path d="M160 108q6-5 12 0t12 0" />
          </g>

          {/* West bank (Agouza, Dokki) and east bank (Bulaq, Downtown) */}
          <path
            d="M0 0H150C138 120 158 220 142 330C130 420 150 490 136 560H0Z"
            fill="var(--neutral-50)"
            stroke="var(--faience-300)"
          />
          <path
            d="M480 0H352C370 110 354 210 374 320C390 410 368 480 382 560H480Z"
            fill="var(--neutral-50)"
            stroke="var(--faience-300)"
          />

          {/* Bridges: 26th of July (across Zamalek), Qasr El Nil and Galaa (at the south end) */}
          <g stroke="var(--neutral-0)" strokeWidth="6" strokeLinecap="round">
            <path d="M146 188L370 174" />
            <path d="M284 470L378 452" />
            <path d="M140 446L198 452" />
          </g>

          {/* Gezira island */}
          <path
            d="M236 36C262 40 282 70 286 120C292 190 280 250 292 310C304 380 300 450 272 500C252 534 220 536 204 506C186 470 196 410 190 350C184 280 196 210 196 150C196 90 210 40 236 36Z"
            fill="var(--neutral-0)"
            stroke="var(--faience-400)"
            strokeWidth="2"
          />

          {/* Labels */}
          <g fill="var(--ink-muted)" fontSize="14" fontWeight="500" textAnchor="middle">
            <text x="70" y="150">Agouza</text>
            <text x="70" y="420">Dokki</text>
            <text x="420" y="140">Bulaq</text>
            <text x="424" y="372">Downtown</text>
          </g>
          <g fill="var(--ink)" fontSize="16" fontWeight="600" textAnchor="middle">
            <text x="240" y="250">Zamalek</text>
            <text x="246" y="366">Gezira</text>
          </g>
          <text
            x="0"
            y="0"
            transform="translate(326 330) rotate(-82)"
            fill="var(--faience-700)"
            fontSize="18"
            fontStyle="italic"
            fontFamily="var(--font-fraunces), Georgia, serif"
            textAnchor="middle"
          >
            River Nile
          </text>

          {/* Cairo Tower */}
          <g transform="translate(250 418)">
            <rect x="-3" y="-34" width="6" height="34" rx="2" fill="var(--faience-700)" />
            <ellipse cx="0" cy="-36" rx="7" ry="4" fill="var(--faience-700)" />
            <rect x="-1" y="-48" width="2" height="10" fill="var(--faience-700)" />
            <text x="12" y="-14" fill="var(--ink-muted)" fontSize="13" fontWeight="500">
              Cairo Tower
            </text>
          </g>

          {/* The clinic: a glazed tile pin with the nfr mark */}
          <g transform="translate(244 128)">
            <circle r="26" fill="var(--faience-600)" opacity="0.18" />
            <path d="M0 18C-10 6-16-2-16-10a16 16 0 0 1 32 0c0 8-6 16-16 28Z" fill="var(--faience-600)" />
            <path
              d="M-2.4 -10.4h4.8c2 1 3.3 2.9 3.3 5 0 2.8-2.5 5-5.7 5s-5.7-2.2-5.7-5c0-2.1 1.3-4 3.3-5z"
              fill="var(--neutral-0)"
            />
            <rect x="-1" y="-21" width="2" height="11" rx="1" fill="var(--neutral-0)" />
            <rect x="-3" y="-18.5" width="6" height="1.6" rx="0.8" fill="var(--neutral-0)" />
            <rect x="-3" y="-15.5" width="6" height="1.6" rx="0.8" fill="var(--neutral-0)" />
            <g transform="translate(22 -26)">
              <rect width="122" height="30" rx="15" fill="var(--neutral-0)" stroke="var(--line)" />
              <text x="61" y="20" fill="var(--ink)" fontSize="13" fontWeight="600" textAnchor="middle">
                Nefer Dental Studio
              </text>
            </g>
          </g>

          {/* North */}
          <g transform="translate(40 44)" fill="var(--ink-muted)">
            <path d="M0-16L7 4 0 0-7 4Z" />
            <text y="22" fontSize="13" fontWeight="600" textAnchor="middle">
              N
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="text-caption text-ink-muted">
        Illustrated map. The demo clinic’s exact address isn’t real.
      </figcaption>
    </figure>
  );
}
