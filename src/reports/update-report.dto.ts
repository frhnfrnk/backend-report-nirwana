import {
  IsString,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
export class UpdateReportDto {
  @IsArray()
  @IsString({ each: true })
  imageDone: string[];
}
