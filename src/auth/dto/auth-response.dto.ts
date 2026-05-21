import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../common/dto/response.dto';
import { UserDto } from './user.dto';

export class RegisterResponseDto extends BaseResponseDto {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export class LoginDataDto {
  @ApiProperty()
  access_token: string;
}

export class LoginResponseDto extends BaseResponseDto {
  @ApiProperty({ type: LoginDataDto })
  data: LoginDataDto;
}
