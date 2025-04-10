import { DocumentStatus } from 'src/shared/enums/document-status.enum';
import { User } from 'src/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';

  
  @Entity()
  export class Document {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    title: string;
  
    @Column()
    filePath: string;
  
    @Column()
    mimeType: string;
  
    @Column({ nullable: true })
    description: string;
  
    @Column({
      type: 'enum',
      enum: DocumentStatus,
      default: DocumentStatus.UPLOADED,
    })
    status: DocumentStatus;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'ownerId' })
    owner: User;
  
    @Column()
    ownerId: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }