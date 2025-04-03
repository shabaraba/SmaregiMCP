import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToOne } from 'typeorm';

@Entity('sessions')
export class SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  state: string;

  @Column({ name: 'code_verifier' })
  codeVerifier: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @OneToOne('TokenEntity', 'session', { cascade: true })
  token: any;
}
