import { ButtonLink, Container } from '@/components/ui/primitives';

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold">404</p>
      <h1 className="mt-6 text-5xl md:text-6xl">This page has taken another route</h1>
      <p className="mt-6 max-w-md text-mute">The page you are looking for does not exist or has moved.</p>
      <div className="mt-12">
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </Container>
  );
}
