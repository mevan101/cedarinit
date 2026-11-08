export type Role = 'volunteer' | 'manager' | 'issuer' | 'admin';
export type Profile = {
  id: string; email: string; full_name: string; handle?: string | null; photo_url?: string | null; phone?: string | null;
  institution?: string | null; city?: string | null; bio?: string | null; linkedin?: string | null; areas: string[];
  public_profile: boolean; role: Role; created_at: string;
};
export type AppStatus = 'new' | 'reviewing' | 'accepted' | 'declined' | 'withdrawn';
export type Application = {
  id: string; user_id: string; opportunity: string; opportunity_title: string; answers: Record<string, string>;
  status: AppStatus; staff_notes?: string | null; created_at: string; updated_at: string; profile?: Pick<Profile, 'full_name' | 'email' | 'phone' | 'institution'>;
};
export type HourEntry = {
  id: string; user_id: string; program: string; area: string; date: string; hours: number; note?: string | null;
  status: 'pending' | 'approved' | 'rejected'; created_at: string; profile?: Pick<Profile, 'full_name'>;
};
export type DocKind = 'certificate' | 'appointment' | 'recommendation' | 'offer' | 'experience' | 'termination';
export type Doc = {
  id: string; user_id: string; recipient_name: string; kind: DocKind; title: string; program?: string | null; hours?: number | null;
  areas: string[]; body: string; issued_on: string; expires_on?: string | null; signer_name: string; signer_title: string;
  status: 'valid' | 'revoked'; revoked_reason?: string | null; created_at: string;
};
export type VerifiedDoc = Omit<Doc, 'user_id' | 'body' | 'status' | 'revoked_reason' | 'created_at'> & { status: 'valid' | 'revoked' | 'expired' };
export type Message = { id: string; user_id: string; application_id?: string | null; subject: string; body: string; delivered: boolean; created_at: string };
export type PublicProfile = Pick<Profile, 'full_name' | 'handle' | 'photo_url' | 'institution' | 'city' | 'bio' | 'linkedin' | 'areas'> & {
  approved_hours: number; documents: { id: string; title: string; kind: DocKind; issued_on: string }[];
};

export interface Platform {
  mode: 'demo' | 'live';
  me(): Promise<Profile | null>;
  onChange(cb: () => void): () => void;
  signUp(email: string, password: string, fullName: string): Promise<{ needsConfirm: boolean }>;
  signIn(email: string, password: string): Promise<void>;
  sendLink(email: string): Promise<void>;
  signOut(): Promise<void>;
  saveProfile(patch: Partial<Profile>): Promise<Profile>;
  uploadPhoto(file: File): Promise<string>;

  apply(opportunity: string, title: string, answers: Record<string, string>): Promise<void>;
  myApplications(): Promise<Application[]>;
  withdraw(id: string): Promise<void>;
  logHours(e: Pick<HourEntry, 'program' | 'area' | 'date' | 'hours' | 'note'>): Promise<void>;
  myHours(): Promise<HourEntry[]>;
  myDocuments(): Promise<Doc[]>;
  myMessages(): Promise<Message[]>;
  getDocument(id: string): Promise<Doc | null>;
  verify(id: string): Promise<VerifiedDoc | null>;
  publicProfile(handle: string): Promise<PublicProfile | null>;

  // Staff
  applications(): Promise<Application[]>;
  updateApplication(id: string, patch: Partial<Pick<Application, 'status' | 'staff_notes'>>): Promise<void>;
  volunteers(): Promise<Profile[]>;
  setRole(userId: string, role: Role): Promise<void>;
  allHours(): Promise<HourEntry[]>;
  setHoursStatus(id: string, status: HourEntry['status']): Promise<void>;
  logHoursFor(userId: string, e: Pick<HourEntry, 'program' | 'area' | 'date' | 'hours' | 'note'>): Promise<void>;
  documents(): Promise<Doc[]>;
  issue(d: Omit<Doc, 'id' | 'status' | 'created_at' | 'revoked_reason'>): Promise<Doc>;
  revoke(id: string, reason: string): Promise<void>;
  sendMessage(userId: string, subject: string, body: string, applicationId?: string): Promise<{ delivered: boolean }>;
}

export const isStaff = (p: Profile | null) => !!p && p.role !== 'volunteer';
export const canIssue = (p: Profile | null) => !!p && (p.role === 'issuer' || p.role === 'admin');
