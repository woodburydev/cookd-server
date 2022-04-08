import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 120 })
  public email: string;

  @Column({ type: 'varchar', length: 120 })
  public phone: string;

  @Column({ type: 'varchar', length: 120 })
  public displayname: string;

  @Column({ type: 'varchar', length: 120 })
  public fbuuid: string;

  @Column('text', { array: true })
  public allergies: string[];

  @Column('text', { array: true })
  public cuisines: string[];
}
