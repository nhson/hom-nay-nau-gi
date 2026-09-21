# Spec: Phase 1 — Chay, Bữa 1 tô, Vùng miền

## Problem Statement

Ngân hàng món ăn hiện tại (54 món, chỉ 3 Nhóm món: Xào/Luộc/Salad, Canh, Món mặn) không đáp ứng được vài nhu cầu thực tế của gia đình:

1. Những ngày ăn chay (mùng 1, rằm âm lịch...) không có cách nào để cả bữa toàn món chay — phải tự nhớ và tự chọn thủ công từng món, dễ quên/sai.
2. Những ngày lười nấu cơm 3 món, muốn ăn nhanh gọn 1 tô phở/bún/nui thì app không có lựa chọn nào — chỉ random ra được cấu trúc 3 món cơm.
3. Không biết món nào thuộc miền nào để chủ động đổi khẩu vị.

## Solution

Mở rộng ngân hàng món ăn với 3 khái niệm mới, đúng theo định nghĩa đã chốt trong [CONTEXT.md](../CONTEXT.md) và [ADR-0002](adr/0002-meal-type-vs-category.md):

1. **Chay** — thuộc tính (tag) trên món ăn + bộ lọc "ăn chay hôm nay" áp dụng cho toàn bộ Bữa cơm 3 món hoặc Bữa 1 tô, không phải một Nhóm món thứ 4.
2. **Bữa 1 tô** — một **Kiểu bữa ăn** mới, song song với "Bữa cơm 3 món" hiện có, kích hoạt chủ động bằng nút riêng (không random tự động).
3. **Vùng miền** (Bắc/Trung/Nam) — tag hiển thị thông tin trên món ăn, chưa dùng để lọc.

## User Stories

**Chay**

1. As gia đình có ngày ăn chay, tôi muốn bật 1 bộ lọc "ăn chay hôm nay", để cả bữa hôm nay chỉ gồm món chay.
2. As người quản lý ngân hàng món ăn, tôi muốn đánh dấu 1 món là "chay" khi thêm/sửa món, để món đó xuất hiện khi bật lọc ăn chay.
3. As người quản lý ngân hàng món ăn, tôi muốn lọc danh sách món theo chip "Chay" trong tab Món ăn, để xem nhanh toàn bộ món chay hiện có, không phân biệt nhóm.
4. As người dùng đang ở chế độ chay, tôi muốn bấm "đổi món" (reroll) cho từng món, để đổi món chay khác mà vẫn giữ đúng ràng buộc chay.
5. As người dùng, tôi muốn tắt bộ lọc chay bất cứ lúc nào, để quay lại random bình thường trên toàn bộ ngân hàng món ăn.
6. As người dùng, tôi muốn thấy rõ trạng thái lọc chay đang bật/tắt, để biết chắc thực đơn hiển thị có phải toàn món chay hay không.
7. As người dùng, nếu 1 nhóm món không có đủ món chay để random, tôi muốn được thông báo rõ ràng thay vì app trả về món không phải chay một cách âm thầm.
8. As người dùng đang ở chế độ chay VÀ muốn ăn 1 tô cùng lúc, tôi muốn 2 bộ lọc kết hợp được, để chỉ random trong các món Bữa 1 tô có tag chay.

**Bữa 1 tô**

9. As người dùng lười nấu cơm 3 món, tôi muốn bấm 1 nút riêng "Ăn 1 tô hôm nay", để thay thế toàn bộ thực đơn bằng đúng 1 món nước (phở/bún/nui...).
10. As người dùng đang ở chế độ Bữa 1 tô, tôi muốn bấm "đổi món" để random món 1-tô khác, tương tự cơ chế reroll hiện có.
11. As người dùng, tôi muốn quay lại Bữa cơm 3 món bất cứ lúc nào từ Bữa 1 tô, để không bị kẹt trong chế độ 1 tô.
12. As người quản lý ngân hàng món ăn, tôi muốn thêm/sửa/xoá món thuộc Bữa 1 tô (tên, nguyên liệu, hướng dẫn nấu y như món thường), để tự bổ sung món 1-tô của gia đình mình.
13. As người dùng xem "Danh sách đi chợ" khi đang ở Bữa 1 tô, tôi muốn chỉ thấy nguyên liệu của đúng 1 món đó, để đi chợ đúng những gì cần mua.
14. As người dùng đánh dấu "Đã nấu hôm nay" khi đang ở Bữa 1 tô, tôi muốn lịch sử ghi nhận đúng đã nấu 1 món đó, để lịch sử phản ánh đúng thực tế.
15. As người dùng xem "7 ngày gần đây", tôi muốn phân biệt được ngày nào là Bữa cơm 3 món, ngày nào là Bữa 1 tô.
16. As người dùng, tôi muốn Bữa 1 tô KHÔNG bao giờ tự động xuất hiện khi bấm "Random thực đơn" bình thường, để không bị áp đặt món nước khi đang muốn ăn cơm.

**Vùng miền**

17. As người quản lý ngân hàng món ăn, tôi muốn gắn tag vùng miền (Bắc/Trung/Nam) khi thêm/sửa món, để lưu thông tin xuất xứ món ăn.
18. As người dùng xem thực đơn hôm nay, tôi muốn thấy tag vùng miền hiển thị trên mỗi món (nếu có).
19. As người quản lý ngân hàng món ăn, tôi muốn để trống tag vùng miền nếu không chắc món đó thuộc miền nào, để không bị ép phân loại sai.
20. As người dùng, tag vùng miền hiện KHÔNG dùng để lọc/random — chỉ hiển thị thông tin, để không kỳ vọng nhầm tính năng lọc theo vùng miền ở giai đoạn này.

**Dữ liệu & migration**

21. As người dùng mới, tôi muốn ngân hàng món ăn có sẵn 1 lượng món chay và món Bữa 1 tô hợp lý ngay từ đầu, để dùng ngay được 2 tính năng mới mà không phải tự thêm từ số 0.
22. As người dùng đã dùng app trước đó (có dữ liệu `localStorage` cũ), tôi muốn dữ liệu món cũ của tôi được giữ nguyên, món chay/1-tô mới chỉ bổ sung thêm, không ghi đè món tôi đã tự sửa.
23. As người quản lý ngân hàng món ăn, tôi muốn các món hiện có (54 món seed cũ) được rà soát và gắn tag chay nếu phù hợp (vd "Đậu hũ sốt cà chua" vốn đã chay), để không tạo trùng lặp.
24. As nhà phát triển, tôi muốn hàm lọc/chọn món hoạt động đúng khi 0 món thoả điều kiện lọc, trả kết quả rõ ràng (`null`/rỗng) thay vì crash hoặc trả về `undefined` âm thầm.

## Implementation Decisions

- **Mở rộng `Dish`**: thêm 2 field tuỳ chọn — `chay: boolean` (mặc định `false`) và `region: 'bac' | 'trung' | 'nam' | null` (mặc định `null`).
- **Kiểu bữa ăn tách khỏi Nhóm món** (theo ADR-0002): thêm field mới `mealType: 'buacom' | 'buatomonuoc'` trên `Dish` (mặc định `'buacom'` cho mọi món hiện có qua migration).
  - Khi `mealType === 'buacom'`: `category` bắt buộc là `'xao' | 'canh' | 'man'` như hiện tại.
  - Khi `mealType === 'buatomonuoc'`: `category` không cần thiết (bỏ qua/`null`).
- **`state.todayMenu` mở rộng**: thêm `mealType: 'buacom' | 'buatomonuoc'` (mặc định `'buacom'`). Khi là `'buatomonuoc'`, `dishIds` chỉ có đúng 1 phần tử; khi `'buacom'`, giữ nguyên 3 phần tử như hiện tại.
- **Bộ lọc Chay**: thêm `state.chayFilter: boolean` (mặc định `false`), áp dụng cho cả 2 Kiểu bữa ăn — khi bật, mọi random/reroll chỉ chọn trong món có `chay === true`.
- **Seam `logic.js`** (module ES, không đụng DOM/`localStorage`), export các hàm thuần tuý:
  - `filterDishes(dishes, { mealType, category, chay }) → Dish[]`
  - `pickRandom(pool, avoidIds) → Dish | null`
  - `buildBuaComMenu(dishes, { chay, avoidIdsByCategory }) → { xao, canh, man }` (từng phần có thể `null` nếu pool rỗng)
  - `pickMonNuoc(dishes, { chay, avoidId }) → Dish | null`
  `index.html` gọi các hàm này rồi mới cập nhật `state`/DOM/`localStorage` — tách biệt hoàn toàn "chọn món" khỏi "hiển thị/lưu trữ".
- **Migration**: bump `SEED_VERSION` từ 2 lên 3; backfill `mealType: 'buacom'` cho món cũ chưa có field này, và gắn `chay`/`region` cho các món seed đã rà soát lại — theo đúng cơ chế backfill-theo-`id` đã dùng khi thêm `steps` trước đây (không ghi đè món người dùng tự sửa).
- **UI — tab "Hôm nay"**: thêm 2 điều khiển cạnh nút "Random thực đơn" hiện có — toggle "Ăn chay hôm nay" và nút "Ăn 1 tô hôm nay". Trạng thái Kiểu bữa ăn + bộ lọc chay hiển thị rõ ràng (không mơ hồ).
- **UI — tab "Món ăn"**: thêm chip lọc "Chay" ngang hàng các chip Nhóm món hiện có (Tất cả/Xào.../Canh/Món mặn); món thuộc Bữa 1 tô hiển thị/quản lý trong cùng danh sách (nhóm hiển thị riêng hoặc chip riêng — quyết định cụ thể lúc code).
- **Dữ liệu seed mới**: nghiên cứu và biên soạn danh sách món chay (rà soát 54 món hiện có + thêm món mới nếu cần) và món Bữa 1 tô (phở, bún, nui...) theo đúng cấu trúc `Dish` đã mở rộng.

## Testing Decisions

- Test tốt kiểm tra **hành vi bên ngoài** (input → output của các hàm trong `logic.js`), không test chi tiết cách hiện thực nội bộ.
- 100% hàm export trong `logic.js` đều có test — đây là **bộ test đầu tiên của project** (chưa có test nào trước đây), dùng Vitest, file `logic.test.js` đặt cạnh `logic.js`.
- Các case bắt buộc test: pool rỗng (trả `null`, không crash); bộ lọc `chay` kết hợp `mealType: 'buatomonuoc'`; `avoidIds` loại đúng món vừa chọn khỏi candidate tiếp theo; `buildBuaComMenu` luôn trả đúng 3 khoá `xao/canh/man`.
- KHÔNG test DOM/rendering/`localStorage` trong `index.html` ở phase này — ngoài phạm vi seam đã chọn.

## Out of Scope

- Định lượng nguyên liệu theo khẩu phần, gợi ý theo nguyên liệu có sẵn, đánh giá món sau khi nấu — đã loại bỏ khỏi roadmap (xem SPECS.md §9).
- Phase 2 (Backend/Hộ gia đình) và Phase 3 (Lịch thực đơn tuần) — không đụng trong spec này.
- Bộ lọc theo Vùng miền (chỉ hiển thị thông tin ở phase này).
- Test DOM/E2E qua trình duyệt thật.

## Further Notes

- Xem đầy đủ thuật ngữ tại [CONTEXT.md](../CONTEXT.md); quyết định kiến trúc liên quan tại [ADR-0002](adr/0002-meal-type-vs-category.md) (Bữa 1 tô là Kiểu bữa ăn riêng, không nhét vào Nhóm món "Canh").
- Roadmap tổng thể (3 phase) tại [SPECS.md §9](../SPECS.md#9-roadmap-tiếp-theo-đã-grill-với-mattpocock-skillsgrill-with-docs-2026-09-21--chưa-triển-khai).
