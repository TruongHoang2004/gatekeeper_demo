import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne } from 'typeorm';

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.articles)
    author: User;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column({ default: false })
    published: boolean;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @BeforeInsert()
    setCreatedAt() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @BeforeUpdate()
    setUpdatedAt() {
        this.updatedAt = new Date();
    }
}
