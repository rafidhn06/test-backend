import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RegisterResponseDto, LoginResponseDto } from './dto/auth-response.dto';
import { ErrorResponseDto } from '../common/dto/response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 409,
    type: ErrorResponseDto,
    description: 'Email already exists',
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponseDto,
    description: 'Validation failed',
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: 401,
    type: ErrorResponseDto,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponseDto,
    description: 'Validation failed',
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
