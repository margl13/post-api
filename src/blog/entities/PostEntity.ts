import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/UserEntity';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 500 })
  subTitle: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('text')
  content: string;

  @ManyToOne((type) => UserEntity, (user) => user.posts)
  @JoinColumn()
  author: UserEntity;
}
