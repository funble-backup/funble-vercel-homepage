# Funble Homepage

펀블 공식 홈페이지 + 관리자 페이지

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **스타일링**: Tailwind CSS
- **DB (로컬)**: SQLite (better-sqlite3)
- **DB (운영)**: Turso (libSQL, SQLite 호환)
- **배포**: Vercel (도쿄 리전)

## 아키텍처

```
로컬 개발 (DEV)                    운영 (PRD)
┌──────────────┐               ┌──────────────┐
│  Next.js Dev │               │   Vercel     │
│   Server     │               │  Serverless  │
│              │               │  (hnd1)      │
│  ┌────────┐  │               │              │
│  │ SQLite │  │               │  ┌────────┐  │
│  │funble  │  │               │  │ Turso  │  │
│  │ .db    │  │               │  │(도쿄)   │  │
│  └────────┘  │               │  └────────┘  │
└──────────────┘               └──────────────┘
```

- `TURSO_DATABASE_URL` 환경변수 유무로 자동 분기
- 로컬: SQLite 직접 읽기/쓰기
- 운영: Turso 원격 DB (sleep 없음, SQLite 호환)

## 환경변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `TURSO_DATABASE_URL` | Turso DB URL (`libsql://...`) | 운영만 |
| `TURSO_DATABASE_TOKEN` | Turso 인증 토큰 | 운영만 |
| `ADMIN_USERNAME` | 관리자 아이디 | O |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | O |

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local`에 `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`을 설정합니다.
Turso 변수를 설정하지 않으면 로컬 SQLite를 사용합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

- 홈페이지: http://localhost:3000
- 관리자: http://localhost:3000/admin/login

## 관리자 페이지

`/admin`에서 다음 항목을 관리할 수 있습니다:

| 메뉴 | 기능 |
|------|------|
| 메인배너 | PC/모바일 이미지 업로드, 클릭 링크, 정렬, 활성/비활성 |
| 공지사항 | WYSIWYG 에디터로 작성/수정/삭제 |
| 공시정보 | 종목/공시/기준가 CRUD, 첨부파일 업로드 |
| FAQ | 카테고리 및 FAQ 항목 관리 |

### DEV / PRD 구분

관리자 사이드바 헤더에 현재 환경이 표시됩니다:
- **DEV** (초록) — SQLite 사용 중
- **PRD** (빨강) — Turso 사용 중

## 배포

Vercel에 자동 배포됩니다. 환경변수를 Vercel 대시보드에서 설정한 뒤 배포하세요.

### Turso 데이터 마이그레이션

로컬 SQLite 데이터를 Turso에 올리려면:

```bash
npx tsx scripts/migrate-to-turso.ts
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 홈페이지
│   ├── admin/                # 관리자 페이지
│   │   ├── banners/          # 배너 관리
│   │   ├── notices/          # 공지사항 관리
│   │   ├── announce/         # 공시정보 관리
│   │   └── faq/              # FAQ 관리
│   └── api/
│       ├── banners/          # 배너 API (공개)
│       ├── notices/          # 공지 API (공개)
│       ├── stocks/           # 종목 API (공개)
│       └── admin/            # 관리자 API (인증 필요)
│           ├── login/
│           ├── banners/
│           ├── notices/
│           ├── announcements/
│           ├── stock-prices/
│           ├── upload/       # 파일 업로드
│           └── env/          # 환경 정보
├── components/               # UI 컴포넌트
├── lib/
│   ├── db.ts                 # DB 추상화 (SQLite/Turso 자동 분기)
│   └── auth.ts               # JWT 인증
└── types/                    # TypeScript 타입 정의
```
