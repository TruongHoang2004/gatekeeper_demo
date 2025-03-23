import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { UserRole } from '../enum/role.enum';
import { Article } from 'src/articles/entities/article.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: false, enum: UserRole }) 
    role: UserRole;

    @OneToMany(() => Article, article => article.author)
    articles: Article[];

    @Column() 
    createdDate: Date;

    @Column()
    updatedDate: Date;

    @BeforeInsert()
    setCreatedDate() {
        this.createdDate = new Date();
    }

    @BeforeInsert()
    setUpdatedDate() {
        this.updatedDate = new Date();
    }
}
