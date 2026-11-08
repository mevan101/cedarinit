import Img from './Img';
import Icon from './Icon';
import { portraitOf, type Person } from '@/lib/team';

export default function PersonCard({ person, large = false }: { person: Person; large?: boolean }) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[0_20px_40px_-28px_rgb(var(--cedar-950)/0.35)]">
      <div className={`relative overflow-hidden bg-cedar-50 ${large ? 'aspect-[4/5]' : 'aspect-square'}`}>
        <Img name={portraitOf(person)} alt={`Portrait of ${person.name}`} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.04]" />
        {person.badge && (
          <span className="chip glass absolute left-4 top-4 !border-white/60 !bg-white/75">{person.badge}</span>
        )}
      </div>
      <div className="flex flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">{person.name}</h3>
          <p className="mt-1 text-sm leading-snug text-ink-soft">{person.role}</p>
          {person.bio && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{person.bio}</p>}
        </div>
        <div className="flex gap-1.5 empty:hidden">
          {person.linkedin && (
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cedar-50 text-cedar-800 transition hover:bg-cedar-700 hover:text-white">
              <Icon name="linkedin" className="h-4 w-4" /><span className="sr-only">{person.name} on LinkedIn (opens in a new tab)</span>
            </a>
          )}
          {person.email && (
            <a href={`mailto:${person.email}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cedar-50 text-cedar-800 transition hover:bg-cedar-700 hover:text-white">
              <Icon name="mail" className="h-4 w-4" /><span className="sr-only">Email {person.name}</span>
            </a>
          )}
          {person.facebook && (
            <a href={person.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cedar-50 text-cedar-800 transition hover:bg-cedar-700 hover:text-white">
              <Icon name="facebook" className="h-4 w-4" /><span className="sr-only">{person.name} on Facebook (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
