const {dynamodb} = require("../untils/aws-helper"); //import DynamoDB
const {v4:uuidv4} = require("uuid");// import thư  uuid 

const tableName = "paper"; // Tên của table đã tạo trong DynamoDB

const SubjectModel = {
    createSubject: async paperData => {
        /**
         * Bước 1: Tạo một unique ID cho subject
         * Bước 2: Tạo một object params chứa thông tin của subject
         * Bước 3: Thực hiện thêm subject vào table Subject
         * Bước 4: Trả về thông tin của subject đã tạo
         * Bước 5: Xử lý lỗi nếu có
         */
        const subjectId = uuidv4(); // Tạo unique ID cho subject
        const params = {
          TableName: tableName, // Tên của table trong DynamoDB
          Item: {
            // Thông tin của subject cần thêm
            id: subjectId,
            tenbaiBao: paperData.tenbaiBao,
            tenNhomTacGia: paperData.tenNhomTacGia,
            ISBN: paperData.ISBN,
            soTrang: paperData.soTrang,
            namXuatBan: paperData.namXuatBan,
            image: paperData.image, // URL của file ảnh đã upload lên S3   
          },
        };
        try {
          await dynamodb.put(params).promise(); // Thêm subject vào table bằng method put
          // return { id: subjectId, ...paperData };
          return params.Item; // Trả về thông tin của subject đã tạo
        } catch (error) {
          console.error("Error creating subject from model:", error);
          throw error;  
        }
      },
      // Method getSubjects sẽ thực hiện lấy tất cả các subject từ table Subject
  getSubjects: async () => {
    /**
     * Bước 1: Tạo một object params chứa thông tin của table Subject
     * Bước 2: Thực hiện lấy tất cả các subject từ table Subject bằng method scan
     * Bước 3: Trả về thông tin của các subject đã lấy
     */
    const params = {
      TableName: tableName,
    };
    try {
      const subjects = await dynamodb.scan(params).promise();
      return subjects.Items || []; // Trả về danh sách các subject đã lấy, nếu không có subject nào thì trả về mảng rỗng
    } catch (error) {
      console.error("Error getting subjects:", error);
      throw error;
    }
  },
  // method delete sẽ thực hiện xoá subject khỏi table
  deleteSubject: async (subjectId, name) => {
    /**
     * Bước 1: Tạo một object params chứa thông tin của subject cần xoá
     * Bước 2: Thực hiện xoá subject bằng method delete
     * Bước 3: Trả về thông tin của subject đã xoá
     * Bước 4: Xử lý lỗi nếu có
     */
    const params = {
      TableName: tableName,
      Key: {
        id: subjectId, // id là partition key
        tenbaiBao: name, // bởi vì chúng ta có thêm sort key nên cần thêm name vào key
      },
    };
    try {
      await dynamodb.delete(params).promise();
      return { id: subjectId }; // Trả về thông tin của subject sau khi xoá
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  },
   // method getOneSubject sẽ thực hiện lấy thông tin của một subject dựa trên subjectId
   getOneSubject: async subjectId => {
    /**
     * Bước 1: Tạo một object params chứa thông tin của subject cần lấy
     * Bước 2: Thực hiện lấy thông tin của subject bằng method query
     * Bước 3: Trả về thông tin của subject đã lấy
     * Bước 4: Xử lý lỗi nếu có
     */
    const params = {
      TableName: tableName,
      KeyConditionExpression: "id = :id", // Điều kiện để lấy subject dựa trên subjectId
      // Giá trị của điều kiện trên
      ExpressionAttributeValues: {
        ":id": subjectId,
      },
    };
    try {
      const data = await dynamodb.query(params).promise(); // Lấy thông tin của subject dựa trên subjectId
      return data.Items[0]; // Trả về thông tin của subject đã lấy (chỉ có 1 subject)
    } catch (error) {
      console.error("Error getting one subject:", error);
      throw error;
    }
  },
}
module.exports = SubjectModel;