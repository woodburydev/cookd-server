import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Appetizer, Extras } from './menus.dto';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 120 })
  public fbuuid: string;

  @Column({ type: 'varchar', length: 120 })
  public title: string;

  @Column({ type: 'varchar', length: 120 })
  public filename: string;

  @Column({ type: 'varchar', length: 200 })
  public description: string;

  @Column({ type: 'smallint' })
  public cost_per_person: number;

  @Column({ type: 'simple-json', default: [] })
  appetizers: Appetizer[];

  @Column({ type: 'simple-json', default: [] })
  entrees: Appetizer[];

  @Column({ type: 'simple-json', default: [] })
  deserts: Appetizer[];

  @Column({ type: 'simple-json', default: [] })
  extras: Extras[];
}
