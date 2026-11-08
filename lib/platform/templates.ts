import type { DocKind } from './types';

export const kindLabel: Record<DocKind, string> = {
  certificate: 'Certificate of volunteering',
  appointment: 'Letter of appointment',
  recommendation: 'Letter of recommendation',
  offer: 'Offer letter',
  experience: 'Experience letter',
  termination: 'Letter of removal',
};

type Vars = { name: string; title: string; program: string; hours: string; areas: string; from: string; to: string; signer: string };

/** Starting text for each document. Staff edit it before issuing; [brackets] mark what still needs filling in. */
export function template(kind: DocKind, v: Vars) {
  switch (kind) {
    case 'certificate':
      return `This certifies that ${v.name} volunteered with Cedar Initiative${v.program ? ` on ${v.program}` : ''}${v.hours ? `, contributing ${v.hours} hours` : ''}${v.areas ? ` in ${v.areas}` : ''}.\n\nWe thank them for their time and care.`;
    case 'appointment':
      return `Dear ${v.name},\n\nWe are pleased to appoint you as ${v.title} at Cedar Initiative${v.program ? `, working on ${v.program}` : ''}, from ${v.from || '[start date]'}${v.to ? ` to ${v.to}` : ''}.\n\nThis is a volunteer role. Your responsibilities are:\n- [responsibility]\n- [responsibility]\n\nYou will report to ${v.signer || '[name]'}. Please follow Cedar's code of conduct and safeguarding policy at all times.\n\nWelcome to the team.`;
    case 'offer':
      return `Dear ${v.name},\n\nFollowing your application, we would like to offer you the volunteer role of ${v.title}${v.program ? ` on ${v.program}` : ''}, starting ${v.from || '[start date]'}.\n\nPlease reply within seven days to accept. If you have questions about the role, contact ${v.signer || 'us'}.`;
    case 'recommendation':
      return `To whom it may concern,\n\nI am pleased to recommend ${v.name}, who volunteered with Cedar Initiative${v.program ? ` on ${v.program}` : ''}${v.from ? ` from ${v.from}${v.to ? ` to ${v.to}` : ''}` : ''}${v.hours ? `, contributing ${v.hours} verified hours` : ''}.\n\n[What they did, with one concrete example.]\n\n[Qualities you saw: reliability, initiative, teamwork.]\n\nI recommend them without reservation. Please contact me through info@cedar-initiative.org with any questions.`;
    case 'experience':
      return `This is to confirm that ${v.name} served as ${v.title} at Cedar Initiative${v.from ? ` from ${v.from}${v.to ? ` to ${v.to}` : ''}` : ''}${v.hours ? `, with ${v.hours} verified volunteer hours` : ''}${v.areas ? ` in ${v.areas}` : ''}.`;
    case 'termination':
      return `Dear ${v.name},\n\nThis letter confirms that your role as ${v.title} at Cedar Initiative ends on ${v.to || '[date]'}.\n\nReason: [state the reason plainly and factually].\n\nPlease return any Cedar materials and stop representing Cedar from that date. Thank you for the time you gave.`;
  }
}

/** LinkedIn "Add to profile" link for a certificate (Licenses & certifications). */
export function linkedInAddUrl(d: { title: string; issued_on: string; id: string; expires_on?: string | null }, verifyBase: string) {
  const issued = new Date(d.issued_on);
  const q = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: d.title,
    organizationName: 'Cedar Initiative',
    issueYear: String(issued.getUTCFullYear()),
    issueMonth: String(issued.getUTCMonth() + 1),
    certUrl: `${verifyBase}/verify/?id=${d.id}`,
    certId: d.id,
  });
  if (d.expires_on) {
    const e = new Date(d.expires_on);
    q.set('expirationYear', String(e.getUTCFullYear()));
    q.set('expirationMonth', String(e.getUTCMonth() + 1));
  }
  return `https://www.linkedin.com/profile/add?${q.toString()}`;
}
