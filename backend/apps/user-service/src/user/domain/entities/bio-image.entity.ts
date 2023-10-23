import { Entity } from '@lib/ddd';
import {
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from '@lib/common/exceptions';
import { BioImageType } from '../user.type';
import { v4 } from 'uuid';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export interface BioImageProps {
  type: BioImageType;
  extension: string;
  size: number;
}

export interface CreateBioImageProps {
  extension: string;
  size: number;
}

export class BioImageEntity extends Entity<BioImageProps> {
  protected _id: string;
  static createAvatar(create: CreateBioImageProps): BioImageEntity {
    const id = v4();
    const props: BioImageProps = {
      ...create,
      type: BioImageType.AVATAR,
    };
    return new BioImageEntity({ id, props });
  }

  static createCover(create: CreateBioImageProps): BioImageEntity {
    const id = v4();
    const props: BioImageProps = {
      ...create,
      type: BioImageType.COVER,
    };
    return new BioImageEntity({ id, props });
  }

  public validate(): void {
    if (this.props.size > 5012) {
      throw new ArgumentOutOfRangeException(
        'image size must not be greater than 5MB'
      );
    }
    if (this.isInValidImageExtesion(this.props.extension)) {
      throw new ArgumentInvalidException(
        'image extension must be jpg, jpeg, png'
      );
    }
  }

  private isInValidImageExtesion(extension: string) {
    return extension && !IMAGE_EXTENSIONS.includes(extension);
  }
}
