// Client cho backend của website hccngaigiao.vn (Express, trả `{ data }`
// khi thành công và `{ error: { code, message } }` khi lỗi).

// Phải trùng với HCC_API_PROXY_PATH trong vite.config.ts
const DEV_PROXY_PATH = "/hcc-api";
const DEFAULT_TIMEOUT_MS = 15000;

const API_BASE_URL = import.meta.env.DEV
    ? DEV_PROXY_PATH
    : (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

export class HccApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly code?: string,
    ) {
        super(message);
        this.name = "HccApiError";
    }
}

type QueryParams = Record<string, string | number | undefined>;

type RequestOptions = {
    params?: QueryParams;
    signal?: AbortSignal;
    timeoutMs?: number;
};

const buildUrl = (path: string, params?: QueryParams): string => {
    const query = new URLSearchParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value !== undefined) {
            query.set(key, String(value));
        }
    });

    const search = query.toString();

    return `${API_BASE_URL}/${path.replace(/^\/+/, "")}${
        search ? `?${search}` : ""
    }`;
};

const readErrorMessage = (
    body: unknown,
): { message?: string; code?: string } => {
    if (typeof body !== "object" || body === null) {
        return {};
    }

    const { error } = body as { error?: { message?: unknown; code?: unknown } };

    return {
        message: typeof error?.message === "string" ? error.message : undefined,
        code: typeof error?.code === "string" ? error.code : undefined,
    };
};

const request = async <T>(
    method: "GET" | "POST",
    path: string,
    {
        params,
        signal,
        timeoutMs = DEFAULT_TIMEOUT_MS,
        body,
    }: RequestOptions & { body?: unknown },
): Promise<T> => {
    if (!API_BASE_URL) {
        throw new HccApiError("Chưa cấu hình VITE_API_BASE_URL", 0);
    }

    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, timeoutMs);
    const abortFromCaller = () => controller.abort();
    signal?.addEventListener("abort", abortFromCaller);

    try {
        let response: Response;

        try {
            response = await fetch(buildUrl(path, params), {
                method,
                signal: controller.signal,
                ...(body === undefined
                    ? {}
                    : {
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(body),
                      }),
            });
        } catch {
            if (signal?.aborted) {
                throw new HccApiError("Đã huỷ yêu cầu", 0, "ABORTED");
            }

            if (timedOut) {
                throw new HccApiError(
                    "Máy chủ phản hồi quá lâu. Vui lòng thử lại.",
                    0,
                    "TIMEOUT",
                );
            }

            throw new HccApiError(
                "Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.",
                0,
                "NETWORK",
            );
        }

        const responseBody: unknown = await response.json().catch(() => null);

        if (!response.ok) {
            const { message, code } = readErrorMessage(responseBody);

            throw new HccApiError(
                message ?? `Máy chủ trả lỗi ${response.status}`,
                response.status,
                code,
            );
        }

        if (
            typeof responseBody !== "object" ||
            responseBody === null ||
            !("data" in responseBody)
        ) {
            throw new HccApiError("Phản hồi không hợp lệ", response.status);
        }

        return (responseBody as { data: T }).data;
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abortFromCaller);
    }
};

/** GET một endpoint và trả về trường `data` của response. */
export const hccGet = <T>(path: string, options: RequestOptions = {}) =>
    request<T>("GET", path, options);

/** POST JSON tới một endpoint và trả về trường `data` của response. */
export const hccPost = <T>(
    path: string,
    body: unknown,
    options: Omit<RequestOptions, "params"> = {},
) => request<T>("POST", path, { ...options, body });
