import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrap successful response correctly', (done) => {
    const data = { id: 1, name: 'Test' };
    const context = {} as ExecutionContext;
    const next = {
      handle: () => of(data),
    } as CallHandler;

    interceptor.intercept(context, next).subscribe((response) => {
      expect(response).toEqual({
        success: true,
        message: 'Operation successful',
        data,
      });
      done();
    });
  });

  it('should use custom message if provided in data', (done) => {
    const data = { message: 'Custom success message', data: { id: 1 } };
    const context = {} as ExecutionContext;
    const next = {
      handle: () => of(data),
    } as CallHandler;

    interceptor.intercept(context, next).subscribe((response) => {
      expect(response).toEqual({
        success: true,
        message: 'Custom success message',
        data: { id: 1 },
      });
      done();
    });
  });
});
