import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './report.schema';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    ReportsService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
