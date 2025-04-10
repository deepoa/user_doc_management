import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../users/entities/user.entity';
  import { DocumentStatus } from '../shared/enums/document-status.enum';
  
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