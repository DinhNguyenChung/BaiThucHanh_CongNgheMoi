// const {dynamodb} = require("../untils/aws-helper"); //import DynamoDB
// const {v4:uuidv4} = require("uuid");// import thư  uuid 

// const tableName = "paper"; // Tên của table đã tạo trong DynamoDB

// const SubjectModel = {
//     createSubject: async paperData => {
//         /**
//          * Bước 1: Tạo một unique ID cho subject
//          * Bước 2: Tạo một object params chứa thông tin của subject
//          * Bước 3: Thực hiện thêm subject vào table Subject
//          * Bước 4: Trả về thông tin của subject đã tạo
//          * Bước 5: Xử lý lỗi nếu có
//          */
//         const subjectId = uuidv4(); // Tạo unique ID cho subject
//         const params = {
//           TableName: tableName, // Tên của table trong DynamoDB
//           Item: {
//             // Thông tin của subject cần thêm
//             id: subjectId,
//             tenBaiBao: paperData.tenBaiBao,
//             tenNhomTacGia: paperData.tenNhomTacGia,
//             ISBN: paperData.ISBN,
//             soTrang: paperData.soTrang,
//             namXuatBan: paperData.namXuatBan,
//           },
//         };
//         try {
//           await dynamodb.put(params).promise(); // Thêm subject vào table bằng method put
//           return { id: subjectId, ...paperData };
//         } catch (error) {
//           console.error("Error creating subject:", error);
//           throw error;
//         }
//       },
//       // Method getSubjects sẽ thực hiện lấy tất cả các subject từ table Subject
//   getSubjects: async () => {
//     /**
//      * Bước 1: Tạo một object params chứa thông tin của table Subject
//      * Bước 2: Thực hiện lấy tất cả các subject từ table Subject bằng method scan
//      * Bước 3: Trả về thông tin của các subject đã lấy
//      */
//     const params = {
//       TableName: tableName,
//     };
//     try {
//       const subjects = await dynamodb.scan(params).promise();
//       return subjects.Items;
//     } catch (error) {
//       console.error("Error getting subjects:", error);
//       throw error;
//     }
//   },
// }
// module.exports = SubjectModel;