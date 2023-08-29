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

@Entity()
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
  isBest: boolean;

  @Column({ default: false })
  @Index()
  toTag: boolean;

  @Column({ nullable: true })
  externalLink: string;

  @Column('int', { array: true, nullable: true })
  @Index()
  progress: number[];

  @ManyToOne(() => MediaGroup, { nullable: true })
  @Index()
  parent: MediaGroup;

  @Column({ nullable: true })
  comment: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => MediaGroup)
  @JoinTable()
  starring: MediaGroup[];

  @CreateDateColumn()
  createdAd: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
