import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from './media/media.module';
import { MediaGroupModule } from './media-group/media-group.module';
import { TagModule } from './tag/tag.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'azertyuiop',
      database: 'eygle',
      schema: 'mediastore',
      autoLoadEntities: true,
      logging: true,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    MediaModule,
    MediaGroupModule,
    TagModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
