import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cook {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120, nullable: true })
  public email: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  public phone: string;
}
