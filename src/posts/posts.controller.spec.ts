import { Test, TestingModule } from '@nestjs/testing';
import { PostsController, AuthenticatedRequest } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call postsService.create', async () => {
      const dto = { content: 'test content' };
      const req = { user: { userId: 1 } };
      await controller.create(req as unknown as AuthenticatedRequest, dto);
      expect(mockPostsService.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('findAll', () => {
    it('should call postsService.findAll with default parameters', async () => {
      const query = { page: 1, limit: 10 };
      await controller.findAll(query);
      expect(mockPostsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call postsService.findOne', async () => {
      await controller.findOne(1);
      expect(mockPostsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call postsService.update', async () => {
      const dto = { content: 'updated' };
      const req = { user: { userId: 1 } };
      await controller.update(1, req as unknown as AuthenticatedRequest, dto);
      expect(mockPostsService.update).toHaveBeenCalledWith(1, 1, dto);
    });
  });

  describe('remove', () => {
    it('should call postsService.remove', async () => {
      const req = { user: { userId: 1 } };
      await controller.remove(1, req as unknown as AuthenticatedRequest);
      expect(mockPostsService.remove).toHaveBeenCalledWith(1, 1);
    });
  });
});
