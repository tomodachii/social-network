import { Entity } from '@lib/ddd';

interface ConfigProps {}

export class ConfigEntity extends Entity<ConfigProps> {
  protected _id: string;
  public validate(): void {}
}
