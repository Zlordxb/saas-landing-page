import { clinic } from "@/config/clinic";

/** Shown on every public page: the clinic is fictional, so nobody books a real dentist by mistake. */
export function DemoNotice() {
  if (!clinic.isDemo) return null;
  return (
    <div
      role="note"
      className="bg-demo px-5 py-2.5 text-center text-label font-medium text-balance text-on-demo"
    >
      Demo project. {clinic.name} is a fictional clinic, so bookings here are not real appointments.
    </div>
  );
}
