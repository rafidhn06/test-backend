import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../common/dto/response.dto';
import { PostDto, PaginatedPostDto } from './post.dto';

export class PostResponseDto extends BaseResponseDto {
  @ApiProperty({ type: PostDto })
  data: PostDto;
}

export class PaginatedPostResponseDto extends BaseResponseDto {
  @ApiProperty({ type: PaginatedPostDto })
  data: PaginatedPostDto;
}
