import type { Api } from "./types";
import { httpApi } from "./httpClient";

export const api: Api = httpApi;

export * from "./types";
export { ApiError } from "./httpClient";
export { getActiveUser, setActiveUser } from "./session";
