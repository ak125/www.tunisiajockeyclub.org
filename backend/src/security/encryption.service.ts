import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 12;
  private readonly tagLength = 16;
  private readonly saltLength = 32;

  private async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    const scryptAsync = promisify(scrypt);
    return (await scryptAsync(password, salt, this.keyLength)) as Buffer;
  }

  async encrypt(text: string, password?: string): Promise<string> {
    try {
      const key = password
        ? await this.deriveKey(password, randomBytes(this.saltLength))
        : Buffer.from(
            process.env.DATABASE_ENCRYPTION_KEY ||
              'default-key-change-in-production',
            'hex',
          );

      const iv = randomBytes(this.ivLength);
      const cipher = createCipheriv(this.algorithm, key, iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Return: salt(if custom password) + iv + authTag + encrypted
      const result = password
        ? Buffer.concat([
            randomBytes(this.saltLength),
            iv,
            authTag,
            Buffer.from(encrypted, 'hex'),
          ]).toString('base64')
        : Buffer.concat([iv, authTag, Buffer.from(encrypted, 'hex')]).toString(
            'base64',
          );

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Encryption failed: ${errorMessage}`);
    }
  }

  async decrypt(encryptedData: string, password?: string): Promise<string> {
    try {
      const data = Buffer.from(encryptedData, 'base64');
      let offset = 0;

      // Extract salt if custom password
      let key: Buffer;
      if (password) {
        const salt = data.slice(offset, offset + this.saltLength);
        offset += this.saltLength;
        key = await this.deriveKey(password, salt);
      } else {
        key = Buffer.from(
          process.env.DATABASE_ENCRYPTION_KEY ||
            'default-key-change-in-production',
          'hex',
        );
      }

      // Extract IV
      const iv = data.slice(offset, offset + this.ivLength);
      offset += this.ivLength;

      // Extract auth tag
      const authTag = data.slice(offset, offset + this.tagLength);
      offset += this.tagLength;

      // Extract encrypted text
      const encrypted = data.slice(offset);

      const decipher = createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Decryption failed: ${errorMessage}`);
    }
  }

  generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  generateSessionSecret(): string {
    return randomBytes(64).toString('hex');
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
