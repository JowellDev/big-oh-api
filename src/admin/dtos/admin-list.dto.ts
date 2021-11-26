import { Expose } from 'class-transformer';

export class AdminListDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  isActive: boolean;

  @Expose()
  isAdmin: boolean;

  @Expose()
  isSuperAdmin: boolean;

  @Expose()
  createdAt: string;
}
