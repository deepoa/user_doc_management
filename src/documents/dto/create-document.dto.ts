import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export type CreateDocumentData = CreateDocumentDto & {
    filePath: string;
    mimeType: string;
  };