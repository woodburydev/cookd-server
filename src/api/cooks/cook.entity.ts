import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cook {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120 })
  public email: string;

  @Column({ type: 'varchar', length: 120 })
  public phone: string;

  @Column({ type: 'varchar', length: 120 })
  public firstname: string;

  @Column({ type: 'varchar', length: 120 })
  public lastname: string;

  @Column({ type: 'varchar', length: 10 })
  public countrycode: string;

  @Column({ type: 'varchar', length: 120 })
  public fbuuid: string;
}
