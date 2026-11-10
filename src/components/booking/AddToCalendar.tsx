"use client";

import { CalendarPlus, ChevronDown, Download } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

/** "Add to calendar": Google Calendar online, or an .ics file for any calendar app. */
export function AddToCalendar({
  googleUrl,
  icsUrl,
  fileName,
}: {
  googleUrl: string;
  icsUrl: string;
  fileName: string;
}) {
  return (
    <Dropdown
      label={
        <>
          <CalendarPlus aria-hidden="true" className="size-5" strokeWidth={1.75} />
          Add to calendar
          <ChevronDown aria-hidden="true" className="size-4" strokeWidth={2} />
        </>
      }
      buttonClassName={buttonStyles({ variant: "secondary" })}
      items={[
        {
          label: "Google Calendar",
          description: "Opens in a new tab",
          href: googleUrl,
          external: true,
          icon: <CalendarPlus className="size-5" strokeWidth={1.75} />,
        },
        {
          label: "Apple Calendar or Outlook",
          description: "Downloads an .ics file, with a reminder 2 hours before",
          href: icsUrl,
          download: fileName,
          icon: <Download className="size-5" strokeWidth={1.75} />,
        },
      ]}
    />
  );
}
