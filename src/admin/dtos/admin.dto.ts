import { IsEmail, IsString, Length } from 'class-validator';

export class AdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 100)
  password: string;
}
