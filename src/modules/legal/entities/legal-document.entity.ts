import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { LegalDocumentType } from '../enums/legal-document-type.enum';

@Entity('legal_documents')
@Index(['language', 'type'], { unique: true })
export class LegalDocumentEntity extends BaseEntity {
  @Column({ length: 5 })
  language: string;

  @Column({
    type: 'enum',
    enum: LegalDocumentType,
    nullable: true,
  })
  type: LegalDocumentType;

  @Column({ type: 'jsonb' })
  content: any;
}
