import { IsString, IsNumber, ValidateIf, IsUUID } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  name: string;

  @IsNumber()
  duration: number;

  @ValidateIf((_, value) => !(value === null))
  @IsUUID('4')
  artistId: string | null;

  @ValidateIf((_, value) => !(value === null))
  @IsUUID('4')
  albumId: string | null;
}
