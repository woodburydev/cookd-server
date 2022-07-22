import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cook {
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
  public foundOut: string[];

  @Column({ type: 'varchar', length: 200 })
  public address: string;

  @Column({ type: 'varchar', length: 120 })
  public profilePictureName: string;

  @Column({ type: 'varchar', length: 300 })
  public bio: string;

  @Column({ type: 'varchar', length: 200 })
  public education: string;
}
