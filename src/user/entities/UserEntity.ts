import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

import { UserRole } from '../dtos/UserDto';
import { PostEntity } from '../../blog/entities/PostEntity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role?: UserRole;

  @OneToMany((type) => PostEntity, (post) => post.author)
  posts: PostEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
