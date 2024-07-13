export class CreateReportDto {
  name: string;
  desa: string;
  image: string;
  category: string;
  location: {
    coordinates: number[];
    address: string;
  };
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  pelapor: string;
  petugas?: string;
}
