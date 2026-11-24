// What editors changed in the staff dashboard, copied from Supabase before each build (scripts/pull-site-data.mjs).
// Empty snapshots mean "use the content files".
import settingsJson from '@/content/live/settings.json';

export type LiveContact = { email?: string; phone?: string; whatsapp?: string; messenger?: string; location?: string; volunteer_form?: string };
export type LiveLink = { label: string; href: string; icon?: string };
export type LiveAnnouncement = { enabled: boolean; text: string; link?: string; link_label?: string; tone?: string };
export type LiveTeamGroup = { name: string; slug: string; description?: string; layout?: 'large' | 'grid' };
export type LiveSettings = { contact?: LiveContact; socials?: LiveLink[]; footer_links?: LiveLink[]; announcement?: LiveAnnouncement; teams?: LiveTeamGroup[] };

export const liveSettings = settingsJson as LiveSettings;
