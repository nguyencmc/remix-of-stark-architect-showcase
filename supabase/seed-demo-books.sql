-- Demo Books Seed Data
-- Includes complete books with cover images, chapters, and content
-- Run on Supabase SQL Editor

-- First, insert book categories (only if not exists)
INSERT INTO public.book_categories (name, slug, description, display_order, is_featured)
SELECT * FROM (VALUES
  ('Phát Triển Bản Thân', 'phat-trien-ban-than', 'Sách phát triển bản thân và kỹ năng sống', 1, true),
  ('Kinh Doanh', 'kinh-doanh', 'Sách về kinh doanh và khởi nghiệp', 2, true),
  ('Tâm Lý Học', 'tam-ly-hoc', 'Sách về tâm lý học và hành vi con người', 3, true),
  ('Lập Trình', 'lap-trinh', 'Sách về công nghệ và lập trình', 4, false)
) AS v(name, slug, description, display_order, is_featured)
WHERE NOT EXISTS (SELECT 1 FROM public.book_categories WHERE slug = v.slug);


-- =============================================
-- BOOK 1: Đắc Nhân Tâm
-- =============================================
DO $$
DECLARE
  book_id_1 UUID;
  category_id UUID;
BEGIN
  SELECT id INTO category_id FROM book_categories WHERE slug = 'phat-trien-ban-than' LIMIT 1;
  
  INSERT INTO public.books (
    title, slug, description, author_name, cover_url, category_id,
    page_count, read_count, rating, difficulty, is_featured, content
  ) VALUES (
    'Đắc Nhân Tâm',
    'dac-nhan-tam',
    'Đắc nhân tâm là cuốn sách nổi tiếng nhất, bán chạy nhất và có ảnh hưởng nhất của mọi thời đại. Tác phẩm đã được chuyển ngữ sang hầu hết các thứ tiếng trên thế giới và có mặt tại hơn 150 quốc gia.',
    'Dale Carnegie',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    category_id,
    320, 15234, 4.9, 'beginner', true,
    E'# Đắc Nhân Tâm\n\n## Lời giới thiệu\n\nĐắc nhân tâm - How to Win Friends and Influence People của Dale Carnegie ra đời năm 1936 đã trở thành một hiện tượng văn hóa.\n\n## Phần 1: Nghệ thuật ứng xử cơ bản\n\n### Chương 1: Nếu muốn lấy mật, đừng đá vào tổ ong\n\nNguyên tắc 1: Đừng phê bình, lên án hay than phiền.\n\nVào ngày 7 tháng 5 năm 1931, cuộc săn lùng tội phạm giật gân nhất mà New York từng chứng kiến đã kết thúc. Sau nhiều tuần truy đuổi, "Two Gun" Crowley - kẻ giết người, tên cướp không bao giờ uống rượu - bị dồn vào bước đường cùng trong căn hộ của bạn gái trên Đại lộ West End.\n\nMột trăm năm mươi cảnh sát bao vây ngôi nhà. Họ đục lỗ trên mái nhà, cố gắng xông hơi ngạt "kẻ giết người cop" bằng hơi cay. Súng máy được gắn trên các tòa nhà xung quanh. Trong hơn một tiếng đồng hồ, khu phố thanh lịch này rung chuyển bởi tiếng súng.\n\nCrowley núp sau một chiếc ghế bành, liên tục bắn vào cảnh sát. Mười nghìn người đứng xem trận chiến. Không gì giống thế này từng xảy ra trước đây trên vỉa hè New York.\n\n### Chương 2: Bí quyết lớn trong nghệ thuật đối nhân xử thế\n\nNguyên tắc 2: Hãy ghi nhận một cách chân thành và thành thật.\n\nJohn Dewey, một trong những triết gia nổi tiếng nhất của Mỹ, đã nói rằng khao khát sâu xa nhất trong bản chất con người là mong muốn được quan trọng.\n\nĐây là một khát khao mạnh mẽ và dai dẳng. "Sự khao khát được quan trọng" là một trong những khác biệt chính giữa loài người và động vật.\n\n### Chương 3: Ai có thể làm được điều này sẽ có cả thế giới về mình\n\nNguyên tắc 3: Khơi gợi ở người khác sự háo hức muốn làm điều bạn gợi ý.\n\nTại sao nói về những gì chúng ta muốn? Đó là trẻ con. Tất nhiên, bạn quan tâm đến những gì bạn muốn. Nhưng không ai khác quan tâm. Phần còn lại của chúng ta cũng giống như bạn: chúng ta quan tâm đến những gì chúng ta muốn.\n\n## Phần 2: Sáu cách để người khác yêu thích bạn\n\n### Chương 4: Làm điều này và bạn sẽ được chào đón mọi nơi\n\nNguyên tắc 4: Hãy thực sự quan tâm đến người khác.\n\nBạn có thể có được nhiều bạn bè trong hai tháng bằng cách thực sự quan tâm đến người khác hơn là bạn có thể có trong hai năm bằng cách cố gắng khiến người khác quan tâm đến bạn.\n\n### Chương 5: Một cách đơn giản để tạo ấn tượng tốt đẹp\n\nNguyên tắc 5: Hãy mỉm cười.\n\nNụ cười nói: "Tôi thích bạn. Bạn làm tôi vui. Tôi rất vui khi gặp bạn."\n\n### Chương 6: Nếu bạn không làm điều này, bạn sẽ gặp rắc rối\n\nNguyên tắc 6: Hãy nhớ rằng tên của một người là âm thanh ngọt ngào và quan trọng nhất đối với người đó.\n\nChúng ta nên nhận thức được sự kỳ diệu chứa đựng trong một cái tên và nhận ra đây hoàn toàn là tài sản của người mang nó... chứ không phải của ai khác.\n\n## Phần 3: Cách thuyết phục người khác theo lối nghĩ của bạn\n\n### Chương 7: Bạn không thể thắng trong cuộc tranh cãi\n\nNguyên tắc 7: Cách duy nhất để có được điều tốt nhất từ một cuộc tranh cãi là tránh nó.\n\nChín lần trong mười, cuối cuộc tranh cãi mỗi bên đều tin chắc hơn bao giờ hết rằng mình hoàn toàn đúng.\n\n### Chương 8: Cách chắc chắn để tạo kẻ thù - và cách tránh điều đó\n\nNguyên tắc 8: Tôn trọng ý kiến của người khác. Đừng bao giờ nói "Bạn sai rồi."\n\nKhi bạn nói với ai đó rằng họ sai, bạn đã đánh vào lòng tự trọng của họ. Bạn đã khiến họ muốn phản击 lại. Bạn đã thách thức trí tuệ, phán đoán, niềm tự hào và lòng tự trọng của họ.\n\n## Kết luận\n\nĐắc nhân tâm không chỉ là cuốn sách dạy kỹ năng giao tiếp, mà còn là kim chỉ nam cho nghệ thuật sống. Những nguyên tắc trong sách có thể áp dụng vào mọi khía cạnh của cuộc sống, từ công việc đến các mối quan hệ cá nhân.'
  ) RETURNING id INTO book_id_1;

  -- Add chapters
  INSERT INTO public.book_chapters (book_id, title, position, chapter_order) VALUES
  (book_id_1, 'Lời giới thiệu', 0, 1),
  (book_id_1, 'Chương 1: Nếu muốn lấy mật, đừng đá vào tổ ong', 500, 2),
  (book_id_1, 'Chương 2: Bí quyết lớn trong nghệ thuật đối nhân xử thế', 1500, 3),
  (book_id_1, 'Chương 3: Ai có thể làm được điều này sẽ có cả thế giới về mình', 2200, 4),
  (book_id_1, 'Chương 4: Làm điều này và bạn sẽ được chào đón mọi nơi', 2800, 5),
  (book_id_1, 'Chương 5: Một cách đơn giản để tạo ấn tượng tốt đẹp', 3300, 6),
  (book_id_1, 'Chương 6: Nếu bạn không làm điều này, bạn sẽ gặp rắc rối', 3700, 7),
  (book_id_1, 'Chương 7: Bạn không thể thắng trong cuộc tranh cãi', 4200, 8),
  (book_id_1, 'Chương 8: Cách chắc chắn để tạo kẻ thù', 4700, 9),
  (book_id_1, 'Kết luận', 5200, 10);
END $$;

-- =============================================
-- BOOK 2: Tư Duy Nhanh Và Chậm
-- =============================================
DO $$
DECLARE
  book_id_2 UUID;
  category_id UUID;
BEGIN
  SELECT id INTO category_id FROM book_categories WHERE slug = 'tam-ly-hoc' LIMIT 1;
  
  INSERT INTO public.books (
    title, slug, description, author_name, cover_url, category_id,
    page_count, read_count, rating, difficulty, is_featured, content
  ) VALUES (
    'Tư Duy Nhanh Và Chậm',
    'tu-duy-nhanh-va-cham',
    'Cuốn sách bàn về hai hệ thống tư duy trong não bộ: Hệ thống 1 (nhanh, trực giác) và Hệ thống 2 (chậm, logic). Daniel Kahneman giải thích cách chúng ta ra quyết định và những thiên kiến nhận thức phổ biến.',
    'Daniel Kahneman',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop',
    category_id,
    480, 8923, 4.8, 'advanced', true,
    E'# Tư Duy Nhanh Và Chậm\n\n## Giới thiệu: Hai hệ thống\n\nĐể quan sát bộ não của bạn hoạt động tự động, hãy nhìn vào hình ảnh sau:\n\nMột người phụ nữ với khuôn mặt giận dữ.\n\nTrải nghiệm của bạn khi nhìn khuôn mặt của cô ấy kết hợp liền mạch những gì chúng ta thường gọi là nhìn thấy và tư duy trực giác. Một cách chắc chắn và nhanh chóng như bạn nhìn thấy mái tóc đen của người phụ nữ trẻ, bạn biết rằng cô ấy đang giận dữ.\n\n## Phần I: Hai Hệ Thống\n\n### Chương 1: Các nhân vật của câu chuyện\n\nNhà tâm lý học Keith Stanovich và Richard West đã đưa ra thuật ngữ Hệ thống 1 và Hệ thống 2.\n\n**Hệ thống 1** hoạt động tự động và nhanh chóng, với ít hoặc không cần nỗ lực và không có cảm giác kiểm soát tự nguyện.\n\n**Hệ thống 2** phân bổ sự chú ý cho các hoạt động tinh thần đòi hỏi nỗ lực, bao gồm các tính toán phức tạp.\n\nCác hoạt động tự động được gán cho Hệ thống 1 bao gồm:\n- Phát hiện một vật thể ở xa hơn vật thể khác\n- Định hướng đến nguồn của âm thanh đột ngột\n- Hoàn thành cụm từ "bánh mì và..."\n- Nhận ra giọng thù địch\n- Trả lời 2 + 2 = ?\n- Đọc các từ trên các biển quảng cáo lớn\n- Lái xe trên con đường trống\n\n### Chương 2: Sự chú ý và nỗ lực\n\nNếu bạn muốn trải nghiệm Hệ thống 2 của bạn làm việc căng thẳng đến mức nào, hãy thử bài tập sau. Đây là bài Test Thêm-1.\n\nBạn sẽ được đưa cho một loạt bốn chữ số, như:\n\n5 7 4 2\n\nNhiệm vụ của bạn là thêm 1 vào mỗi chữ số và đọc kết quả, tạo thành:\n\n6 8 5 3\n\n### Chương 3: Bộ điều khiển lười biếng\n\nHệ thống 2 có một tốc độ đi bộ tự nhiên tương ứng với việc phân bổ một lượng chú ý nhỏ cho các nhiệm vụ đang diễn ra.\n\n## Phần II: Mô hình phỏng đoán và thiên kiến\n\n### Chương 4: Máy liên tưởng\n\nBắt đầu bằng việc xem hai từ:\n\n**CHUỐI   NÔN**\n\nRất nhiều điều xảy ra với bạn trong một hoặc hai giây vừa qua. Bạn trải nghiệm một số sự kiện không dễ chịu.\n\n### Chương 5: Sự dễ chịu về nhận thức\n\nMột cách đáng tin cậy để khiến người ta tin những tuyên bố sai là lặp lại chúng thường xuyên, bởi vì sự quen thuộc không dễ phân biệt với sự thật.\n\n### Chương 6: Chuẩn mực, ngạc nhiên và nguyên nhân\n\nChức năng chính của Hệ thống 1 là duy trì và cập nhật một mô hình về thế giới cá nhân của bạn, đại diện cho những gì là bình thường trong đó.\n\n## Phần III: Tự tin thái quá\n\n### Chương 7: Ảo tưởng về sự hiểu biết\n\nNgạc nhiên lớn mà hồi tưởng về quá khứ mang lại là chúng ta nghĩ chúng ta hiểu quá khứ, điều này ngụ ý rằng tương lai cũng có thể dự đoán được.\n\n### Chương 8: Ảo tưởng về tính hợp lệ\n\nHệ thống 1 được thiết kế để nhảy đến kết luận từ bằng chứng hạn chế - và đó chính xác là những gì nó làm.\n\n## Kết luận\n\nHiểu về hai hệ thống tư duy giúp chúng ta nhận ra giới hạn của trực giác và tầm quan trọng của việc suy nghĩ cẩn thận trong các quyết định quan trọng.'
  ) RETURNING id INTO book_id_2;

  INSERT INTO public.book_chapters (book_id, title, position, chapter_order) VALUES
  (book_id_2, 'Giới thiệu: Hai hệ thống', 0, 1),
  (book_id_2, 'Chương 1: Các nhân vật của câu chuyện', 400, 2),
  (book_id_2, 'Chương 2: Sự chú ý và nỗ lực', 1200, 3),
  (book_id_2, 'Chương 3: Bộ điều khiển lười biếng', 1700, 4),
  (book_id_2, 'Chương 4: Máy liên tưởng', 2000, 5),
  (book_id_2, 'Chương 5: Sự dễ chịu về nhận thức', 2400, 6),
  (book_id_2, 'Chương 6: Chuẩn mực, ngạc nhiên và nguyên nhân', 2700, 7),
  (book_id_2, 'Chương 7: Ảo tưởng về sự hiểu biết', 3000, 8),
  (book_id_2, 'Chương 8: Ảo tưởng về tính hợp lệ', 3400, 9),
  (book_id_2, 'Kết luận', 3800, 10);
END $$;

-- =============================================
-- BOOK 3: Người Giàu Nhất Thành Babylon
-- =============================================
DO $$
DECLARE
  book_id_3 UUID;
  category_id UUID;
BEGIN
  SELECT id INTO category_id FROM book_categories WHERE slug = 'kinh-doanh' LIMIT 1;
  
  INSERT INTO public.books (
    title, slug, description, author_name, cover_url, category_id,
    page_count, read_count, rating, difficulty, is_featured, content
  ) VALUES (
    'Người Giàu Nhất Thành Babylon',
    'nguoi-giau-nhat-thanh-babylon',
    'Cuốn sách kinh điển về quản lý tài chính cá nhân thông qua những câu chuyện ngụ ngôn từ thành Babylon cổ đại. Những bài học về tiết kiệm, đầu tư và làm giàu vẫn còn nguyên giá trị sau hàng nghìn năm.',
    'George S. Clason',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop',
    category_id,
    200, 12456, 4.7, 'beginner', true,
    E'# Người Giàu Nhất Thành Babylon\n\n## Lời nói đầu\n\nBabylon - thành phố lớn nhất và giàu có nhất thế giới cổ đại. Những bức tường thành hùng vĩ, những khu vườn treo nổi tiếng, và những con đường lát đá mài - tất cả đều là minh chứng cho sự thịnh vượng của nền văn minh này.\n\nNhưng điều gì đã làm cho Babylon trở nên giàu có? Câu trả lời nằm trong những bí mật về tiền bạc mà người Babylon đã khám phá ra.\n\n## Chương 1: Người đàn ông muốn có vàng\n\nArkad được biết đến là người giàu nhất thành Babylon. Ông rộng lượng trong việc từ thiện. Nhà ông lộng lẫy. Ông cũng rộng rãi với gia đình.\n\nMột ngày nọ, hai người bạn thời thơ ấu của ông, Bansir - thợ làm xe ngựa và Kobbi - nhạc sĩ, đến gặp ông.\n\n"Chúng tôi đã làm việc chăm chỉ cả đời," Bansir nói. "Nhưng chúng tôi vẫn không có tiền. Làm sao ông trở nên giàu có như vậy?"\n\nArkad mỉm cười. "Hồi trẻ, ta cũng nghèo như các ngươi. Ta làm người chép văn bản. Ta làm việc nhiều giờ và không có tiền thừa."\n\n"Vậy điều gì đã thay đổi?" Kobbi hỏi.\n\n"Ta đã học được một bí mật đơn giản," Arkad trả lời.\n\n## Chương 2: Người giàu nhất thành Babylon\n\n### Bảy phương thuốc chữa cái ví xẹp\n\n**Phương thuốc thứ nhất: Bắt đầu làm đầy ví tiền của bạn**\n\nVới mỗi mười đồng xu bạn kiếm được, hãy chỉ tiêu chín đồng. Đây là luật đầu tiên của sự giàu có.\n\n"Nhưng tất cả những gì tôi kiếm được đều cần để sống," bạn có thể nói. Sai! Bạn tiêu tất cả những gì bạn kiếm được và vẫn sống. Hãy học cách sống với chín phần mười.\n\n**Phương thuốc thứ hai: Kiểm soát chi tiêu**\n\nGhi chép lại những mong muốn của bạn. Từ danh sách này, chọn những thứ cần thiết và có thể đáp ứng được bằng chín phần mười thu nhập của bạn.\n\nKhông nên nhầm lẫn chi tiêu cần thiết với mong muốn.\n\n**Phương thuốc thứ ba: Làm cho vàng của bạn sinh sôi**\n\nKhi bạn đã dành dụm được vàng, hãy đặt nó làm việc cho bạn. Đầu tư một cách khôn ngoan để vàng sinh vàng.\n\n**Phương thuốc thứ tư: Bảo vệ kho báu của bạn khỏi thua lỗ**\n\nĐầu tư chỉ ở những nơi vốn của bạn an toàn. Tránh những kế hoạch hứa hẹn lợi nhuận cao bất thường.\n\n**Phương thuốc thứ năm: Biến nhà bạn thành một khoản đầu tư sinh lời**\n\nSở hữu ngôi nhà của riêng bạn. Khi bạn trả tiền thuê nhà, bạn không xây dựng được gì. Khi bạn trả tiền mua nhà, bạn đang tích lũy tài sản.\n\n**Phương thuốc thứ sáu: Đảm bảo thu nhập tương lai**\n\nHãy chuẩn bị cho tuổi già và bảo vệ gia đình. Đầu tư đều đặn để có thu nhập khi không còn làm việc được.\n\n**Phương thuốc thứ bảy: Nâng cao khả năng kiếm tiền**\n\nHọc hỏi và trau dồi kỹ năng. Bạn càng biết nhiều, bạn càng có giá trị và kiếm được nhiều hơn.\n\n## Chương 3: Năm luật vàng\n\n1. Vàng đến dễ dàng và tăng lên cho người tiết kiệm ít nhất một phần mười thu nhập.\n\n2. Vàng làm việc chăm chỉ cho chủ nhân khôn ngoan, sinh sôi như đàn gia súc trên đồng cỏ.\n\n3. Vàng trung thành với chủ nhân thận trọng đầu tư theo lời khuyên của những người khôn ngoan.\n\n4. Vàng trốn chạy khỏi người đầu tư vào những việc mình không hiểu hoặc không được người có kinh nghiệm khuyên.\n\n5. Vàng tan biến khỏi người cố gắng kiếm lợi nhanh hoặc theo những kế hoạch lừa đảo.\n\n## Kết luận\n\nNhững bài học từ Babylon cổ đại vẫn đúng cho đến ngày nay:\n\n- Tiết kiệm một phần thu nhập\n- Đầu tư khôn ngoan  \n- Bảo vệ tài sản\n- Liên tục học hỏi\n\nSự giàu có không đến từ may mắn, mà từ kỷ luật và hiểu biết.'
  ) RETURNING id INTO book_id_3;

  INSERT INTO public.book_chapters (book_id, title, position, chapter_order) VALUES
  (book_id_3, 'Lời nói đầu', 0, 1),
  (book_id_3, 'Chương 1: Người đàn ông muốn có vàng', 400, 2),
  (book_id_3, 'Chương 2: Người giàu nhất thành Babylon', 1100, 3),
  (book_id_3, 'Chương 3: Năm luật vàng', 3500, 4),
  (book_id_3, 'Kết luận', 4200, 5);
END $$;

-- =============================================
-- BOOK 4: Clean Code - Nghệ thuật viết code sạch
-- =============================================
DO $$
DECLARE
  book_id_4 UUID;
  category_id UUID;
BEGIN
  SELECT id INTO category_id FROM book_categories WHERE slug = 'lap-trinh' LIMIT 1;
  
  INSERT INTO public.books (
    title, slug, description, author_name, cover_url, category_id,
    page_count, read_count, rating, difficulty, is_featured, content
  ) VALUES (
    'Clean Code - Nghệ thuật viết code sạch',
    'clean-code-nghe-thuat-viet-code-sach',
    'Cuốn sách kinh điển dành cho lập trình viên. Học cách viết code dễ đọc, dễ bảo trì và chuyên nghiệp từ Robert C. Martin, một trong những tác giả có ảnh hưởng nhất trong ngành phần mềm.',
    'Robert C. Martin',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop',
    category_id,
    450, 6789, 4.9, 'intermediate', true,
    E'# Clean Code - Nghệ thuật viết code sạch\n\n## Giới thiệu\n\nViết code sạch không chỉ là về việc code hoạt động. Đó là về việc viết code mà người khác có thể đọc, hiểu và bảo trì.\n\n## Chương 1: Code sạch là gì?\n\n### Định nghĩa của các chuyên gia\n\n**Bjarne Stroustrup (tác giả C++):**\n"Tôi thích code của mình thanh lịch và hiệu quả. Logic nên đơn giản để bug khó ẩn náu, dependencies tối thiểu để dễ bảo trì, xử lý lỗi hoàn chỉnh theo chiến lược rõ ràng, và hiệu suất gần tối ưu để không ai bị cám dỗ làm code lộn xộn bằng những tối ưu hóa vô nguyên tắc."\n\n**Grady Booch:**\n"Code sạch đơn giản và trực tiếp. Code sạch đọc như văn xuôi được viết tốt. Code sạch không bao giờ che khuất ý định của người thiết kế mà đầy những abstraction sắc nét và những dòng kiểm soát đơn giản."\n\n### Quy tắc Boy Scout\n\n"Hãy để code sạch hơn khi bạn tìm thấy nó."\n\nNếu tất cả chúng ta đều đăng ký một quy tắc đơn giản này, code sẽ trở nên tốt hơn theo thời gian.\n\n## Chương 2: Đặt tên có ý nghĩa\n\n### Sử dụng tên thể hiện ý định\n\n```python\n# Xấu\nd = 5  # số ngày\n\n# Tốt\ndays_since_creation = 5\nelapsed_time_in_days = 5\n```\n\n### Tránh thông tin sai lệch\n\nĐừng đặt tên biến là `accountList` nếu nó không phải là List. Đó có thể gây nhầm lẫn.\n\n### Tạo sự khác biệt có ý nghĩa\n\n```python\n# Xấu\ndef copy(a1, a2):\n    pass\n\n# Tốt  \ndef copy_chars(source, destination):\n    pass\n```\n\n### Sử dụng tên có thể phát âm\n\n```python\n# Xấu\ngenymdhms = None  # generation date, year, month, day, hour, minute, second\n\n# Tốt\ngeneration_timestamp = None\n```\n\n## Chương 3: Hàm\n\n### Nhỏ!\n\nQuy tắc đầu tiên của hàm là chúng nên nhỏ. Quy tắc thứ hai là chúng nên nhỏ hơn nữa.\n\nHàm nên làm một việc, làm tốt việc đó, và chỉ làm việc đó.\n\n### Một mức độ trừu tượng cho mỗi hàm\n\nĐể đảm bảo hàm của chúng ta làm "một việc", chúng ta cần đảm bảo các câu lệnh trong hàm đều ở cùng một mức độ trừu tượng.\n\n### Tham số hàm\n\nSố lượng tham số lý tưởng cho một hàm là:\n- Niladic (không tham số) - tốt nhất\n- Monadic (một tham số) - tốt\n- Dyadic (hai tham số) - chấp nhận được\n- Triadic (ba tham số) - nên tránh\n- Polyadic (nhiều hơn ba) - cần lý do rất đặc biệt\n\n## Chương 4: Comments\n\n### Comments không thay thế code xấu\n\nComments tốt nhất là không có comment. Thay vì viết comment giải thích code phức tạp, hãy viết lại code cho rõ ràng.\n\n```python\n# Xấu\n# Check if employee is eligible for full benefits\nif employee.flags & HOURLY_FLAG and employee.age > 65:\n    pass\n\n# Tốt\nif employee.is_eligible_for_full_benefits():\n    pass\n```\n\n### Comments tốt\n\n- Legal comments (bản quyền)\n- Thông tin cung cấp (giải thích regex phức tạp)\n- Giải thích ý định\n- Warning về hậu quả\n- TODO comments\n\n### Comments xấu\n\n- Mumbling (comment không rõ ràng)\n- Redundant comments\n- Misleading comments\n- Mandated comments\n- Commented-out code\n\n## Chương 5: Định dạng\n\n### Mục đích của định dạng\n\nĐịnh dạng code là về giao tiếp, và giao tiếp là thứ hàng đầu trong công việc của một developer chuyên nghiệp.\n\n### Định dạng dọc\n\n- Các khái niệm liên quan nên gần nhau\n- Biến nên được khai báo gần nơi sử dụng\n- Instance variables nên ở đầu class\n\n### Định dạng ngang\n\n- Giữ dòng code ngắn (80-120 ký tự)\n- Sử dụng khoảng trắng để nhóm những thứ liên quan\n\n## Kết luận\n\nViết code sạch là một nghệ thuật. Nó đòi hỏi sự luyện tập, kiên nhẫn và cam kết liên tục cải thiện. Hãy nhớ:\n\n- Code được đọc nhiều hơn được viết\n- Code sạch dễ test\n- Code sạch dễ bảo trì\n- Code sạch tiết kiệm thời gian về lâu dài\n\nHãy tự hào về craft của bạn. Viết code như thể người tiếp theo đọc nó là một kẻ điên biết địa chỉ nhà bạn.'
  ) RETURNING id INTO book_id_4;

  INSERT INTO public.book_chapters (book_id, title, position, chapter_order) VALUES
  (book_id_4, 'Giới thiệu', 0, 1),
  (book_id_4, 'Chương 1: Code sạch là gì?', 200, 2),
  (book_id_4, 'Chương 2: Đặt tên có ý nghĩa', 1000, 3),
  (book_id_4, 'Chương 3: Hàm', 1900, 4),
  (book_id_4, 'Chương 4: Comments', 2800, 5),
  (book_id_4, 'Chương 5: Định dạng', 3800, 6),
  (book_id_4, 'Kết luận', 4500, 7);
END $$;

-- Update book page counts based on content length
UPDATE books SET page_count = GREATEST(100, LENGTH(content) / 2000 * 10) WHERE content IS NOT NULL;

-- Demo books imported successfully!
