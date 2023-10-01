import { WalletRecord } from './src/wallet/infrastructure/wallet.record';
import { UserRecord } from './src/user/infrastructure/user.record';
export default {
  entities: [UserRecord, WalletRecord], // no need for `entitiesTs` this way
  dbName: 'my-db-name',
  type: 'mysql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
};
