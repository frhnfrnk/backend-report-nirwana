import { IsNotEmpty, IsString } from 'class-validator';

export class FollowUpDto {
  @IsNotEmpty()
  @IsString()
  readonly petugas: string;
}
