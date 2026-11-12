/**
 * Chuẩn hoá chuỗi để tìm kiếm tiếng Việt không dấu, không phân biệt hoa thường:
 * "Hộ tịch" và "ho tich" cho cùng kết quả.
 */
export const normalizeSearchText = (value: string): string =>
    value
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
