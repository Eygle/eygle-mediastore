import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { MediaGroup } from '../media-group/media-group.entity';

// Expression index created manually (synchronize would drop it otherwise):
// CREATE INDEX "IDX_media_in_progress" ON "mediastore"."media" (id) WHERE progress[1] IS NOT NULL;
@Entity()
@Index('IDX_media_in_progress', { synchronize: false })
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('varchar', { array: true })
  files: string[];

  @Column({ default: false })
  @Index()
  toSee: boolean;

  @Column({ default: false })
  @Index()
  isPotentialBest: boolean;

  @Column({ default: false })
  @Index()
  isBest: boolean;

  @Column({ default: false })
  @Index()
  isAbsoluteBest: boolean;

  @Column({ default: false })
  @Index()
  toTag: boolean;

  @Column({ nullable: true })
  externalLink: string;

  @Column('int', { array: true, nullable: true })
  progress: number[];

  @ManyToOne(() => MediaGroup, (group) => group.media, { nullable: true })
  @Index()
  parent: MediaGroup;

  @Column({ nullable: true })
  @Index({ where: '"comment" IS NOT NULL' })
  comment: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => MediaGroup, (group) => group.starringMedia)
  @JoinTable()
  starring: MediaGroup[];

  @CreateDateColumn()
  createdAd: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
