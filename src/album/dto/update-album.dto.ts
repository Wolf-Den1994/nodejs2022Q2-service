import { IsString, IsNumber, ValidateIf, IsUUID } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @ValidateIf((_, value) => !(value === null))
  @IsUUID('4')
  artistId: string | null;
}
