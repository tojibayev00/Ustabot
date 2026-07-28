export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1
} as const;

export const PORTFOLIO_IMAGE_LIMITS = {
  MIN: 3,
  MAX: 20
} as const;

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 2 * 1024 * 1024, // 2MB
  ALLOWED_MIME_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const,
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"] as const
} as const;
