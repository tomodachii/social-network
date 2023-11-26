import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AttachmentType, PostMode } from '../../domain';
import { Type } from 'class-transformer';

class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsEnum(AttachmentType)
  @IsNotEmpty()
  type: AttachmentType;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  originalPost: string;

  @IsArray()
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];

  @IsEnum(PostMode)
  mode: PostMode;
}
