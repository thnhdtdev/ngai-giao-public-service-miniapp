# Dịch vụ công Ngãi Giao

Zalo Mini App hỗ trợ người dân tra cứu và tiếp cận thông tin của Trung tâm Phục vụ Hành chính công xã Ngãi Giao. Ứng dụng cung cấp hướng dẫn nộp hồ sơ, thủ tục thường dùng, giờ làm việc, hỏi đáp, địa chỉ và kênh liên hệ Zalo OA.

## Chức năng hiện có

| Chức năng            | Đường dẫn            | Mô tả                                                  |
| -------------------- | -------------------- | ------------------------------------------------------ |
| Trang chủ            | `/`                  | Tổng hợp dịch vụ công, kênh chính thức và các tiện ích |
| Hướng dẫn nộp online | `/online-guide`      | Hướng dẫn nộp hồ sơ trực tuyến theo từng bước          |
| Thủ tục thường dùng  | `/common-procedures` | Danh sách thủ tục và liên kết tra cứu liên quan        |
| Giờ làm việc         | `/working-hours`     | Thời gian tiếp nhận và giải quyết hồ sơ                |
| Hỏi đáp thủ tục      | `/qa`                | Câu hỏi thường gặp và liên hệ hỗ trợ                   |
| Địa chỉ & Chỉ đường  | `/location`          | Địa chỉ Trung tâm, sao chép địa chỉ và mở bản đồ       |

Ứng dụng còn tích hợp Zalo SDK để gọi điện, mở webview, mở bản đồ và trò chuyện với Zalo Official Account.

## Công nghệ

-   React 18 và TypeScript
-   Vite
-   React Router
-   Tailwind CSS
-   ZMP SDK và ZMP UI
-   Zustand
-   Lucide React

## Yêu cầu

-   Node.js và npm
-   Zalo Mini App CLI hoặc extension Zalo Mini App trên VS Code
-   Một Mini App đã được tạo và kích hoạt trên hệ thống Zalo Mini App
-   Ứng dụng Zalo trên điện thoại để kiểm thử các API native như mở chat OA

## Cài đặt

```bash
npm install
```

## Cấu hình môi trường

Tạo file `.env` tại thư mục gốc và khai báo các biến cần thiết:

```dotenv
APP_ID=<zalo-mini-app-id>
ZMP_TOKEN=<zmp-cli-token>
VITE_MINI_APP_ID=<zalo-mini-app-id>
VITE_BASE_URL=<backend-api-url>
VITE_MEDIA_BASE_URL=<cloudflare-r2-public-url>
VITE_API_BASE_URL=https://api.hccngaigiao.vn/api
```

Trong đó:

-   `APP_ID`: ID dùng bởi Zalo Mini App CLI.
-   `ZMP_TOKEN`: token phục vụ thao tác với Zalo Mini App CLI.
-   `VITE_MINI_APP_ID`: Mini App ID dự phòng khi chạy trong môi trường không có `window.APP_ID`.
-   `VITE_BASE_URL`: URL gốc của backend, dùng bởi lớp gọi API trong `src/service`.
-   `VITE_MEDIA_BASE_URL`: URL public của bucket Cloudflare R2 chứa PDF, video và `documents/public-notices.json` (không có dấu `/` ở cuối).
-   `VITE_API_BASE_URL`: API của website hccngaigiao.vn, dùng cho màn Tra cứu thủ tục (`/procedures`). Khi chạy `npm start`, request đi qua proxy `/hcc-api` của dev server nên không bị CORS chặn. Bản build gọi thẳng API, nên backend phải có origin của Mini App (ví dụ `https://h5.zdn.vn`) trong `CORS_ORIGIN`, và domain API phải được khai báo trong cấu hình Zalo Mini App.

> Biến dùng trong code phía client phải có tiền tố `VITE_`. Giá trị được ghi vào bundle lúc build, nên đổi `.env` xong phải build và deploy lại.

> `.env` và các file `.env.*` đã được Git bỏ qua vì có thể chứa thông tin nhạy cảm. Không dùng `git add -f` để đưa các file này vào commit.

## Chạy dự án

Khởi động môi trường phát triển:

```bash
npm start
```

Khởi động và mở chế độ kiểm thử trong ứng dụng Zalo trên iOS:

```bash
npm run start:zalo
```

Build riêng CSS bằng PostCSS/Tailwind khi cần:

```bash
npm run build:css
```

## Kiểm tra chất lượng code

```bash
# Kiểm tra ESLint
npm run lint

# Kiểm tra TypeScript
npx tsc --noEmit

# Kiểm tra định dạng mà không sửa file
npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,md}"
```

Định dạng lại source:

```bash
npm run format
```

## Triển khai

```bash
npm run deploy
```

Trước khi triển khai, cần kiểm tra đúng Mini App ID, token, backend URL và thử các chức năng dùng Zalo SDK trên thiết bị thật.

## Cập nhật văn bản niêm yết công khai

Danh sách văn bản được app tải từ R2 mỗi khi mở trang Niêm yết, nên **thêm, sửa hoặc xoá văn bản không cần sửa code, build hay deploy**.

1. Upload file PDF lên bucket, ví dụ `documents/ngai-giao/QD_moi.pdf`.
2. Tải file `documents/public-notices.json` từ bucket về, thêm một mục vào `notices` của danh mục phù hợp:

    ```json
    {
        "id": "ngai-giao-04",
        "title": "Tên đầy đủ của văn bản",
        "file": "documents/ngai-giao/QD_moi.pdf"
    }
    ```

3. Kiểm tra file là JSON hợp lệ (ví dụ dán vào jsonlint.com), rồi upload đè lên `documents/public-notices.json`.
4. Mở lại trang Niêm yết trong app để kiểm tra.

Quy tắc:

-   `id` phải là duy nhất và **không được đổi** sau khi đã công bố, vì link xem văn bản dùng `id`.
-   `file` là đường dẫn trong bucket, không có `/` ở đầu. Có thể dùng URL đầy đủ `https://...` nếu file nằm ở nơi khác. Để trống `file` thì văn bản hiển thị "Đang cập nhật".
-   Muốn thêm danh mục mới, thêm một phần tử vào `categories` với `id`, `title`, `description`, `notices`.
-   Mục sai cấu trúc sẽ bị bỏ qua. Nếu cả file lỗi hoặc không tải được, app dùng bản dự phòng [`src/content/public-notices.json`](src/content/public-notices.json) đóng gói sẵn. Thỉnh thoảng nên chép bản trên R2 về repo để bản dự phòng không quá cũ.

## Cập nhật video hướng dẫn

Làm tương tự niêm yết, với file `videos/guide-videos.json` trên bucket (không cần sửa code, build hay deploy):

1. Upload video lên bucket, ví dụ `videos/ho-tich.mp4`. Nên dùng MP4 (H.264) để phát được trên cả iOS và Android.
2. Thêm một mục vào mảng `videos` trong `videos/guide-videos.json` rồi upload đè:

    ```json
    {
        "id": "civil-status",
        "title": "Hướng dẫn thủ tục hộ tịch",
        "description": "Mô tả ngắn hiển thị dưới tiêu đề.",
        "file": "videos/ho-tich.mp4"
    }
    ```

-   Thứ tự hiển thị đúng theo thứ tự trong mảng.
-   `id`, `title`, `file` là bắt buộc; `id` phải là duy nhất.
-   Thêm `"showBusinessGroup": true` vào video nào thì thẻ "Nhóm Zalo hỗ trợ kinh doanh" hiển thị ngay dưới video đó.
-   Bản dự phòng nằm ở [`src/content/guide-videos.json`](src/content/guide-videos.json).

## Cấu trúc dự án

```text
.
├── src/
│   ├── assets/          # Hình ảnh và tài nguyên tĩnh
│   ├── components/      # Component dùng chung, layout và các section trang chủ
│   ├── constants/       # Thông tin đơn vị, endpoint và hằng số ứng dụng
│   ├── css/             # Tailwind và style toàn cục
│   ├── mock/            # Dữ liệu giả phục vụ phát triển
│   ├── pages/           # Các trang và cấu hình route
│   ├── service/         # API backend và hàm tích hợp Zalo SDK
│   ├── store/           # Zustand store và các slice
│   ├── types/           # Kiểu dữ liệu TypeScript
│   ├── utils/           # Hàm tiện ích
│   └── app.ts           # Điểm khởi tạo React
├── app-config.json      # Cấu hình giao diện Zalo Mini App
├── zmp-cli.json         # Cấu hình ZMP CLI
├── tailwind.config.js   # Cấu hình Tailwind CSS
├── vite.config.ts       # Cấu hình Vite và alias
└── package.json
```

## Quy ước giao diện

-   Dùng `PageLayout` cho các trang con để thống nhất header, nút quay lại, safe area và vùng cuộn.
-   Ưu tiên utility class chuẩn của Tailwind; hạn chế giá trị tùy ý như `pt-[18px]` khi đã có giá trị gần tương đương trong spacing scale.
-   Dùng Lucide React cho icon giao diện mới.
-   Các API native của Zalo cần có xử lý lỗi và thông báo rõ ràng cho người dùng.

## Lưu ý phát triển

-   Một số tiện ích trên trang chủ vẫn ở trạng thái đang hoàn thiện.
-   `oaId`, hotline, địa chỉ, đường dẫn bản đồ và các liên kết dịch vụ hiện được cấu hình trong source; cần rà soát khi thay đổi đơn vị triển khai.
-   Không commit token, access token hoặc nội dung file môi trường lên Git.

## Bản quyền

Dự án nội bộ, chưa cấp giấy phép phân phối công khai (`UNLICENSED`).
