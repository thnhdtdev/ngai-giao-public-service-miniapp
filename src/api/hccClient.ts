// Client cho backend của website hccngaigiao.vn (Express, trả `{ data }`
// khi thành công và `{ error: { code, message } }` khi lỗi).

// Phải trùng với HCC_API_PROXY_PATH trong vite.config.ts
const DEV_PROXY_PATH = "/hcc-api";
const REQUEST_TIMEOUT_MS = 15000;

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

/** GET một endpoint và trả về trường `data` của response. */
export const hccGet = async <T>(
    path: string,
    { params, signal }: { params?: QueryParams; signal?: AbortSignal } = {},
): Promise<T> => {
    if (!API_BASE_URL) {
        throw new HccApiError("Chưa cấu hình VITE_API_BASE_URL", 0);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const abortFromCaller = () => controller.abort();
    signal?.addEventListener("abort", abortFromCaller);

    try {
        let response: Response;

        try {
            response = await fetch(buildUrl(path, params), {
                signal: controller.signal,
            });
        } catch {
            throw new HccApiError(
                signal?.aborted
                    ? "Đã huỷ yêu cầu"
                    : "Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.",
                0,
                signal?.aborted ? "ABORTED" : "NETWORK",
            );
        }

        const body: unknown = await response.json().catch(() => null);

        if (!response.ok) {
            const { message, code } = readErrorMessage(body);

            throw new HccApiError(
                message ?? `Máy chủ trả lỗi ${response.status}`,
                response.status,
                code,
            );
        }

        if (typeof body !== "object" || body === null || !("data" in body)) {
            throw new HccApiError("Phản hồi không hợp lệ", response.status);
        }

        return (body as { data: T }).data;
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abortFromCaller);
    }
};
