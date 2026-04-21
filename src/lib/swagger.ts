const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Funble API",
    description: "Funble 홈페이지 API 문서",
    version: "1.0.0",
  },
  servers: [{ url: "/api", description: "API Server" }],
  tags: [
    { name: "Public - Banners", description: "배너 API" },
    { name: "Public - Notices", description: "공지사항 API" },
    { name: "Public - Press", description: "보도자료 API" },
    { name: "Public - Partners", description: "파트너사 API" },
    { name: "Public - Investors", description: "투자사 API" },
    { name: "Public - Stocks", description: "종목 API" },
    { name: "Public - FAQs", description: "FAQ API" },
    { name: "Public - Terms", description: "약관 API" },
    { name: "Public - Announcements", description: "공시 API" },
    { name: "Admin - Auth", description: "관리자 인증" },
    { name: "Admin - Notices", description: "공지사항 관리" },
    { name: "Admin - Stocks", description: "종목 관리" },
    { name: "Admin - Stock Prices", description: "종목 시세 관리" },
    { name: "Admin - FAQ Categories", description: "FAQ 카테고리 관리" },
    { name: "Admin - FAQs", description: "FAQ 관리" },
    { name: "Admin - Announcements", description: "공시 관리" },
    { name: "Admin - Upload", description: "파일 업로드" },
  ],
  paths: {
    // ── Public ──────────────────────────────────────
    "/banners": {
      get: {
        tags: ["Public - Banners"],
        summary: "배너 목록 조회",
        responses: {
          200: {
            description: "활성 배너 목록",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Banner" } } } },
          },
        },
      },
    },
    "/notices": {
      get: {
        tags: ["Public - Notices"],
        summary: "공지사항 목록 조회 (페이지네이션)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "페이지 번호" },
        ],
        responses: {
          200: {
            description: "페이지네이션된 공지사항",
            content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedNotice" } } },
          },
        },
      },
    },
    "/notices/{id}": {
      get: {
        tags: ["Public - Notices"],
        summary: "공지사항 상세 조회",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "공지사항 상세", content: { "application/json": { schema: { $ref: "#/components/schemas/Notice" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/press": {
      get: {
        tags: ["Public - Press"],
        summary: "보도자료 목록 조회",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer" }, description: "최대 개수" },
        ],
        responses: {
          200: { description: "보도자료 목록", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Press" } } } } },
        },
      },
    },
    "/partners": {
      get: {
        tags: ["Public - Partners"],
        summary: "파트너사 목록 조회",
        responses: {
          200: { description: "활성 파트너사 목록", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Partner" } } } } },
        },
      },
    },
    "/investors": {
      get: {
        tags: ["Public - Investors"],
        summary: "투자사 목록 조회",
        responses: {
          200: { description: "활성 투자사 목록", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Investor" } } } } },
        },
      },
    },
    "/stocks": {
      get: {
        tags: ["Public - Stocks"],
        summary: "종목 목록 조회",
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["ing", "expect", "end"] }, description: "상태 필터" },
        ],
        responses: {
          200: { description: "종목 목록", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Stock" } } } } },
        },
      },
    },
    "/stocks/{id}/announcements": {
      get: {
        tags: ["Public - Stocks"],
        summary: "종목별 공시 목록 조회",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        ],
        responses: {
          200: { description: "페이지네이션된 공시 목록", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedAnnouncement" } } } },
        },
      },
    },
    "/stocks/{id}/prices": {
      get: {
        tags: ["Public - Stocks"],
        summary: "종목별 시세 목록 조회",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        ],
        responses: {
          200: { description: "페이지네이션된 시세 목록", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedStockPrice" } } } },
        },
      },
    },
    "/faq-categories": {
      get: {
        tags: ["Public - FAQs"],
        summary: "FAQ 카테고리 목록 조회",
        responses: {
          200: { description: "카테고리 목록", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/FaqCategory" } } } } },
        },
      },
    },
    "/faqs": {
      get: {
        tags: ["Public - FAQs"],
        summary: "FAQ 목록 조회",
        parameters: [
          { name: "category_id", in: "query", schema: { type: "integer" }, description: "카테고리 ID" },
          { name: "search", in: "query", schema: { type: "string" }, description: "검색어 (질문/답변)" },
        ],
        responses: {
          200: { description: "FAQ 목록", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Faq" } } } } },
        },
      },
    },
    "/terms": {
      get: {
        tags: ["Public - Terms"],
        summary: "약관 조회",
        parameters: [
          { name: "type", in: "query", required: true, schema: { type: "string", enum: ["clause", "service", "privacy"] }, description: "약관 종류" },
          { name: "version_date", in: "query", schema: { type: "string" }, description: "버전 날짜 (YYYY.MM.DD)" },
        ],
        responses: {
          200: {
            description: "약관 내용",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    versions: { type: "array", items: { type: "string" } },
                    content: { type: "string" },
                    version_date: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/announcements/{id}": {
      get: {
        tags: ["Public - Announcements"],
        summary: "공시 상세 조회",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "공시 상세 (종목 정보 포함)", content: { "application/json": { schema: { $ref: "#/components/schemas/AnnouncementDetail" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Admin ──────────────────────────────────────
    "/admin/login": {
      post: {
        tags: ["Admin - Auth"],
        summary: "관리자 로그인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: { type: "string", example: "admin" },
                  password: { type: "string", example: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "로그인 성공",
            content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, username: { type: "string" } } } } },
          },
          401: { description: "인증 실패", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/admin/logout": {
      post: {
        tags: ["Admin - Auth"],
        summary: "관리자 로그아웃",
        responses: {
          200: { description: "로그아웃 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
    },
    "/admin/notices": {
      post: {
        tags: ["Admin - Notices"],
        summary: "공지사항 생성",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "생성 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/IdResponse" } } } },
          400: { description: "잘못된 요청", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/admin/notices/{id}": {
      put: {
        tags: ["Admin - Notices"],
        summary: "공지사항 수정",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { title: { type: "string" }, content: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: { description: "수정 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
      delete: {
        tags: ["Admin - Notices"],
        summary: "공지사항 삭제",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "삭제 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
    },
    "/admin/stocks": {
      post: {
        tags: ["Admin - Stocks"],
        summary: "종목 생성",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["funble_cd", "funble_nm"],
                properties: {
                  funble_cd: { type: "string" },
                  funble_nm: { type: "string" },
                  status: { type: "string", enum: ["ing", "expect", "end"], default: "expect" },
                  sort_order: { type: "integer", default: 0 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "생성 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/IdResponse" } } } },
        },
      },
    },
    "/admin/stocks/{id}": {
      put: {
        tags: ["Admin - Stocks"],
        summary: "종목 수정",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  funble_cd: { type: "string" },
                  funble_nm: { type: "string" },
                  status: { type: "string", enum: ["ing", "expect", "end"] },
                  sort_order: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "수정 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
      delete: {
        tags: ["Admin - Stocks"],
        summary: "종목 삭제",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "삭제 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
    },
    "/admin/stock-prices": {
      post: {
        tags: ["Admin - Stock Prices"],
        summary: "시세 생성",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["stock_id", "price", "date"],
                properties: {
                  stock_id: { type: "integer" },
                  price: { type: "number" },
                  date: { type: "string", example: "2025-01-01" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "생성 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/IdResponse" } } } },
        },
      },
    },
    "/admin/stock-prices/{id}": {
      put: {
        tags: ["Admin - Stock Prices"],
        summary: "시세 수정",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  stock_id: { type: "integer" },
                  price: { type: "number" },
                  date: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "수정 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
      delete: {
        tags: ["Admin - Stock Prices"],
        summary: "시세 삭제",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "삭제 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
    },
    "/admin/faq-categories": {
      post: {
        tags: ["Admin - FAQ Categories"],
        summary: "FAQ 카테고리 생성",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "code"],
                properties: {
                  name: { type: "string", example: "자주묻는질문" },
                  code: { type: "string", example: "FREQUENT" },
                  sort_order: { type: "integer", default: 0 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "생성 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/IdResponse" } } } },
        },
      },
    },
    "/admin/faq-categories/{id}": {
      put: {
        tags: ["Admin - FAQ Categories"],
        summary: "FAQ 카테고리 수정",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  code: { type: "string" },
                  sort_order: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "수정 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
      delete: {
        tags: ["Admin - FAQ Categories"],
        summary: "FAQ 카테고리 삭제",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "삭제 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
    },
    "/admin/faqs": {
      post: {
        tags: ["Admin - FAQs"],
        summary: "FAQ 생성",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["category_id", "question"],
                properties: {
                  category_id: { type: "integer" },
                  question: { type: "string" },
                  answer: { type: "string" },
                  sort_order: { type: "integer", default: 0 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "생성 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/IdResponse" } } } },
        },
      },
    },
    "/admin/faqs/{id}": {
      put: {
        tags: ["Admin - FAQs"],
        summary: "FAQ 수정",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  category_id: { type: "integer" },
                  question: { type: "string" },
                  answer: { type: "string" },
                  sort_order: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "수정 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
      delete: {
        tags: ["Admin - FAQs"],
        summary: "FAQ 삭제",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "삭제 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
    },
    "/admin/announcements": {
      post: {
        tags: ["Admin - Announcements"],
        summary: "공시 생성",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["stock_id", "title"],
                properties: {
                  stock_id: { type: "integer" },
                  title: { type: "string" },
                  category: { type: "string" },
                  content: { type: "string" },
                  file_url: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "생성 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/IdResponse" } } } },
        },
      },
    },
    "/admin/announcements/{id}": {
      put: {
        tags: ["Admin - Announcements"],
        summary: "공시 수정",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  stock_id: { type: "integer" },
                  title: { type: "string" },
                  category: { type: "string" },
                  content: { type: "string" },
                  file_url: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "수정 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
      delete: {
        tags: ["Admin - Announcements"],
        summary: "공시 삭제",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "삭제 성공", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        },
      },
    },
    "/admin/upload": {
      post: {
        tags: ["Admin - Upload"],
        summary: "파일 업로드",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "업로드 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: { type: "string" },
                    filename: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
      },
      Success: {
        type: "object",
        properties: { success: { type: "boolean", example: true } },
      },
      IdResponse: {
        type: "object",
        properties: { id: { type: "integer" } },
      },
      Banner: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          image_url: { type: "string" },
          link_url: { type: "string" },
          sort_order: { type: "integer" },
          is_active: { type: "integer" },
          created_at: { type: "string" },
        },
      },
      Notice: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          content: { type: "string" },
          created_at: { type: "string" },
          updated_at: { type: "string" },
        },
      },
      PaginatedNotice: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Notice" } },
          hasNext: { type: "boolean" },
          page: { type: "integer" },
          totalCount: { type: "integer" },
        },
      },
      Press: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          link_url: { type: "string" },
          file_url: { type: "string" },
          notice_at: { type: "string" },
          created_at: { type: "string" },
        },
      },
      Partner: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          logo_url: { type: "string" },
          sort_order: { type: "integer" },
          is_active: { type: "integer" },
        },
      },
      Investor: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          logo_url: { type: "string" },
          sort_order: { type: "integer" },
          is_active: { type: "integer" },
        },
      },
      Stock: {
        type: "object",
        properties: {
          id: { type: "integer" },
          funble_cd: { type: "string" },
          funble_nm: { type: "string" },
          status: { type: "string", enum: ["ing", "expect", "end"] },
          sort_order: { type: "integer" },
          thumb_img_url: { type: "string" },
          scr_price: { type: "number" },
          total_issue_qty: { type: "integer" },
          list_at: { type: "string" },
          extra_json: { type: "string" },
        },
      },
      Announcement: {
        type: "object",
        properties: {
          id: { type: "integer" },
          stock_id: { type: "integer" },
          title: { type: "string" },
          category: { type: "string" },
          content: { type: "string" },
          file_url: { type: "string" },
          created_at: { type: "string" },
        },
      },
      AnnouncementDetail: {
        type: "object",
        properties: {
          id: { type: "integer" },
          stock_id: { type: "integer" },
          title: { type: "string" },
          category: { type: "string" },
          content: { type: "string" },
          file_url: { type: "string" },
          created_at: { type: "string" },
          funble_nm: { type: "string" },
          funble_cd: { type: "string" },
        },
      },
      PaginatedAnnouncement: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Announcement" } },
          hasNext: { type: "boolean" },
          page: { type: "integer" },
          totalCount: { type: "integer" },
        },
      },
      StockPrice: {
        type: "object",
        properties: {
          id: { type: "integer" },
          stock_id: { type: "integer" },
          price: { type: "number" },
          begin_price: { type: "number" },
          end_price: { type: "number" },
          high_price: { type: "number" },
          low_price: { type: "number" },
          deal_qty: { type: "integer" },
          date: { type: "string" },
        },
      },
      PaginatedStockPrice: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/StockPrice" } },
          hasNext: { type: "boolean" },
          page: { type: "integer" },
          totalCount: { type: "integer" },
        },
      },
      FaqCategory: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          code: { type: "string" },
          sort_order: { type: "integer" },
        },
      },
      Faq: {
        type: "object",
        properties: {
          id: { type: "integer" },
          category_id: { type: "integer" },
          question: { type: "string" },
          answer: { type: "string" },
        },
      },
    },
  },
};

export default swaggerSpec;
