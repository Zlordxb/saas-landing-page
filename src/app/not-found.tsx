import { Logo } from "@/components/site/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container size="narrow" className="flex min-h-[70vh] flex-col justify-center gap-6 py-16">
      <Logo />
      <h1 className="font-display text-h1-sm md:text-h1">This page doesn’t exist</h1>
      <p className="max-w-prose text-lead text-ink-muted">
        The link may be old or mistyped. You can go back to the home page or book an appointment
        directly.
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ButtonLink href="/book" variant="secondary">
          Book an appointment
        </ButtonLink>
      </div>
    </Container>
  );
}
