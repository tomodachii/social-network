import { Entity } from '@lib/ddd';
import {
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from '@lib/common/exceptions';
import { BioImageType } from '../user.type';
import { validate as uuidValidate } from 'uuid';
import { HttpStatus } from '@lib/common/api';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

export interface BioImageProps {
  type: BioImageType;
  extension: string;
  size: number;
}

export interface CreateBioImageProps {
  id: string;
  extension: string;
  size: number;
}

export class BioImageEntity extends Entity<BioImageProps> {
  protected _id: string;
  static createAvatar(create: CreateBioImageProps): BioImageEntity {
    const props: BioImageProps = {
      ...create,
      type: BioImageType.AVATAR,
    };
    return new BioImageEntity({ id: create.id, props });
  }

  static createCover(create: CreateBioImageProps): BioImageEntity {
    const props: BioImageProps = {
      ...create,
      type: BioImageType.COVER,
    };
    return new BioImageEntity({ id: create.id, props });
  }

  public validate(): void {
    if (uuidValidate(this._id) === false) {
      throw new ArgumentInvalidException(
        'file id must be uuid',
        HttpStatus.BAD_REQUEST
      );
    }
    if (this.props.size > 5012) {
      throw new ArgumentOutOfRangeException(
        'image size must not be greater than 5MB',
        HttpStatus.BAD_REQUEST
      );
    }
    if (this.isInValidImageExtesion(this.props.extension)) {
      throw new ArgumentInvalidException(
        'image extension must be jpg, jpeg, png',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private isInValidImageExtesion(extension: string) {
    return extension && !IMAGE_EXTENSIONS.includes(extension);
  }
}
