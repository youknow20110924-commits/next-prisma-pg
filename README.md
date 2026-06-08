# Next.js + TypeScript + PostgreSQL + Prisma + React

## 프로젝트 구성

- Node.js
- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma ORM
- Git

## 실행 방법

```bash
npm install
npm run prisma-generate
npm run dev-host

## 개발 서버 접속
http://localhost:3000
http://리눅스IP:3000


## 주요 API
GET  /api/users
POST /api/users


## 환경변수
.env.example을 참고해서 .env 파일을 생성해야 합니다.
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public"

