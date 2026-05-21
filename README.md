# Test Node.js Backend Engineer - Soal 1

## Cara Menjalankan Aplikasi secara Local

1. Install Dependencies

```bash
npm install
```

2. Setup Environment Variable

```bash
cp .env.example .env
```

3. Menjalankan Database

```bash
docker compose up -d
```

4. Push Schema

```bash
npx prisma db push
```

5. Generate Prisma Client

```bash
npx prisma generate
```

6. Seed Data

```
npx prisma db seed
```

7. Menjalankan Aplikasi

```bash
npm run start
```

Aplikasi akan berjalan di `http://localhost:3000` secara default.

## Daftar Endpoint

- `POST /auth/register` - Mendaftarkan user baru
- `POST /auth/login` - Login untuk mendapatkan JWT Token
- `GET /posts` - Mendapatkan daftar post
- `GET /posts/:id` - Mendapatkan detail post
- `POST /posts` - Membuat post baru
- `PUT /posts/:id` - Mengupdate post
- `DELETE /posts/:id` - Menghapus post

Dokumentasi API dapat dilihat di `http://localhost:3000/api`.

## Tech Stack

- Framework: NestJS
- Database: MySQL
- ORM: Prisma
- Testing: Jest
- Validation: Zod dengan nestjs-zod
- Authentication: JWT dengan passport
- Documentation: Swagger
