import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { TokenEntity } from './token.entity';

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

  @OneToOne(() => TokenEntity, token => token.session, { cascade: true })
  token: TokenEntity;
}
