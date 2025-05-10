import { type InferRequestType, type InferResponseType, hc } from "hono/client";
import type _app from "./app";

// this is a trick to calculate the type when compiling
const _client = hc<typeof _app>("");
export type Client = typeof _client;

export function hcWithType(...args: Parameters<typeof hc>): Client {
	return hc<typeof _app>(...args);
}

export type { InferRequestType, InferResponseType };
