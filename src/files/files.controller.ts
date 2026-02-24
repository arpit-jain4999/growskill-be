import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { InitiateUploadDto, CompleteUploadDto, TestUploadDto } from './dto/upload-file.dto';
import { InitiateUploadResponseDto, CompleteUploadResponseDto, TestUploadResponseDto, FileInfoResponseDto } from './dto/file-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Files')
@Controller('v1/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/initiate')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Initiate file upload', description: 'Get signed URL for multipart file upload. Returns upload ID and signed URL.' })
  @ApiOkResponse({ 
    description: 'Upload initiated successfully',
    type: InitiateUploadResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing JWT token',
    type: StandardErrorResponseDto,
  })
  @ApiBadRequestResponse({ 
    description: 'Bad request - Invalid file details',
    type: StandardErrorResponseDto,
  })
  async initiateUpload(@Body() dto: InitiateUploadDto) {
    return this.filesService.initiateUpload(dto);
  }

  @Public()
  @Post('upload/complete')
  @ApiOperation({ summary: 'Complete file upload', description: 'Complete file upload and save metadata. Called by storage service or client after upload.' })
  @ApiOkResponse({ 
    description: 'Upload completed successfully',
    type: CompleteUploadResponseDto,
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid upload session or file key mismatch',
    type: StandardErrorResponseDto,
  })
  async completeUpload(@Body() dto: CompleteUploadDto) {
    return this.filesService.completeUpload(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/test')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Testing] Test file upload', description: 'Backend testing endpoint for file upload flow.' })
  @ApiOkResponse({ 
    description: 'Test upload details returned',
    type: TestUploadResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing JWT token',
    type: StandardErrorResponseDto,
  })
  async testUpload(@Body() dto: TestUploadDto) {
    return this.filesService.testUpload(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get file by ID', description: 'Get file metadata by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiOkResponse({ 
    description: 'File found',
    type: FileInfoResponseDto,
  })
  @ApiNotFoundResponse({ 
    description: 'File not found',
    type: StandardErrorResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing JWT token',
    type: StandardErrorResponseDto,
  })
  async getFile(@Param('id') id: string) {
    return this.filesService.getFileById(id);
  }
}

