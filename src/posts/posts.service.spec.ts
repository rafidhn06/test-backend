import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([
        { id: 1, content: 'test' },
      ]);
      mockPrismaService.post.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.items).toHaveLength(1);
      expect(result.meta).toEqual({
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      });
      expect(mockPrismaService.post.findMany).toHaveBeenCalled();
      expect(mockPrismaService.post.count).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a post', async () => {
      const dto = { content: 'test content' };
      const userId = 1;
      mockPrismaService.post.create.mockResolvedValue({
        id: 1,
        ...dto,
        authorId: userId,
      });

      const result = await service.create(userId, dto);
      expect(result).toBeDefined();
      expect(mockPrismaService.post.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return post if found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({ id: 1 });
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException if user is not author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 1,
        authorId: 2,
      });
      await expect(service.update(1, 1, { content: 'new' })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should update post if user is author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 1,
        authorId: 1,
      });
      mockPrismaService.post.update.mockResolvedValue({
        id: 1,
        content: 'new',
      });
      const result = await service.update(1, 1, { content: 'new' });
      expect(result.content).toBe('new');
    });
  });

  describe('remove', () => {
    it('should throw ForbiddenException if user is not author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 1,
        authorId: 2,
      });
      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should delete post if user is author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 1,
        authorId: 1,
      });
      mockPrismaService.post.delete.mockResolvedValue({ id: 1 });
      const result = await service.remove(1, 1);
      expect(result.message).toBe('Post successfully deleted');
    });
  });
});
