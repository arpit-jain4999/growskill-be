import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { VideoProcessingService } from './video-processing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Video')
@Controller('v1/videos')
export class VideoProcessingController {
  constructor(private readonly videoProcessingService: VideoProcessingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('processing/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get video processing status',
    description: 'Returns status and master HLS playlist URL when processing is completed. For module-level video, response includes moduleId; use POST /v1/files/upload/initiate with moduleId to auto-set that module\'s videoUrl when done.',
  })
  @ApiParam({ name: 'id', description: 'Video processing ID (returned when upload completes with chapterId)' })
  @ApiOkResponse({ description: 'Processing status and masterPlaylistUrl when completed' })
  @ApiNotFoundResponse({ description: 'Video processing not found', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid ID', type: StandardErrorResponseDto })
  async getProcessingStatus(@Param('id') id: string) {
    return this.videoProcessingService.getStatus(id);
  }
}
