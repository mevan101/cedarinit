/** Questions to make the first conversation useful, not promises of a program or payment method. */
export function contactHref(subject: string, message: string) {
  return `/contact/?${new URLSearchParams({ subject, message }).toString()}#message`;
}

export const givingContact = contactHref(
  'Giving to Cedar',
  'Hello Cedar,\n\nI’d like to discuss supporting your work.\n\nProgram or kind of support I have in mind:\nApproximate amount or items, if known:\nCountry I’m giving from:\nAny receipt or reporting requirements:\n\nWhat options are currently available?',
);

export const partnerContact = (kind: string) =>
  contactHref(
    `${kind} partnership`,
    'Hello Cedar,\n\nI’d like to discuss running a program together.\n\nOrganisation and my role:\nLocation:\nProgram we’re interested in:\nPossible dates:\nSpace, equipment or support we could offer:\n\nWhat would we need to plan together?',
  );
