import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { ComplaintsModule } from './complaints/complaints.module';

import { ForumsModule } from './forums/forums.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FilesModule,
    ForumsModule,
    UsersModule,
    AuthModule,
    ComplaintsModule
  ]
})
export class AppModule {}
