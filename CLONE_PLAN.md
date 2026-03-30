# 펀블(Funble) 홈페이지 클론 계획서

## 프로젝트 개요

- **원본 사이트**: https://www.funble.kr
- **기술 스택**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + SQLite (better-sqlite3)
- **목표**: 아래 클론 범위의 페이지를 UI/UX 동일하게 클론
- **DB**: 원본은 외부 API로 데이터를 불러오지만, 클론에서는 SQLite로 로컬 DB를 구축하여 Next.js API Route로 제공

---

## 클론 범위 (6개 페이지)

| # | 페이지 | 원본 URL | 클론 라우트 |
|---|--------|----------|-------------|
| 1 | 펀블 (메인) | https://www.funble.kr | `/` |
| 2 | 펀블소개 | https://www.funble.kr/funble | `/funble` |
| 3 | 공지사항 | https://www.funble.kr/notice | `/notice` |
| 4 | 공시정보 (모든정보) | https://www.funble.kr/announce | `/announce` |
| 5 | 고객지원 / FAQ | https://www.funble.kr/faq | `/faq` |
| 6 | 공통 | - | Header / Footer |
| 7 | 서비스이용약관 | https://www.funble.kr/clause | `/clause` |
| 8 | 전자금융거래이용약관 | https://www.funble.kr/service | `/service` |
| 9 | 개인정보처리방침 | https://www.funble.kr/privacy | `/privacy` |
| 10 | 어드민 | - | `/admin` (로그인 + 관리 대시보드) |

---

## 페이지별 상세 구조

### 1. 메인 페이지 (`/`)

- **Hero 배너**: 3개 슬라이드 캐러셀 (자동 재생 7초, 전환 700ms)
- **메인 태그라인**: "생애 첫 건물은 펀블에서" / "건물 투자를 가장 쉽게 하는 방법. 펀블."
- **섹션 1 - 초기 청약**: "뭉쳐야 산다! 누구나 건물투자" + 폰 목업
- **섹션 2 - 마켓 거래**: "휙! 사고, 힙!하게 판다." + 폰 목업
- **섹션 3 - 포트폴리오**: "나만의 자산 포트폴리오 구축"
- **섹션 4 - 배당 수익**: "배당수익을 쌓아 두번째 월급을 만들어요."
- **섹션 5 - 투자 간편성**: "너무 쉬운 투자"
- **섹션 6 - 세금 안내**: "세금은 하나로, 수익은 최대로"
- **Partners**: 파트너 로고 10개 (DB에서 조회)
- **Investors**: 투자자 로고 5개 (DB에서 조회)
- **Newsroom**: 최근 보도자료 3건 (DB에서 조회) + "더보기" 버튼
- **채용 CTA**: "펀블을 가장 먼저 만나보세요!"

### 2. 펀블소개 (`/funble`)

- **TEAM MISSION** 섹션 (3가지 핵심 가치)
  - **Fair Opportunity (공정한 기회)**: 모든 사람이 부동산 자산에 주식처럼 지분 투자 가능
  - **Safe & Transparent (안전성과 투명성)**: 블록체인 기술 기반의 부동산금융 플랫폼
  - **Easy & Fun (사용 편의성)**: 전문 지식 없이도 접근 가능한 시스템
- **연락처 정보**
  - 주소: 서울시 영등포구 의사당대로 83, 서울핀테크랩 18층
  - 전화: 1661-3258
  - 이메일: contact@funble.kr
- **앱 다운로드 섹션**: 플레이스토어 / 앱스토어 / QR코드

### 3. 공지사항 (`/notice`)

- **공지사항 리스트**: 게시물 ID, 제목, 작성일자 (YYYY-MM-DD)
- **상세 보기**: 제목 클릭 시 상세 내용 표시
- **페이지네이션**: 이전/다음 버튼
- **목록으로 돌아가기** 기능
- 데이터: DB `notices` 테이블에서 조회

### 4. 공시정보 - 모든정보 (`/announce`)

- **탭 시스템**: "공시" / "기준가" 2개 탭 전환
- **종목 필터**: 상태별 분류
  - 진행 중 (ing)
  - 예정 (expect)
  - 완료 (end)
- **종목 선택**: funbleCd(코드) + funbleNm(이름) 클릭 시 해당 종목 공시 표시
- **공시 목록**: 제목, 분류, 날짜
- **기준가 목록**: 종목별 기준가 정보
- **페이지네이션**: 7개 항목씩 페이징, 이전/다음 네비게이션
- 데이터: DB `stocks`, `announcements`, `stock_prices` 테이블에서 조회

### 5. FAQ (`/faq`)

- **검색 기능**: 질문/답변 실시간 검색 입력 필드
- **8개 카테고리 탭**:
  1. 자주묻는질문
  2. 서비스 이용
  3. 가입/회원정보
  4. 간편인증
  5. 입출금
  6. 청약/매매
  7. 배당/세금
  8. 수익자 총회
- **아코디언 UI**: Q(질문) 클릭 → A(답변) 확장/축소
- 데이터: DB `faq_categories`, `faqs` 테이블에서 조회

### 6. 서비스이용약관 (`/clause`)

- 펀블 서비스 이용약관 전문
- 정적 컨텐츠 페이지

### 7. 전자금융거래이용약관 (`/service`)

- 전자금융거래 이용약관 전문
- 정적 컨텐츠 페이지

### 8. 개인정보처리방침 (`/privacy`)

- 개인정보처리방침 전문
- 정적 컨텐츠 페이지

### 9. 공통 컴포넌트

#### Header
- 펀블 로고 (좌측, 클릭 시 메인 이동)
- 네비게이션 메뉴: 펀블소개, 공지사항, 공시정보, 고객지원(FAQ)
- 소셜 링크 아이콘 (블로그, 유튜브, 플레이스토어, 앱스토어)

#### Footer
- 펀블 로고
- 회사 정보 (주소, 전화, 이메일)
- 다운로드 CTA
- 링크 모음

### 7. 어드민 (`/admin`)

공지사항, 공시정보, FAQ를 관리할 수 있는 간단한 관리자 페이지.

#### 인증
- **로그인 페이지** (`/admin/login`): 아이디 + 비밀번호 폼
- DB `admin_users` 테이블에서 인증 (비밀번호는 bcrypt 해시 저장)
- 로그인 성공 시 JWT 토큰 발급 → 쿠키에 저장
- 미인증 상태로 `/admin/*` 접근 시 `/admin/login`으로 리다이렉트
- Next.js middleware로 어드민 라우트 보호

#### 대시보드 (`/admin`)
- 간단한 사이드바 네비게이션: 공지사항 / 공시정보 / FAQ
- 각 메뉴별 CRUD 관리 화면

#### 공지사항 관리 (`/admin/notices`)
- **목록**: 제목, 작성일, 수정/삭제 버튼
- **작성/수정**: 제목 + 내용(textarea) 입력 폼
- **삭제**: 확인 후 삭제

#### 공시정보 관리 (`/admin/announce`)
- **종목 관리**: 종목 코드/이름/상태 CRUD
- **공시 작성/수정**: 종목 선택 + 제목 + 분류 + 내용 폼
- **기준가 등록**: 종목 선택 + 기준가 + 기준일 입력
- **삭제**: 확인 후 삭제

#### FAQ 관리 (`/admin/faq`)
- **카테고리 관리**: 카테고리명 추가/수정/삭제
- **FAQ 작성/수정**: 카테고리 선택 + 질문 + 답변(textarea) 폼
- **정렬 순서** 변경 가능
- **삭제**: 확인 후 삭제

---

## SQLite 데이터베이스 설계

### 개요
원본 사이트의 외부 API를 **SQLite** (`better-sqlite3`)로 대체. 프로젝트 내 `funble.db` 파일로 관리하고 Next.js API Route로 제공.

### 테이블 설계

#### 1. `banners` - 히어로 배너
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 배너 ID |
| title | TEXT | 배너 제목 |
| image_url | TEXT | 배너 이미지 경로 |
| link_url | TEXT | 클릭 시 이동 URL |
| sort_order | INTEGER | 정렬 순서 |
| is_active | INTEGER | 활성화 여부 (0/1) |
| created_at | TEXT | 생성일시 |

#### 2. `notices` - 공지사항
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 공지 ID |
| title | TEXT | 공지 제목 |
| content | TEXT | 공지 내용 (HTML) |
| created_at | TEXT | 작성일 (YYYY-MM-DD) |

#### 3. `press` - 뉴스룸 보도자료
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 보도자료 ID |
| title | TEXT | 기사 제목 |
| link_url | TEXT | 외부 기사 링크 |
| notice_at | TEXT | 보도 날짜 |
| created_at | TEXT | 생성일시 |

#### 4. `partners` - 파트너사
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 파트너 ID |
| name | TEXT | 파트너명 |
| logo_url | TEXT | 로고 이미지 경로 |
| sort_order | INTEGER | 정렬 순서 |
| is_active | INTEGER | 활성화 여부 (0/1) |

#### 5. `investors` - 투자자
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 투자자 ID |
| name | TEXT | 투자자명 |
| logo_url | TEXT | 로고 이미지 경로 |
| sort_order | INTEGER | 정렬 순서 |
| is_active | INTEGER | 활성화 여부 (0/1) |

#### 6. `stocks` - 종목 (공시정보용)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 종목 ID |
| funble_cd | TEXT | 종목 코드 |
| funble_nm | TEXT | 종목 이름 |
| status | TEXT | 상태 (ing/expect/end) |
| sort_order | INTEGER | 정렬 순서 |

#### 7. `announcements` - 공시 내역
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 공시 ID |
| stock_id | INTEGER FK | 종목 ID (stocks.id) |
| title | TEXT | 공시 제목 |
| category | TEXT | 공시 분류 |
| content | TEXT | 공시 내용 |
| created_at | TEXT | 공시일 |

#### 8. `stock_prices` - 기준가
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 기준가 ID |
| stock_id | INTEGER FK | 종목 ID (stocks.id) |
| price | INTEGER | 기준가 |
| date | TEXT | 기준일 |

#### 9. `faq_categories` - FAQ 카테고리
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 카테고리 ID |
| name | TEXT | 카테고리명 |
| sort_order | INTEGER | 정렬 순서 |

#### 10. `faqs` - FAQ 항목
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | FAQ ID |
| category_id | INTEGER FK | 카테고리 ID |
| question | TEXT | 질문 |
| answer | TEXT | 답변 (HTML) |
| sort_order | INTEGER | 정렬 순서 |

#### 11. `admin_users` - 관리자 계정
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 관리자 ID |
| username | TEXT UNIQUE | 아이디 |
| password_hash | TEXT | 비밀번호 (bcrypt 해시) |
| created_at | TEXT | 생성일시 |

### API Routes

| 엔드포인트 | 메서드 | 설명 |
|------------|--------|------|
| `/api/banners` | GET | 활성 배너 목록 |
| `/api/notices` | GET | 공지사항 목록 (페이지네이션: `?page=1`) |
| `/api/notices/[id]` | GET | 공지사항 상세 |
| `/api/press` | GET | 최근 보도자료 3건 |
| `/api/partners` | GET | 파트너사 목록 |
| `/api/investors` | GET | 투자자 목록 |
| `/api/stocks` | GET | 종목 목록 (`?status=ing`) |
| `/api/stocks/[id]/announcements` | GET | 종목별 공시 목록 (페이지네이션) |
| `/api/stocks/[id]/prices` | GET | 종목별 기준가 목록 |
| `/api/faq-categories` | GET | FAQ 카테고리 목록 |
| `/api/faqs` | GET | FAQ 목록 (`?category_id=1&search=키워드`) |
| | | |
| **어드민 API** | | **(JWT 인증 필요)** |
| `/api/admin/login` | POST | 로그인 (`{ username, password }` → JWT 쿠키) |
| `/api/admin/logout` | POST | 로그아웃 (쿠키 삭제) |
| `/api/admin/notices` | POST | 공지사항 작성 |
| `/api/admin/notices/[id]` | PUT | 공지사항 수정 |
| `/api/admin/notices/[id]` | DELETE | 공지사항 삭제 |
| `/api/admin/stocks` | POST | 종목 등록 |
| `/api/admin/stocks/[id]` | PUT / DELETE | 종목 수정/삭제 |
| `/api/admin/announcements` | POST | 공시 작성 |
| `/api/admin/announcements/[id]` | PUT / DELETE | 공시 수정/삭제 |
| `/api/admin/stock-prices` | POST | 기준가 등록 |
| `/api/admin/stock-prices/[id]` | PUT / DELETE | 기준가 수정/삭제 |
| `/api/admin/faq-categories` | POST | FAQ 카테고리 추가 |
| `/api/admin/faq-categories/[id]` | PUT / DELETE | FAQ 카테고리 수정/삭제 |
| `/api/admin/faqs` | POST | FAQ 작성 |
| `/api/admin/faqs/[id]` | PUT / DELETE | FAQ 수정/삭제 |

### DB 초기화 & 시드

- `src/lib/db.ts` - DB 연결 싱글턴 + 테이블 자동 생성
- `scripts/seed.ts` - 기본 관리자 계정 생성: `admin` / `funble1234` (bcrypt 해시)
- DB 파일: 프로젝트 루트 `funble.db` (`.gitignore`에 추가)
- JWT 시크릿: 환경변수 `JWT_SECRET` (`.env.local`에 설정)

### 데이터 크롤링 (원본 사이트 API → SQLite 시드)

원본 사이트의 실제 데이터를 크롤링하여 SQLite에 삽입하는 스크립트: `scripts/crawl.ts`

`npx tsx scripts/crawl.ts` 로 실행하면 아래 API를 순서대로 호출하여 DB에 저장.

#### 원본 API 엔드포인트 목록

| # | API URL | 설명 | 비고 |
|---|---------|------|------|
| 1 | `GET /api/co/v1/support/notices?page={n}` | 공지사항 (페이지네이션) | `hasNext`로 반복 |
| 2 | `GET /api/co/v1/community/pressmanagement/PRESS?page={n}` | 보도자료 (페이지네이션) | `hasNext`로 반복 |
| 3 | `GET /api/co/v1/community/pressmanagement/MAIN` | 메인 배너 | - |
| 4 | `GET /api/main/v1/subscribe/all_info` | 전체 종목 목록 | `ing`, `end`, `expect` 분류 |
| 5 | `GET /api/main/v1/stock/detail/{funbleCd}` | 종목별 상세 + 공시 내역 | 종목별 반복 |
| 6 | `GET /api/main/v1/stock/dailyQuote/{funbleCd}?page={n}` | 종목별 기준가 (페이지네이션) | 종목별 × 페이지 |
| 7 | `GET /api/co/v1/support/faqs` | FAQ 카테고리 + 목록 | 카테고리 코드 포함 |

#### 원본 API 응답 구조

**공지사항** (`/api/co/v1/support/notices`)
```json
{
  "hasNext": true,
  "data": [
    { "id": 119, "title": "...", "detail": "<p>HTML</p>", "searchNo": 69,
      "createdAt": "2025-09-22T15:36:06", "updatedAt": "2026-03-04T16:17:32" }
  ]
}
```

**보도자료** (`/api/co/v1/community/pressmanagement/PRESS`)
```json
{
  "hasNext": true,
  "data": [
    { "id": 414, "title": "...", "linkUrl": "https://...",
      "noticeAt": "2025-07-31T18:40:00", "fileUrl": "https://s3...png" }
  ]
}
```

**종목 목록** (`/api/main/v1/subscribe/all_info`)
```json
{
  "ing": [],
  "end": [
    { "id": 5, "stock": { "funbleCd": "FB2412111", "funbleNm": "더 코노셔 여의도 1호", ... },
      "scrPrice": 5000, "totalIssueQty": 76000, "thumbImgUrl": "...", ... }
  ],
  "expect": []
}
```

**종목 상세 + 공시** (`/api/main/v1/stock/detail/{funbleCd}`)
- 종목 기본 정보, 첨부파일, 공시 내역 24건+ 포함

**기준가** (`/api/main/v1/stock/dailyQuote/{funbleCd}`)
```json
{
  "hasNext": true,
  "data": [
    { "stockPriceId": { "funbleCd": "FB2412111", "at": [2025,8,14] },
      "endPrice": 5200, "dealStdPrice": 5000, "dealQty": 1128, ... }
  ]
}
```

**FAQ** (`/api/co/v1/support/faqs`)
```json
{
  "categoriesEng": "FUNBLE_PLATFORM, MEMBER_ACCOUNT, ...",
  "categoriesKo": "펀블플랫폼, 회원계정, ...",
  "hasNext": false,
  "data": []
}
```
> FAQ는 현재 API에서 data가 빈 배열 → 원본 HTML에 하드코딩된 데이터를 별도 파싱하거나 수동 입력 필요

#### 크롤링 스크립트 흐름

```
scripts/crawl.ts
│
├─ 1. DB 테이블 초기화 (기존 데이터 삭제)
├─ 2. 공지사항 크롤링 (page 1,2,3... hasNext=false까지)
├─ 3. 보도자료 크롤링 (page 1,2,3... hasNext=false까지)
├─ 4. 배너 크롤링
├─ 5. 종목 목록 크롤링 (all_info → ing/end/expect)
├─ 6. 종목별 상세 + 공시 크롤링 (각 funbleCd마다)
├─ 7. 종목별 기준가 크롤링 (각 funbleCd × 페이지)
├─ 8. FAQ 크롤링 (API + HTML 파싱 병행)
├─ 9. 관리자 계정 생성 (admin / funble1234)
└─ 완료 로그 출력
```

---

## 구현 계획

### Phase 1: 프로젝트 기반 설정
1. 추가 패키지 설치 (`swiper`, `react-icons`, `better-sqlite3`, `@types/better-sqlite3`, `bcryptjs`, `@types/bcryptjs`, `jsonwebtoken`, `@types/jsonwebtoken`)
2. 글로벌 스타일 설정 (폰트, 색상)
3. 반응형 브레이크포인트 (모바일 ~719px / 데스크톱 720px+)
4. SQLite DB 초기화 (`src/lib/db.ts`) + 시드 스크립트 작성
5. 크롤링 스크립트 작성 (`scripts/crawl.ts`) → 원본 API 데이터 수집 및 DB 삽입

### Phase 2: 공통 컴포넌트
5. `Header` (로고 + 네비게이션 메뉴 + 소셜 링크)
6. `Footer` (회사 정보 + 링크)
7. `Button`, `SectionWrapper` 공통 컴포넌트

### Phase 3: 메인 페이지 (`/`)
8. Hero 배너 캐러셀 (DB → API → Swiper)
9. 메인 태그라인 + 6개 소개 섹션
10. Partners / Investors 로고 그리드 (DB → API)
11. Newsroom 카드 리스트 (DB → API)
12. 채용 CTA 섹션

### Phase 4: 서브 페이지
13. 펀블소개 (`/funble`) - Team Mission + 연락처 + 앱 다운로드
14. 공지사항 (`/notice`) - 리스트 + 상세 + 페이지네이션 (DB → API)
15. 공시정보 (`/announce`) - 탭(공시/기준가) + 종목 필터 + 페이지네이션 (DB → API)
16. FAQ (`/faq`) - 카테고리 탭 + 검색 + 아코디언 (DB → API)

### Phase 5: 어드민 페이지
17. 어드민 인증 (로그인 페이지 + JWT + middleware 라우트 보호)
18. 어드민 대시보드 레이아웃 (사이드바 + 콘텐츠 영역)
19. 공지사항 관리 (목록 + 작성/수정 폼 + 삭제)
20. 공시정보 관리 (종목 CRUD + 공시 CRUD + 기준가 등록)
21. FAQ 관리 (카테고리 CRUD + FAQ CRUD + 정렬)

### Phase 6: 인터랙션 & 마무리
22. 스크롤 애니메이션 (Intersection Observer)
23. 모바일 반응형 레이아웃
24. 이미지 최적화 (Next.js Image)
25. SEO 메타 태그 + 최종 QA

---

## 파일 구조 (예상)

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Header + Footer 포함)
│   ├── page.tsx                # 메인 페이지
│   ├── globals.css
│   ├── funble/
│   │   └── page.tsx            # 펀블소개
│   ├── notice/
│   │   └── page.tsx            # 공지사항
│   ├── announce/
│   │   └── page.tsx            # 공시정보
│   ├── faq/
│   │   └── page.tsx            # FAQ
│   ├── admin/
│   │   ├── layout.tsx          # 어드민 레이아웃 (사이드바)
│   │   ├── page.tsx            # 어드민 대시보드
│   │   ├── login/
│   │   │   └── page.tsx        # 로그인 페이지
│   │   ├── notices/
│   │   │   └── page.tsx        # 공지사항 관리
│   │   ├── announce/
│   │   │   └── page.tsx        # 공시정보 관리
│   │   └── faq/
│   │       └── page.tsx        # FAQ 관리
│   └── api/
│       ├── banners/route.ts
│       ├── notices/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── press/route.ts
│       ├── partners/route.ts
│       ├── investors/route.ts
│       ├── stocks/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── announcements/route.ts
│       │       └── prices/route.ts
│       ├── faq-categories/route.ts
│       ├── faqs/route.ts
│       └── admin/
│           ├── login/route.ts
│           ├── logout/route.ts
│           ├── notices/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           ├── stocks/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           ├── announcements/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           ├── stock-prices/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           ├── faq-categories/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           └── faqs/
│               ├── route.ts
│               └── [id]/route.ts
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Button.tsx
│   ├── home/                   # 메인 페이지 섹션들
│   │   ├── HeroBanner.tsx
│   │   ├── MainTagline.tsx
│   │   ├── SubscriptionSection.tsx
│   │   ├── MarketSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── DividendSection.tsx
│   │   ├── EasyInvestSection.tsx
│   │   ├── TaxSection.tsx
│   │   ├── PartnersSection.tsx
│   │   ├── InvestorsSection.tsx
│   │   ├── NewsroomSection.tsx
│   │   └── RecruitSection.tsx
│   ├── notice/
│   │   ├── NoticeList.tsx
│   │   └── NoticeDetail.tsx
│   ├── announce/
│   │   ├── StockFilter.tsx
│   │   ├── AnnounceList.tsx
│   │   └── PriceList.tsx
│   └── faq/
│       ├── FaqSearch.tsx
│       ├── FaqCategoryTabs.tsx
│       └── FaqAccordion.tsx
├── lib/
│   ├── db.ts                   # SQLite 연결 + 테이블 초기화
│   └── auth.ts                 # JWT 생성/검증 + bcrypt 유틸
├── middleware.ts                # /admin/* 라우트 JWT 인증 체크
├── hooks/
│   └── useIntersectionObserver.ts
└── types/
    └── index.ts
scripts/
├── crawl.ts                    # 원본 API 크롤링 → DB 시드
└── seed.ts                     # 관리자 계정 생성 + 수동 데이터
funble.db                       # SQLite DB (gitignore)
public/
├── images/
│   ├── logo/
│   ├── banners/
│   ├── phone-mockups/
│   ├── partners/
│   └── investors/
└── fonts/
```

---

## 참고 사항

- **이미지**: 원본 사이트 이미지는 저작권 있으므로 플레이스홀더 또는 별도 확보 필요
- **폰트**: Pretendard 또는 Noto Sans KR 추정, 확인 후 적용
- **색상**: 원본 사이트 기준 색상 코드 추출 필요
- **앱 링크**: `app_link()` 함수는 모의 구현
- **DB**: SQLite(`better-sqlite3`), `funble.db`로 관리, 시드 스크립트로 샘플 데이터 삽입
- **API**: 모든 동적 데이터는 Next.js API Route → SQLite로 제공
