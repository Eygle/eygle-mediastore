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

@Entity()
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
  trimmed: boolean;

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

  @Column({ nullable: true })
  comment: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Media, (media) => media.parent)
  media: Media[];

  @ManyToMany(() => MediaGroup)
  @JoinTable()
  starring: MediaGroup[];

  @ManyToOne(() => MediaGroup, { nullable: true })
  @Index()
  parent: MediaGroup;

  @OneToMany(() => MediaGroup, (group) => group.parent)
  groups: MediaGroup[];

  @CreateDateColumn()
  createdAd: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
