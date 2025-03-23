# Gatekeeper Design Pattern

## 1. Giới Thiệu
### ✔ Khái niệm
**Gatekeeper** là một design pattern dùng để **kiểm soát truy cập** vào một hệ thống hoặc một tài nguyên nhất định. 

### ✔ Mục Đích
- Bảo vệ hệ thống khỏi truy cập trái phép.
- Xác thực và phân quyền người dùng.
- Kiểm soát lưu lượng truy cập (rate limiting).
- Logging và monitoring.

---

## 2. Kiến Trúc
### ✅ Mô Hình Hoạt Động
1. **Client** gửi request.
2. **Gatekeeper** kiểm tra request (xác thực, phân quyền, filter...).
3. Nếu hợp lệ, request được chuyển đến backend.
4. Backend xử lý và trả kết quả.

### ✅ Minh Họa Kiến Trúc
```
[Client] → [Gatekeeper] → [Backend Service]
```

---

## 3. Các Cách Triển Khai

### 🔍 1. Middleware (NestJS/Express)
- Dùng để kiểm tra request ngay khi nó đi vào server.
- Triển khai bằng **NestJS Middleware**:
```typescript
import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GatekeeperMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['x-api-key']) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}
```

### 🔍 2. Guard (NestJS Guard)
- Bảo vệ từng route dựa vào quyền người dùng.
- Triển khai bằng **NestJS Guard**:
```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.headers['authorization'] === 'Bearer valid-token';
  }
}
```

### 🔍 3. API Gateway (Kong/Nginx)
- Gatekeeper để bảo vệ API backend.
- Triển khai bằng **Nginx**:
```nginx
server {
    location /api/ {
        set $allowed_key "secret123";
        if ($http_x_api_key != $allowed_key) {
            return 403;
        }
        proxy_pass http://backend;
    }
}
```

### 🔍 4. Service trong Microservices
- Gatekeeper được triển khai như một service tách biệt.
- **Kiến trúc**:
```
[Client] → [Gatekeeper Service] → [User Service]
```
- Triển khai bằng **NestJS Microservices**:
```typescript
import { Transport } from '@nestjs/microservices';

app.connectMicroservice({
  transport: Transport.RMQ,
  options: { urls: ['amqp://localhost:5672'], queue: 'auth_queue' }
});
```

---

## 4. So Sánh Các Cách Triển Khai

| Cách Triển Khai | Khi Nào Dùng? |
|----------------|----------------|
| Middleware | Kiểm tra API Key/JWT đơn giản |
| Guard | Phân quyền theo route |
| API Gateway | Kiểm soát truy cập tập trung |
| Microservice | Kiểm soát truy cập trong microservices |

---

## 5. Ưu Điểm & Nhược Điểm

### ✅ Ưu Điểm
- **Bảo mật cao**: Ngăn chặn truy cập trái phép ngay từ đầu.
- **Linh hoạt**: Có thể triển khai ở nhiều cấp độ khác nhau (middleware, guard, service, API gateway).
- **Dễ mở rộng**: Có thể tích hợp với các hệ thống xác thực và phân quyền.
- **Tối ưu hiệu suất**: Giảm tải cho backend bằng cách chặn request không hợp lệ sớm.
- **Hỗ trợ logging & monitoring**: Giúp theo dõi hoạt động của hệ thống dễ dàng.

### ❌ Nhược Điểm
- **Tăng độ phức tạp**: Phải thiết kế và triển khai một cơ chế kiểm soát hợp lý.
- **Ảnh hưởng hiệu suất nếu không tối ưu**: Nếu kiểm tra quá nhiều bước có thể làm chậm hệ thống.
- **Dễ trở thành single point of failure**: Nếu Gatekeeper bị lỗi, toàn bộ hệ thống có thể bị gián đoạn.

---

## 6. Kết Luận
- **Gatekeeper Pattern** là giải pháp quan trọng để bảo vệ hệ thống.
- Có nhiều cách triển khai tùy thuộc vào nhu cầu cụ thể.
- **Kế hoạch tiếp theo**: Triển khai demo trong dự án NestJS. 🚀

