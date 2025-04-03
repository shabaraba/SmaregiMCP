import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { SessionEntity } from './session.entity.js';

@Entity('tokens')
export class TokenEntity {
  @PrimaryColumn({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column()
  scope: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => SessionEntity, session => session.token)
  @JoinColumn({ name: 'session_id' })
  session: SessionEntity;
}
