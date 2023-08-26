import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { accessibleBy } from '@casl/mongoose';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');

        const mongooseConnection = {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,

          connectionFactory: (connection: any) => {
            connection.plugin(accessibleBy);

            return connection;
          },
        } as const;

        return mongooseConnection;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
