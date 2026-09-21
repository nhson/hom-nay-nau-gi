# Hôm nay nấu gì?

Trợ lý thực đơn gia đình: random mỗi ngày 3 món (xào/luộc/salad, canh, món mặn), kèm hướng dẫn nấu từng bước, tự tổng hợp danh sách đi chợ, lưu thực đơn yêu thích.

Ứng dụng tĩnh (vanilla HTML/CSS/JS), không cần build step, không cần backend — toàn bộ dữ liệu lưu trong `localStorage` của trình duyệt.

## Chạy thử ở local

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một static server bất kỳ, ví dụ:

```bash
npx serve .
```

## Chạy test

Logic chọn/lọc món (`logic.js`) có bộ test riêng, không cần trình duyệt:

```bash
npm install
npm test
```

## Deploy lên Vercel

```bash
npx vercel        # deploy bản preview
npx vercel --prod # deploy bản production
```

Repo này đã kết nối với Vercel Git Integration: mỗi lần push lên nhánh `main` sẽ tự động deploy production, các nhánh/PR khác sẽ có preview deploy riêng.
