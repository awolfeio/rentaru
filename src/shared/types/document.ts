export type DocumentType = 'lease' | 'notice' | 'report' | 'invoice' | 'other';
export type DocumentStatus = 'signed' | 'unsigned' | 'expired' | 'draft';
export type RelatedEntityType = 'property' | 'unit' | 'tenant' | 'lease';

export interface DocRecord {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  relatedEntityType: RelatedEntityType;
  relatedEntityName: string;
  size: string;
  uploadedAt: string;
  signedAt?: string;
  uploadedBy: string;
  fileUrl: string;
  mimeType: string;
}
