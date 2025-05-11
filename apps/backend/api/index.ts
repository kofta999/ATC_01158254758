import { handle } from "hono/vercel";
// @ts-expect-error
import app from "../dist/src/app.js";

export default handle(app);
