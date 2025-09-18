-- Enable pgvector for semantic search features
CREATE EXTENSION IF NOT EXISTS "vector";

-- Ensure the embedding column stores vectors with 1536 dimensions
ALTER TABLE "Embedding"
  ALTER COLUMN "vector" TYPE vector(1536);
