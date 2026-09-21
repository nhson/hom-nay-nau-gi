# Spec: Phase 2 — Backend lưu trữ tập trung theo Hộ gia đình

## Problem Statement

Hiện tại toàn bộ dữ liệu (ngân hàng món ăn, thực đơn, lịch sử, yêu thích, danh sách đi chợ) chỉ lưu trong `localStorage` của từng trình duyệt/thiết bị. Gia đình không thể dùng chung 1 bộ dữ liệu trên nhiều thiết bị (vd vợ và chồng mỗi người 1 điện thoại), và dữ liệu biến mất hoàn toàn nếu xoá cache trình duyệt — không có bản sao lưu nào khác.

## Solution

Thêm một backend lưu trữ tập trung cho **Hộ gia đình**, đúng theo [CONTEXT.md](../CONTEXT.md) và [ADR-0001](adr/0001-centralized-storage-no-session-sync.md): không có tài khoản cá nhân, truy cập bằng **Mã hộ gia đình** (một link không đoán được) thay vì đăng nhập, và **không** có đồng bộ real-time hay xử lý xung đột — chỉ đơn thuần đọc khi mở app, ghi khi có thay đổi.

## User Stories

1. As người dùng lần đầu muốn chia sẻ thực đơn với gia đình, tôi muốn tạo 1 hộ gia đình mới chỉ bằng 1 nút bấm, để có ngay 1 link chia sẻ được mà không cần đăng ký tài khoản.
2. As người tạo hộ gia đình, tôi muốn dữ liệu tôi đang có sẵn trên máy (món ăn, thực đơn, lịch sử, yêu thích) được đưa lên làm dữ liệu ban đầu của hộ, để không mất công tạo lại từ đầu.
3. As thành viên gia đình nhận được link chia sẻ, tôi muốn mở link là thấy ngay đúng dữ liệu của hộ, để dùng chung với người đã tạo hộ.
4. As thành viên gia đình, tôi muốn mọi hành động tôi làm (random món, đánh dấu đã nấu, thêm/sửa/xoá món, lưu yêu thích, tick đi chợ, bật lọc chay...) đều được lưu lên hộ gia đình, để lần sau mở lại — trên máy này hoặc máy khác — đều thấy đúng.
5. As thành viên gia đình mở app trên thiết bị khác, tôi muốn thấy đúng dữ liệu hộ gia đình đã lưu mà KHÔNG cần đăng nhập, chỉ cần có link/mã.
6. As người dùng, tôi hiểu rằng app KHÔNG tự động cập nhật khi người khác trong nhà vừa thay đổi — chỉ khi tôi tự mở lại/tải lại trang mới thấy bản mới nhất, để không kỳ vọng nhầm tính năng đồng bộ trực tiếp.
7. As người dùng, nếu 2 thiết bị cùng lưu gần như đồng thời, tôi hiểu bản lưu sau cùng sẽ thắng (ghi đè bản trước) mà không có cảnh báo xung đột, để không kỳ vọng nhầm việc gộp thay đổi.
8. As người dùng chưa muốn chia sẻ với ai, tôi muốn app vẫn hoạt động hoàn toàn bình thường như hiện tại (chỉ lưu local), để không bị ép phải tạo hộ gia đình mới dùng được app.
9. As người dùng đã tham gia 1 hộ gia đình, tôi muốn xem lại link/mã hộ gia đình bất cứ lúc nào, để gửi thêm cho người khác trong nhà sau này.
10. As người dùng, tôi muốn rời khỏi hộ gia đình đang tham gia để quay về chỉ dùng local, nếu cần tách dữ liệu ra dùng riêng.
11. As người dùng mở 1 link hộ gia đình không đúng định dạng, tôi muốn được thông báo rõ ràng, để biết là link sai chứ không phải app lỗi.
12. As người dùng mở 1 link hộ gia đình đúng định dạng nhưng hộ đó chưa từng có ai ghi dữ liệu, tôi muốn thấy trạng thái "hộ trống" rõ ràng (không nhầm với lỗi mạng).
13. As người dùng, khi app đang lưu dữ liệu lên hộ gia đình mà mất mạng/lỗi, tôi muốn thay đổi của tôi vẫn được giữ lại trên máy (không mất), và app tự thử lưu lại sau.
14. As người dùng, tôi muốn biết rõ trạng thái đồng bộ hiện tại (đã lưu lên hộ gia đình / đang lưu / lỗi chưa lưu được), để yên tâm dữ liệu đã an toàn.
15. As người phát triển, tôi muốn mã hộ gia đình đủ dài và ngẫu nhiên (sinh bằng CSPRNG) để không ai đoán được bằng cách thử ngẫu nhiên.
16. As người phát triển, tôi muốn server xác thực định dạng mã hộ gia đình và giới hạn kích thước payload trước khi ghi, để tránh bị lạm dụng ghi dữ liệu rác/quá lớn.
17. As người dùng thao tác nhanh liên tiếp (vd tick nhiều ô trong danh sách đi chợ liền nhau), tôi muốn app không gửi hàng loạt request riêng lẻ lên server cho từng lần tick, để tránh giật/chậm.
18. As người dùng trong 1 hộ gia đình, tôi muốn ngân hàng món ăn, thực đơn hôm nay, lịch sử, yêu thích, trạng thái tick đi chợ và bộ lọc chay hiện tại đều thuộc về hộ gia đình chung, đúng theo CONTEXT.md.
19. As người dùng bấm vào link chia sẻ dạng đường dẫn riêng (vd `/h/<mã>`), tôi muốn app tải lên bình thường như trang chủ, không bị lỗi trang không tìm thấy.
20. As người phát triển, tôi muốn phân biệt được lỗi "mã không hợp lệ", "hộ trống" và "lỗi mạng/server tạm thời", để hiển thị đúng thông báo cho từng trường hợp.

## Implementation Decisions

- **Kiến trúc**: thêm một API serverless (Vercel Functions, chạy Node) làm cầu nối **duy nhất** tới nơi lưu trữ thật. Trình duyệt không bao giờ gọi thẳng dịch vụ lưu trữ, luôn đi qua API này.
- **Lưu trữ**: Vercel Blob — 1 blob cho mỗi hộ gia đình, đường dẫn blob suy ra trực tiếp và tất định từ Mã hộ gia đình. Mỗi lần ghi phải **ghi đè đúng blob đó** (không tạo blob mới mỗi lần), để luôn đọc đúng bản mới nhất qua 1 đường dẫn cố định và tránh rác dữ liệu cũ.
- **API**: một endpoint tham số hoá theo Mã hộ gia đình, hỗ trợ đọc dữ liệu hiện có của hộ và ghi đè toàn bộ dữ liệu của hộ (ghi đè cả record, không ghi từng phần) — đúng tinh thần ADR-0001. Đọc một hộ chưa từng được ghi trả về trạng thái "trống", không phải lỗi.
- **Mã hộ gia đình**: sinh ở phía trình duyệt bằng CSPRNG (`crypto.getRandomValues`), đủ dài để không đoán được bằng vét cạn. "Tạo hộ gia đình" không cần endpoint riêng — hộ được tạo ngầm định ngay ở lần ghi đầu tiên với mã đó; GET trên mã chưa từng ghi không tự tạo record rỗng.
- **Không xác thực danh tính**: chỉ cần biết đúng mã là đọc/ghi được, đúng theo CONTEXT.md ("Mã hộ gia đình... thay thế hoàn toàn cho đăng nhập tài khoản"). Server chỉ kiểm tra định dạng mã hợp lệ và giới hạn kích thước payload, không kiểm tra "ai" đang ghi.
- **Định tuyến URL**: thêm một rewrite rule tĩnh để đường dẫn dạng `/h/<mã>` cũng trả về trang chính (tránh 404 trên static hosting); mã hộ gia đình đọc từ đường dẫn URL ở phía client, không dùng thư viện router.
- **Mô hình đồng bộ** (theo ADR-0001 — không real-time, không xử lý xung đột): khi có 1 hộ gia đình đang hoạt động, ứng dụng đọc dữ liệu hộ 1 lần khi mở trang. `localStorage` vẫn là nơi đọc/ghi tức thời cho mọi thao tác trong phiên (giữ nguyên trải nghiệm nhanh hiện tại). Mọi thay đổi được đẩy lên hộ gia đình theo kiểu ghi-qua có **debounce** (gộp các thay đổi liên tiếp trong một khoảng ngắn thành 1 lần ghi), thay vì gọi API riêng cho từng đột biến trạng thái.
- **Khi lỗi mạng/ghi thất bại**: thay đổi vẫn giữ nguyên trong `localStorage` (không mất), app tự thử ghi lại, và hiển thị rõ trạng thái đồng bộ (đã lưu / đang lưu / lỗi) cho người dùng.
- **Phạm vi dữ liệu đồng bộ**: toàn bộ — ngân hàng món ăn, thực đơn hôm nay, lịch sử, yêu thích, trạng thái tick đi chợ, bộ lọc chay hiện tại.
- **UI mới**: một khối "Hộ gia đình" cho phép Tạo hộ gia đình mới (hiển thị + copy link chia sẻ), Rời hộ gia đình hiện tại, và xem trạng thái đồng bộ hiện tại.
- **Khởi tạo dữ liệu khi tạo hộ**: nếu người dùng đã có dữ liệu local sẵn có tại thời điểm tạo hộ, dữ liệu đó trở thành nội dung khởi tạo được ghi lên hộ (seed từ local → backend).
- **Mã Mã hộ gia đình đang dùng**: lưu lại cục bộ (một key `localStorage` mới, chỉ chứa mã hộ đang tham gia — không phải dữ liệu hộ) để lần mở sau không cần lại URL vẫn biết đang thuộc hộ nào.

## Testing Decisions

- Test tốt kiểm tra **hành vi bên ngoài** (input → output) của các hàm thuần trong seam mới, không test việc gọi mạng/storage thật.
- Seam mới — module thuần (không đụng DOM, không đụng network thật, không đụng storage thật), dùng chung ở cả trình duyệt lẫn API serverless: sinh mã hộ gia đình, kiểm tra định dạng mã hợp lệ, chuyển state của app thành payload lưu trữ, và đọc payload lưu trữ về (tự xử lý an toàn nếu dữ liệu thiếu/hỏng). 100% hàm export của module này có test.
- Tiền lệ: giống `logic.js` / `logic.test.js` ở Phase 1 — cùng cách tổ chức, cùng Vitest, cùng nguyên tắc "1 seam".
- KHÔNG test tích hợp thật với Vercel Blob / API serverless / `fetch` trình duyệt trong bộ test tự động ở phase này — cần môi trường Vercel thật, không mô phỏng đầy đủ ở local. Sẽ kiểm chứng thủ công qua trình duyệt thật sau khi deploy, theo đúng cách Phase 1 đã làm.

## Out of Scope

- Đồng bộ real-time / thông báo khi có thay đổi từ thiết bị khác (ngoài phạm vi theo ADR-0001).
- Xử lý/gộp xung đột khi ghi đồng thời (chỉ ghi đè theo thời gian, không cảnh báo — theo ADR-0001).
- Xác thực danh tính hay phân quyền thành viên trong hộ — không có khái niệm "ai" trong hộ, mọi người có mã đều ngang quyền.
- Xoá hộ gia đình vĩnh viễn, giới hạn/dọn dẹp dung lượng lưu trữ dài hạn.
- Phase 3 (Lịch thực đơn tuần) — không đụng trong spec này.
- Router phía client / nhiều trang — chỉ 1 rewrite rule tĩnh, không thêm thư viện điều hướng.

## Further Notes

- Xem [CONTEXT.md](../CONTEXT.md) (Hộ gia đình, Mã hộ gia đình, Đồng bộ) và [ADR-0001](adr/0001-centralized-storage-no-session-sync.md) — spec này hiện thực hoá đúng các quyết định đã chốt ở đó.
- Bật Vercel Blob trong dashboard là bước xác nhận thủ công 1 lần (tương tự bước bật Web Analytics trước đó trong dự án) — người dùng cần tự thực hiện khi tới bước đó, tương tự các lần trước trong phiên làm việc.
