import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { InitiateUploadDto, CompleteUploadDto, TestUploadDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/initiate')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Initiate file upload', description: 'Get signed URL for multipart file upload. Returns upload ID and signed URL.' })
  @ApiResponse({ status: 200, description: 'Upload initiated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async initiateUpload(@Body() dto: InitiateUploadDto) {
    return this.filesService.initiateUpload(dto);
  }

  @Public()
  @Post('upload/complete')
  @ApiOperation({ summary: 'Complete file upload', description: 'Complete file upload and save metadata. Called by storage service or client after upload.' })
  @ApiResponse({ status: 200, description: 'Upload completed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid upload session or file key mismatch' })
  async completeUpload(@Body() dto: CompleteUploadDto) {
    return this.filesService.completeUpload(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/test')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Testing] Test file upload', description: 'Backend testing endpoint for file upload flow.' })
  @ApiResponse({ status: 200, description: 'Test upload details returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async testUpload(@Body() dto: TestUploadDto) {
    return this.filesService.testUpload(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get file by ID', description: 'Get file metadata by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File found' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFile(@Param('id') id: string) {
    return this.filesService.getFileById(id);
  }
}

