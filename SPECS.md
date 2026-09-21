# Đặc tả kỹ thuật — "Hôm nay nấu gì?"

| | |
|---|---|
| **Loại** | Web app tĩnh (static SPA, không backend) |
| **Repo** | https://github.com/nhson/hom-nay-nau-gi (public) |
| **Production URL** | https://hom-nay-nau-gi.vercel.app |
| **Vercel project** | `hoang-son-ngs-projects/hom-nay-nau-gi` |
| **Ngày khởi tạo** | 2026-09-21 |

## 1. Tổng quan

Trợ lý thực đơn cho một gia đình. Mỗi ngày gợi ý ngẫu nhiên một thực đơn gồm 3 món theo cơ cấu bữa cơm Việt truyền thống:

- **Xào / Luộc / Salad** — món rau hoặc món phụ
- **Canh** — món nước
- **Món mặn** — món chính

Đi kèm hướng dẫn nấu từng bước, danh sách đi chợ tự tổng hợp, và khả năng lưu lại thực đơn yêu thích.

## 2. Kiến trúc & công nghệ

- **Không framework** — `index.html` (HTML/CSS/JS thuần) + `logic.js` (module ES thuần, chứa toàn bộ logic chọn/lọc món — xem §4a), không build step khi chạy production, không dependency ngoài font Google Fonts (Fraunces + Be Vietnam Pro) load qua `@import`.
- **Không backend, không database** — toàn bộ state lưu trong `localStorage` của trình duyệt, theo từng thiết bị/trình duyệt riêng biệt (không đồng bộ nhiều thiết bị) — đến trước khi Phase 2 hoàn thành.
- **Hosting**: Vercel (static hosting, không cần build command).
- **Testing**: Vitest (dev dependency, `package.json`) test trực tiếp `logic.js` — không cần trình duyệt/DOM. Chạy `npm test`.
- **Nguồn dữ liệu món ăn ban đầu**: tổng hợp qua tra cứu web (WebSearch) các món ăn gia đình Việt Nam phổ biến, biên soạn lại thành dữ liệu có cấu trúc.

## 3. Mô hình dữ liệu

Toàn bộ state được lưu trong `localStorage` với các key sau (tiền tố `hnng_`):

| Key | Nội dung |
|---|---|
| `hnng_dishes_v1` | Mảng toàn bộ món ăn (seed + món người dùng tự thêm/sửa) |
| `hnng_history_v1` | Lịch sử các ngày đã nấu, tối đa 60 bản ghi gần nhất |
| `hnng_favorites_v1` | Danh sách thực đơn đã lưu yêu thích |
| `hnng_todaymenu_v1` | Thực đơn hiện tại đang chọn cho hôm nay |
| `hnng_shopcheck_v1` | Trạng thái tick của danh sách đi chợ |
| `hnng_seedver_v1` | Version dữ liệu seed, dùng để backfill dữ liệu mới (vd. công thức nấu) vào dữ liệu cũ đã lưu mà không mất phần người dùng tự chỉnh |

**Cấu trúc 1 món ăn (`Dish`):**

```js
{
  id: 'c1',                    // string, duy nhất
  category: 'canh',            // 'xao' | 'canh' | 'man'
  name: 'Canh chua cá lóc',
  time: 30,                    // phút, có thể null
  ingredients: ['cá lóc', 'me', 'cà chua', ...],
  steps: ['Cá lóc làm sạch...', 'Đun sôi nước...', ...] // hướng dẫn nấu từng bước
}
```

**Dữ liệu seed**: 54 món (18 món/nhóm) trong biến `SEED_DISHES`, mỗi món đều có đủ `ingredients` và `steps`.

## 4. Tính năng đã triển khai

1. **Random thực đơn** — chọn ngẫu nhiên 1 món/nhóm, tự động tránh lặp món đã nấu trong 4 ngày gần nhất (fallback về toàn bộ danh sách nếu không còn lựa chọn nào khác).
2. **Đổi món riêng lẻ (reroll)** — đổi 1 món trong 3 món mà không ảnh hưởng 2 món còn lại.
3. **Xem hướng dẫn nấu** — mỗi món có khối `<details>` mở/thu gọn hiển thị các bước nấu theo thứ tự.
4. **Đánh dấu "Đã nấu hôm nay"** — ghi thực đơn hiện tại vào lịch sử theo ngày.
5. **Danh sách đi chợ** — tự động tổng hợp & gộp trùng nguyên liệu từ 3 món đang chọn, có checkbox tick đã mua, hiển thị món nào cần nguyên liệu đó.
6. **Quản lý ngân hàng món ăn** (tab "Món ăn") — thêm / sửa / xoá món, kèm hướng dẫn nấu riêng; lọc theo nhóm món.
7. **Lưu thực đơn yêu thích** (tab "Yêu thích") — đặt tên và lưu lại combo 3 món, dùng lại hoặc xoá.
8. **Lịch sử 7 ngày gần nhất** — hiển thị các thực đơn đã đánh dấu đã nấu.
9. **Dark/Light mode** — tự theo `prefers-color-scheme` của hệ thống.
10. **Responsive** — tối ưu cho màn hình điện thoại (~400px trở lên).

## 5. Cấu trúc thư mục

```
hom-nay-nau-gi/
├── index.html      # toàn bộ app (HTML + CSS + JS)
├── README.md        # hướng dẫn chạy local & deploy
├── SPECS.md          # file này
└── .gitignore        # .vercel, .DS_Store, node_modules
```

## 6. Triển khai (Deployment)

- **Hosting**: Vercel, static site (không có build command — deploy thẳng `index.html`).
- **Deploy thủ công**:
  ```bash
  npx vercel        # preview deployment
  npx vercel --prod # production deployment
  ```
- **CI/CD**: Repo GitHub `nhson/hom-nay-nau-gi` đã kết nối với Vercel qua Git Integration (`vercel git connect`). Từ nay:
  - Push lên nhánh `main` → tự động build & deploy **Production**.
  - Push lên nhánh khác / mở PR → tự động tạo **Preview deployment** riêng.
- **Điều kiện đã thiết lập trước khi kết nối được**:
  1. Đăng nhập Vercel CLI (`npx vercel login`).
  2. Liên kết Login Connection GitHub trong tài khoản Vercel (vercel.com/account/login-connections).
  3. Cài đặt & cấp quyền GitHub App "Vercel" cho repo (github.com/apps/vercel/installations/new).

## 7. Nhật ký thực hiện trong phiên làm việc (2026-09-21)

1. Lên ý tưởng & thống nhất phạm vi: app 1 thiết bị, dữ liệu món do Claude tra cứu khởi tạo.
2. Tra cứu web các món ăn gia đình Việt phổ biến theo 3 nhóm (xào/luộc/salad, canh, món mặn).
3. Xây dựng bản đầu: app HTML/CSS/JS thuần, 54 món seed, random thực đơn, danh sách đi chợ, quản lý món, thực đơn yêu thích, lịch sử — publish dưới dạng Claude Artifact để demo/test.
4. Test thủ công trên Claude Browser pane (qua local static server, vì Artifact preview cần đăng nhập claude.ai) — phát hiện & xác minh vấn đề mojibake khi test local chỉ do server thiếu header `charset=utf-8`, không phải lỗi dữ liệu nguồn.
5. Bổ sung hướng dẫn nấu (`steps`) cho toàn bộ 54 món, thêm UI xem công thức (`<details>`), thêm trường hướng dẫn nấu vào form thêm/sửa món, thêm cơ chế backfill dữ liệu cũ (`SEED_VERSION`).
6. Đóng gói thành project tĩnh tại `~/Projects/hom-nay-nau-gi`, bọc lại thành file HTML hoàn chỉnh (doctype/head/body) để chạy độc lập ngoài môi trường Artifact.
7. Khởi tạo git repo, commit code.
8. Cài & đăng nhập Vercel CLI (qua Terminal panel — bước tương tác người dùng tự thực hiện).
9. Deploy production lần đầu lên Vercel → `hom-nay-nau-gi.vercel.app`.
10. Tạo repo GitHub public `nhson/hom-nay-nau-gi`, push code lên.
11. Liên kết Login Connection GitHub ↔ Vercel account (người dùng tự thực hiện qua trình duyệt).
12. Cài đặt GitHub App "Vercel", cấp quyền truy cập repo (người dùng tự thực hiện).
13. Kết nối repo GitHub với Vercel project (`vercel git connect`) → bật CI/CD.
14. Xác minh CI/CD hoạt động: push 1 commit test lên `main`, Vercel tự tạo deployment mới và Ready sau ~17 giây.
15. Tạo `SPECS.md` tổng hợp đặc tả kỹ thuật ban đầu (kiến trúc, mô hình dữ liệu, tính năng, hạn chế, roadmap sơ bộ).
16. Thêm Vercel Web Analytics + custom event tracking (hàm `track()` gắn vào các hành động chính); gặp bug nền tảng Vercel (script insights 404 kéo dài) — xác minh qua API là cấu hình đúng phía Vercel, không phải lỗi code, rồi chờ nền tảng tự khắc phục.
17. Grill toàn bộ roadmap tiếp theo (`/mattpocock-skills:grill-with-docs`) — chốt 3 phase: (1) Chay/Bữa 1 món/Vùng miền, (2) Backend Hộ gia đình, (3) Lịch thực đơn tuần. Tạo `CONTEXT.md` (glossary) và 2 ADR ([0001](docs/adr/0001-centralized-storage-no-session-sync.md), [0002](docs/adr/0002-meal-type-vs-category.md)).
18. `/mattpocock-skills:to-spec` cho Phase 1 → publish [issue #1](https://github.com/nhson/hom-nay-nau-gi/issues/1), implement theo TDD: tách `logic.js` làm seam (18 test), mở rộng `SEED_DISHES` 54→73 món (thêm chay, vùng miền, Bữa 1 món), migration `SEED_VERSION` 2→3, UI mới (toggle chay/1 món, badge, filter, form).
19. `/mattpocock-skills:to-spec` cho Phase 2 → publish [issue #2](https://github.com/nhson/hom-nay-nau-gi/issues/2), implement: seam `household.js` (14 test), API serverless `api/household/[code].js` + Vercel Blob, `vercel.json` rewrite `/h/:code`, tab "Hộ gia đình" (tạo/rời/trạng thái đồng bộ), ghi-qua có debounce.
20. Thiết lập hạ tầng Vercel Blob (tạo store, kết nối, thêm token) — phát hiện & sửa 2 bug thật khi verify trên production: import path tương đối bị rewrite `/h/:code` bắt nhầm, và nhận diện "hộ trống" sai do message lỗi thật khác dự kiến. Verify end-to-end đa thiết bị (2 "thiết bị" khác nhau thấy đúng cùng 1 dữ liệu) thành công.
21. Đổi tên nhãn UI cho rõ nghĩa hơn: "Ăn chay hôm nay"→"Món chay", "Ăn 1 tô hôm nay"→"Nấu 1 món" (giữ nguyên nhãn khi bật, chỉ đổi màu highlight thay vì đổi chữ); đổi tên khái niệm "Bữa 1 tô"→"Bữa 1 món" xuyên suốt code và tài liệu.
22. Sửa bug: đổi món (reroll) làm xáo trộn thứ tự hiển thị 3 món — thêm cơ chế giữ cố định thứ tự Xào→Canh→Món mặn, tự phục hồi cả với dữ liệu cũ đã lệch.
23. Tạm ẩn tab "Hộ gia đình" khỏi giao diện theo yêu cầu (giữ nguyên code/API phía sau, dễ bật lại). Tạm ngưng Phase 3 trong roadmap.

## 8. Hạn chế hiện tại

- Dữ liệu chỉ lưu `localStorage` theo từng trình duyệt/thiết bị — không đồng bộ nhiều thiết bị, mất dữ liệu nếu xoá cache trình duyệt.
- App public (không có xác thực đăng nhập) — ai có link đều mở và dùng được, nhưng dữ liệu người dùng không bị chia sẻ chéo vì mỗi người có `localStorage` riêng.
- Nguyên liệu chỉ liệt kê tên, chưa có định lượng (vd. "200g thịt ba chỉ").
- Chưa có tính năng lọc theo số người ăn, ngân sách, hoặc nguyên liệu có sẵn trong tủ lạnh.

## 9. Roadmap tiếp theo (đã grill với `/mattpocock-skills:grill-with-docs`, 2026-09-21)

Xem thuật ngữ đầy đủ tại [CONTEXT.md](CONTEXT.md), quyết định kiến trúc tại [docs/adr/](docs/adr/). Spec chi tiết + user stories: [docs/spec-phase1-chay-buatomonuoc-vungmien.md](docs/spec-phase1-chay-buatomonuoc-vungmien.md), issue [#1](https://github.com/nhson/hom-nay-nau-gi/issues/1).

**✅ Phase 1 — đã triển khai (2026-09-21):**
- **Chay**: thêm tag `chay` lên món ăn (món có sẵn phù hợp + món chay mới), thêm bộ lọc "ăn chay hôm nay" áp dụng cho cả 3 Nhóm món — không phải nhóm thứ 4. Áp dụng được cho từng ngày riêng lẻ trong Kế hoạch tuần (Phase 3), không chỉ "Hôm nay". Tab "Món ăn" có thêm chip lọc "Chay" (ngang hàng Tất cả/Xào.../Canh/Món mặn) để duyệt toàn bộ món chay bất cứ lúc nào.
- **Bữa 1 món**: Kiểu bữa ăn mới song song "Bữa cơm 3 món" — món nước ăn độc lập (phở/bún/nui...), kích hoạt bằng nút riêng chủ động (không random tự động). Xem [ADR-0002](docs/adr/0002-meal-type-vs-category.md).
- **Vùng miền**: tag Bắc/Trung/Nam trên món ăn, chỉ hiển thị thông tin, chưa dùng để lọc.

**Phase 2 — Backend lưu trữ tập trung theo Hộ gia đình:**
- Không có tài khoản cá nhân — 1 hộ gia đình = 1 bản ghi, truy cập qua link/mã không đoán được (`/h/<mã>`).
- Không đồng bộ real-time giữa các phiên, không xử lý xung đột — đọc khi mở app, ghi đè khi có thay đổi. Xem [ADR-0001](docs/adr/0001-centralized-storage-no-session-sync.md).

**⏸️ Phase 3 — Lịch thực đơn theo tuần (tạm ngưng, 2026-09-21):**
- Lên kế hoạch trước cho cả 7 ngày (Bữa cơm 3 món), ép không trùng món tuyệt đối trong tuần (đủ dữ liệu vì 18 món/nhóm > 7 ngày cần).
- Gộp danh sách đi chợ cho cả tuần (giá trị chính của việc lên kế hoạch trước).
- Sửa được từng ngày riêng lẻ trong tuần — kể cả đổi kiểu bữa ăn của ngày đó sang "Bữa 1 món", hoặc bật lọc "chay" riêng cho ngày đó.
- Hợp nhất với "Hôm nay"/"Lịch sử": tab Hôm nay tự lấy đúng món trong kế hoạch tuần của ngày đó, "Đánh dấu đã nấu" hoạt động y hệt cơ chế hiện tại.

**Đã cân nhắc và loại bỏ khỏi roadmap** (không đủ giá trị so với chi phí xây dựng thêm thao tác nhập liệu):
- Định lượng nguyên liệu theo khẩu phần.
- Gợi ý món theo nguyên liệu có sẵn trong tủ lạnh (tự nhập thủ công).
- Đánh giá món sau khi nấu để ưu tiên gợi ý.
