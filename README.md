# Hôm nay nấu gì?

Trợ lý thực đơn gia đình: random mỗi ngày 3 món (xào/luộc/salad, canh, món mặn), kèm hướng dẫn nấu từng bước, tự tổng hợp danh sách đi chợ, lưu thực đơn yêu thích.

Ứng dụng tĩnh (vanilla HTML/CSS/JS), không cần build step, không cần backend — toàn bộ dữ liệu lưu trong `localStorage` của trình duyệt.

## Chạy thử ở local

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một static server bất kỳ, ví dụ:

```bash
npx serve .
```

## Deploy lên Vercel

```bash
npx vercel        # deploy bản preview
npx vercel --prod # deploy bản production
```
