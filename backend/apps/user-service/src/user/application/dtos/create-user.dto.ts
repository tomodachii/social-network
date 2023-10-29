import {
  IsDate,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
import { Gender } from '../../domain';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  @Matches(/^[a-zA-Z ]*$/)
  firstName: string;

  @IsString()
  @ApiProperty()
  @Matches(/^[a-zA-Z ]*$/)
  lastName: string;

  @IsDate()
  @ApiProperty()
  birthDay: Date;

  @IsEnum(Gender)
  @ApiProperty()
  gender: Gender;
}
