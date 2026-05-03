import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';

@Entity('legal_documents')
export class LegalDocumentEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 5 })
  language: string;

  @Column({ type: 'jsonb' })
  content: any;
}
