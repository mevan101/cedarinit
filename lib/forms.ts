import { readDir } from './markdown';

export type FormField = { label: string; name: string; type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'number' | 'date' | 'url'; required?: boolean; options?: string[]; help?: string };
export type FormDef = { id: string; title: string; intro?: string; action?: string; method?: string; submit_label?: string; success?: string; fields: FormField[] };

export const forms = readDir<FormDef>('content/forms', '.json');
export const getForm = (id: string) => forms.find((f) => f.slug === id || f.id === id);
