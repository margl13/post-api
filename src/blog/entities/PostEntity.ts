import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/UserEntity';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 500 })
  subTitle: string;

  @Column('text')
  imageUrl: string;

  @Column('text')
  content: string;

  @ManyToOne((type) => UserEntity, (user) => user.posts, {
    eager: true,
    cascade: false,
    nullable: true,
  })
  @JoinColumn()
  author: UserEntity;
}
