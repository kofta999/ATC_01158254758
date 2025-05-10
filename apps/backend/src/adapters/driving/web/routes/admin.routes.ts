import { authMiddleware } from "@/adapters/driving/web/middleware/auth.middleware";
import { requireRole } from "@/adapters/driving/web/middleware/require-role.middleware";
import { IdSchema } from "@/common/schemas/id-schema";
import { createRoute } from "@hono/zod-openapi";

const tags = ["Admin"];
