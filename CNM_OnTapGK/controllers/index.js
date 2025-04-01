const SubjectModel = require("../models/index");
const { uploadFile } = require("../service/file.service"); // Import function uploadFile từ file aws-helper.js
const { validatePayload } = require("../untils/validate"); // Import function validatePayload từ file validate.js
const Controller = {};

// method get sẽ thực hiện lấy tất cả các subject từ table Subject
Controller.get = async (req, res) => {
  /**
   * Bước 1: Thực hiện lấy tất cả các subject từ table Subject bằng method getSubjects của SubjectModel mà ta đã tạo
   * Bước 2: Trả về thông tin của các subject đã lấy
   */
  try {
    const subjects = await SubjectModel.getSubjects();
    console.log("Subjects from Controller:", subjects); // In ra danh sách các subject đã lấy từ table Subject
    return res.render("index", { subjects }); // Trả về thông tin của các subject đã lấy vài index.ejs
    // return res.status(200).json(subjects);
  } catch (error) {
    console.log(error); 
    res.status(500).send("Error getting subjects");
  }
};

// method getOne sẽ thực hiện lấy thông tin của subject dựa vào id
Controller.getOne = async (req, res) => {
  /**
   * Bước 1: Lấy id của subject từ param của request
   * Bước 2: Thực hiện lấy thông tin của subject dựa vào id bằng method getOneSubject của SubjectModel mà ta đã tạo
   * Bước 3: Nếu subject tồn tại thì trả về thông tin của subject
   * Bước 4: Xử lý lỗi nếu có
   */
  try {
    const { id } = req.params;
    const subject = await SubjectModel.getOneSubject(id);
    if (subject) {
      return res.status(200).json(subject);
    }
    else {
        return res.status(404).send("Subject not found");
      }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting subject");
  }
};
// method post sẽ thực hiện tạo mới một subject
Controller.post = async (req, res) => {
  /**
   * Bước 1: Validate dữ liệu trước khi tạo mới subject
   * Bước 2: Nếu dữ liệu không hợp lệ thì trả về lỗi
   * Bước 3: Nếu dữ liệu hợp lệ thì thực hiện tạo mới subject bằng method createSubject của SubjectModel mà ta đã tạo
   * Bước 4: Trả về thông báo tạo mới subject thành công
   * Bước 5: Xử lý lỗi nếu có
   */
  console.log("Request body:", req.body);
  const errors = validatePayload(req.body);
  if (errors) {
    return res.send(errors.join(", ")); // nếu có lỗi thì trả về lỗi 
  }
  const { tenbaiBao, tenNhomTacGia, ISBN, soTrang,namXuatBan } = req.body; // lấy thông tin của subject từ request.body
  const image = req.file; // lấy file ảnh từ request.file
  if (!image) {
    return res.status(400).send("Vui lòng chọn file ảnh!");
  }

  try {
    const imageUrl = await uploadFile(image); // thực hiện upload file ảnh lên S3 và lấy url của file ảnh bằng function đã viết trong file aws-helper.js
    const subject = await SubjectModel.createSubject({
      tenbaiBao,
      tenNhomTacGia,
      ISBN,
      soTrang,
      namXuatBan,
      image: imageUrl,
    });

    console.log("Subject created", subject);
    res.redirect("/subjects"); // sau khi tạo mới subject thành công thì chuyển hướng về trang danh sách các subject
  } catch (error) {
    console.error("Error creating subject from Controller:", error);
    res.status(500).send("Error creating subject from controller");
  }
};
// method delete sẽ thực hiện xóa subject dựa vào id
Controller.delete = async (req, res) => {
  /**
   * Bước 1: Lấy id của subject từ param của request
   * Bước 2: Thực hiện lấy thông tin của subject dựa vào id bằng method getOneSubject của SubjectModel mà ta đã tạo
   */
  try {
    const { id } = req.params;
    const existSubject = await SubjectModel.getOneSubject(id);
    if (!existSubject) {
      return res.status(404).send("Subject not found"); // nếu không tìm thấy subject thì trả về lỗi 404
    }
    const subject = await SubjectModel.deleteSubject(id, existSubject.tenbaiBao);
    if (subject) {
      console.log("Subject deleted", subject);
      res.redirect("/subjects");
    }
  } catch (error) {}
};

module.exports = Controller;