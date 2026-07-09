import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { Field } from '../types/Field';
import { Media } from '../media/media.entity';

// Expression index created manually (synchronize would drop it otherwise):
// CREATE INDEX "IDX_media_group_lower_name" ON "mediastore"."media_group" (LOWER(name) text_pattern_ops);
@Entity()
@Index('IDX_media_group_lower_name', { synchronize: false })
export class MediaGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Field, nullable: true })
  @Index()
  field: Field;

  @Column({ default: false })
  @Index()
  toTrim: boolean;

  @Column({ nullable: true })
  count: number;

  @Column({ nullable: true })
  total: number;

  @Column({ nullable: true })
  lastEntry: Date;

  @Column({ nullable: true })
  externalLink: string;

  @Column({ default: false })
  @Index()
  toFollow: boolean;

  @Column({ default: false })
  @Index()
  toTag: boolean;

  @Column({ default: false })
  @Index()
  toSee: boolean;

  @Column({ nullable: true })
  @Index({ where: '"comment" IS NOT NULL' })
  comment: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Media, (media) => media.parent)
  media: Media[];

  @ManyToMany(() => MediaGroup)
  @JoinTable()
  starring: MediaGroup[];

  @ManyToMany(() => Media, (media) => media.starring)
  starringMedia: Media[];

  @ManyToOne(() => MediaGroup, (group) => group.groups, { nullable: true })
  @Index()
  parent: MediaGroup;

  @OneToMany(() => MediaGroup, (group) => group.parent)
  groups: MediaGroup[];

  @CreateDateColumn()
  createdAd: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Not a column: name prefixed with the ancestor names ("Website - Entry"),
  // set by MediaGroupService.setDisplayNames on flat listings so nested
  // groups sort next to their parent
  displayName?: string;
}
