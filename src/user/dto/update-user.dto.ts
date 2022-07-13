import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  oldPassowrd: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
