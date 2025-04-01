const nameRegex = /^[a-zA-Z0-9\s\u00C0-\u1EF9]+$/u; // Hỗ trợ chữ cái có dấu, số và khoảng trắng
const authorRegex = /^[a-zA-Z\s\u00C0-\u1EF9]+$/u; // Hỗ trợ chữ cái có dấu và khoảng trắng
const isbnRegex = /^[0-9-]+$/; // Chỉ chấp nhận số và dấu '-'
const pageRegex = /^[0-9]+$/; // Chỉ chấp nhận số nguyên
const yearRegex = /^(19|20)\d{2}$/; // Chỉ chấp nhận năm từ 1900 đến 2099

const checkEmpty = payload => {
  const { tenbaiBao, tenNhomTacGia, ISBN, soTrang, namXuatBan } = payload;
  return !tenbaiBao || !tenNhomTacGia || !ISBN || !soTrang || !namXuatBan;
};

module.exports = {
  validatePayload: payload => {
    const { tenbaiBao, tenNhomTacGia, ISBN, soTrang, namXuatBan } = payload;
    const errors = [];

    if (checkEmpty(payload)) {
      errors.push("Tất cả các trường đều bắt buộc.");
    }

    if (!nameRegex.test(tenbaiBao)) {
      errors.push("Tên bài báo chỉ được chứa chữ (hỗ trợ tiếng Việt), số và khoảng trắng.");
    }

    if (!authorRegex.test(tenNhomTacGia)) {
      errors.push("Tên tác giả chỉ được chứa chữ cái (hỗ trợ tiếng Việt) và khoảng trắng.");
    }

    if (!isbnRegex.test(ISBN)) {
      errors.push("Chỉ số ISBN chỉ được chứa số và dấu '-' (VD: 978-3-16-148410-0).");
    }

    if (!pageRegex.test(soTrang)) {
      errors.push("Số trang phải là số nguyên dương.");
    }

    if (!yearRegex.test(namXuatBan)) {
      errors.push("Năm xuất bản phải nằm trong khoảng 1900-2099.");
    }

    return errors.length > 0 ? errors : null;
  },
};
