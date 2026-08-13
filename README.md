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
```

Trong đó:

-   `APP_ID`: ID dùng bởi Zalo Mini App CLI.
-   `ZMP_TOKEN`: token phục vụ thao tác với Zalo Mini App CLI.
-   `VITE_MINI_APP_ID`: Mini App ID dự phòng khi chạy trong môi trường không có `window.APP_ID`.
-   `VITE_BASE_URL`: URL gốc của backend, dùng bởi lớp gọi API trong `src/service`.

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
