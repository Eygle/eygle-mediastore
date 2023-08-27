import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index({ unique: true })
  title: string

  @CreateDateColumn()
  createdAd: Date

  @UpdateDateColumn()
  updatedAt: Date
}
