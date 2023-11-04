// Generate UpdateAvatarDto class using class-validator
// id : uuid
// type: BioImageType;
// extension: string;
// size: number;

import { IsEnum, IsString, IsUUID } from 'class-validator';
import { BioImageType } from '../../domain';

export class UpdateBioImageDto {
  @IsUUID()
  id: string;

  @IsEnum(BioImageType)
  type: BioImageType;

  @IsString()
  extension: string;

  @IsString()
  size: number;
}
