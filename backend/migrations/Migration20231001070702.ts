import { Migration } from '@mikro-orm/migrations';

export class Migration20231001070702 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` varchar(255) not null, `created_at` datetime not null, `updated_at` datetime not null, `email` varchar(255) not null, `country` varchar(255) not null, `postal_code` varchar(255) not null, `street` varchar(255) not null, `role` enum(\'admin\', \'moderator\', \'guest\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `wallet` (`id` varchar(255) not null, `created_at` datetime not null, `updated_at` datetime not null, `balance` int not null, `user_id` varchar(255) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `user`;');

    this.addSql('drop table if exists `wallet`;');
  }

}
