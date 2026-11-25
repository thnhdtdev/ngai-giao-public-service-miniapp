# Dịch vụ công Ngãi Giao

Zalo Mini App hỗ trợ người dân tra cứu và tiếp cận thông tin của Trung tâm Phục vụ Hành chính công xã Ngãi Giao. Ứng dụng cung cấp hướng dẫn nộp hồ sơ, thủ tục thường dùng, giờ làm việc, hỏi đáp, địa chỉ và kênh liên hệ Zalo OA.

## Chức năng hiện có

| Chức năng            | Đường dẫn            | Mô tả                                                  |
| -------------------- | -------------------- | ------------------------------------------------------ |
| Trang chủ            | `/`                  | Tổng hợp dịch vụ công, kênh chính thức và các tiện ích |
| Hướng dẫn nộp online | `/online-guide`      | Hướng dẫn nộp hồ sơ trực tuyến theo từng bước          |
| Thủ tục thường dùng  | `/common-procedures` | Danh sách thủ tục và liên kết tra cứu liên quan        |
| Tra cứu thủ tục      | `/procedures`        | Danh mục thủ tục từ API hccngaigiao.vn, xem chi tiết   |
| Giờ làm việc         | `/working-hours`     | Thời gian tiếp nhận và giải quyết hồ sơ                |
| Trợ lý hỏi đáp       | `/qa`                | Hỏi đáp AI về thủ tục, có trích dẫn nguồn              |
| Đặt lịch hẹn         | `/booking`           | Đặt lịch nộp hồ sơ trong ngày tại Trung tâm            |
| Lịch hẹn của tôi     | `/appointments`      | Xem trạng thái, sao chép mã, huỷ lịch hẹn hôm nay      |
| Địa chỉ & Chỉ đường  | `/location`          | Địa chỉ Trung tâm, sao chép địa chỉ và mở bản đồ       |

Ứng dụng còn tích hợp Zalo SDK để gọi điện, mở webview, mở bản đồ và trò chuyện với Zalo Official Account.

### Đặt lịch hẹn

-   Dùng API của backend hccngaigiao.vn: `GET /categories`, `GET /slots?categoryId=`, `POST /appointments`, `GET /appointments/lookup?phone=`, `POST /appointments/:id/cancel`.
-   Backend chỉ nhận đặt lịch **trong ngày hôm nay**. Khung giờ được tạo tự động lúc 00:01 mỗi ngày theo cấu hình trong trang quản trị.
-   Lịch đã đặt được lưu trên máy người dùng (`nativeStorage` của Zalo) để xem lại và huỷ mà không cần nhập lại số điện thoại. Không lưu số CCCD.
-   Màn chi tiết thủ tục có nút "Đặt lịch nộp hồ sơ", tự chọn sẵn lĩnh vực theo bảng ghép trong `src/api/appointments.ts` (`FIELD_TO_CATEGORY_CODE`). Thêm lĩnh vực đặt lịch mới ở backend thì cập nhật bảng này.
-   Khi test ở local nên trỏ `VITE_API_BASE_URL` tới backend chạy trên máy, tránh tạo lịch hẹn thật trên production.

## Công nghệ

-   React 18 và TypeScript
-   Vite 5 + `zmp-vite-plugin`
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
-   `VITE_MEDIA_BASE_URL`: URL public của bucket Cloudflare R2 chứa video, `videos/guide-videos.json` và manifest dự phòng `documents/public-notices.json` (không có dấu `/` ở cuối).
-   `VITE_API_BASE_URL`: API của website hccngaigiao.vn, dùng cho màn Tra cứu thủ tục (`/procedures`) và Trợ lý hỏi đáp (`/qa`, gọi `POST /assistant/chat`; backend cần cấu hình `GOOGLE_API_KEY` và đã nạp dữ liệu tri thức, nếu không app báo trợ lý đang bảo trì). Khi chạy `npm start`, request đi qua proxy `/hcc-api` của dev server nên không bị CORS chặn. Bản build gọi thẳng API, nên backend phải có origin của Mini App (ví dụ `https://h5.zdn.vn`) trong `CORS_ORIGIN`, và domain API phải được khai báo trong cấu hình Zalo Mini App.

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

## Build và triển khai

```bash
# Build ra thư mục www/ (kèm www/app-config.json cho Zalo)
npm run build

# Build rồi deploy bản Development
npm run deploy

# Build rồi deploy bản Testing
npm run deploy:testing
```

-   `zmp-vite-plugin` build với `base: "./"` nên ảnh, PDF worker và các chunk được tham chiếu **tương đối**, chạy đúng ở mọi version Zalo cấp. (Với Vite 2 trước đây, ZMP CLI gắn cứng số version vào URL và có lúc gắn sai, làm ảnh bị 404.)
-   Plugin tự sinh `www/app-config.json` (`listCSS`, `listSyncJS`) từ `app-config.json` ở thư mục gốc. Đổi cấu hình hiển thị (tiêu đề, status bar…) thì sửa `app-config.json` rồi build lại.
-   `zmp deploy` tự chạy `vite build` (giống extension Zalo Mini App trên VS Code) rồi upload `www/`. **Không dùng `--existing`**: với cờ này ZMP CLI đọc `listSyncJS` từ `app-config.json` ở thư mục gốc (đang để trống, vì danh sách file do plugin sinh vào `www/app-config.json`) nên báo "No asset defined", và còn ghi đè `www/app-config.json`.
-   `package.json` có `overrides` thay Rollup bằng `@rollup/wasm-node` (bản WebAssembly, không có file native). **Không xoá**: trên macOS, VS Code chặn nạp file native `rollup.darwin-arm64.node` vì khác chữ ký nhà phát hành, làm extension Zalo báo "Không tìm thấy thư viện Vite". Khi nâng Vite/Rollup, cập nhật phiên bản trong `overrides` cho khớp.

Trước khi triển khai, cần kiểm tra đúng Mini App ID, token, backend URL và thử các chức năng dùng Zalo SDK trên thiết bị thật.

## Cập nhật văn bản niêm yết công khai

**Cách chính:** văn bản lấy từ API của website hccngaigiao.vn (`GET /file-types`, `GET /files`). Cán bộ thêm, sửa, ẩn văn bản trong **trang quản trị website** (mục quản lý file công khai). Website và mini app dùng chung, không cần sửa code, build hay deploy.

-   Mỗi **loại file** (file type) là một nhóm trên trang Niêm yết, theo thứ tự sắp xếp trong trang quản trị. Nhóm chưa có văn bản sẽ không hiển thị.
-   Chỉ hiện văn bản và loại file đang bật. File PDF xem trực tiếp trong app; định dạng khác mở bằng trình duyệt.

**Dự phòng:** nếu API lỗi hoặc không phản hồi trong 6 giây, app dùng manifest `documents/public-notices.json` trên R2 (cách cũ, bên dưới), rồi tới bản đóng gói [`src/content/public-notices.json`](src/content/public-notices.json). Nên giữ manifest R2 gần giống dữ liệu trong trang quản trị.

### Cập nhật manifest dự phòng trên R2

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

## Cập nhật bảng phí, lệ phí

Màn "Phí, lệ phí" (`/public-notices/fees`, trong trang Niêm yết công khai) đọc file `documents/fee-schedule.json` trên R2, nên **đổi mức phí không cần sửa code, build hay deploy**. Nếu không tải được, app dùng bản đóng gói [`src/content/fee-schedule.json`](src/content/fee-schedule.json).

1. Lần đầu: upload nguyên file `src/content/fee-schedule.json` lên bucket tại `documents/fee-schedule.json`.
2. Muốn sửa: tải file trên R2 về, sửa rồi upload đè. Kiểm tra JSON hợp lệ trước khi upload.

Cấu trúc (giống `frontend/constants/fees.ts` của website, nên khi đổi phí nhớ cập nhật cả hai):

-   `title`: tiêu đề bảng. `pdf`: link bảng phí gốc, dùng URL đầy đủ hoặc đường dẫn trong bucket (ví dụ `documents/fee.pdf`).
-   `groups[]`: nhóm phí (`code` A/B/C, `title`, `note` là căn cứ pháp lý) → `sections[]` (`code`, `title` không bắt buộc) → `items[]`.
-   Mỗi mục: `no`, `name`, `direct` (trực tiếp/bưu chính), `online` (trực tuyến), `onlineDetail` (điều kiện ghi dưới mức trực tuyến), `note`, `children[]` (các trường hợp con, cùng các trường như trên).
-   Số tiền ghi dạng chữ: `"8.000"`, `"Miễn phí"`, `"2.000/trang; từ trang thứ 3…"`. Số thuần sẽ tự hiển thị thành `8.000 đ`.

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
├── vite.config.mts      # Cấu hình Vite, alias và plugin Zalo
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
