import { Images, MapPin, MessageCircle, Star, Stethoscope, type LucideIcon } from "lucide-react";

/** The "The clinic" menu in the header and the mobile menu. */
export const clinicLinks: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/#doctor", label: "Dr. Salma Nabil", description: "Who treats you", icon: Stethoscope },
  { href: "/#studio", label: "Inside the studio", description: "Photos of the clinic", icon: Images },
  { href: "/#reviews", label: "Patient reviews", description: "4.9 from 380 reviews", icon: Star },
  { href: "/#visit", label: "Hours and directions", description: "Zamalek, Cairo", icon: MapPin },
  { href: "/#faq", label: "Questions and answers", description: "Paying, parking, changes", icon: MessageCircle },
];
