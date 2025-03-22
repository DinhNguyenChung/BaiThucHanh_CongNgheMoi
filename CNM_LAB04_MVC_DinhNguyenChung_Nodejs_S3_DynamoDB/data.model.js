const {dynamodb} = require("./aws.helper");
const tableName = "Subject";

const SubjectModel ={
    createSubject: async (subjectData)=>{
        const params ={
            TableName: tableName,
            Item:{
                id:subjectData.id,
                stt:subjectData.id,
                tenMonHoc:subjectData.tenMonHoc,
                loai:subjectData.loai,
                hocKy: subjectData.hocKy,
                khoa: subjectData.khoa,
                image: subjectData.image,
            },
        };
        try {
            await dynamodb.put(params).promise()
            return params.Item;
        } catch (error) {
            console.error("Error creating subject: ", error);
            throw error;
        }
    },
    // Get all data subject from table
    getSubjects: async()=>{
        const params ={
            TableName:tableName,
        };
        try {
            const subjects = await dynamodb.scan(params).promise();
            return subjects.Items;
        } catch (error) {
            console.error("Error geting subjects: ".error);
            throw error;
        }
    },
    updateSubject: async (stt,subjectData)=>{
        const params ={
            TableName:tableName,
            Key:{
                id:stt,
            },
            UpdateExpression:
            "set tenMonHoc = :tenMonHoc, loai = :loai, hocKy = :hocKy, khoa= :khoa",
            ExpressionAtrributeValues :{
                ":tenMonHoc":subjectData.tenMonHoc,
                ":loai":subjectData.loai,
                ":hocKy":subjectData.hocKy,
                ":khoa":subjectData.khoa,
                ":image":subjectData.image,
            },
            ReturnValues:"ALL_NEW",
        };
        try {
            const updateSubject = await dynamodb.update(params).promise();
            return updateSubject.Attributes;
        } catch (error) {
            console.error("Error updating subject: ",error);
            throw error;
        }
    },
    deleteSubject: async (stt,tenMonHoc)=>{
        const params ={
            TableName:tableName,
            Key:{
                id:stt,
                tenMonHoc:tenMonHoc,
            },
            
        };
        try {
             await dynamodb.delete(params).promise();
            return {id:stt};
        } catch (error) {
            console.error("Error deleting subject: ",error);
            throw error;
        }
    },
    // Lấy thống tin của 1 subject theo id
    getOneSubject: async (stt)=>{
        const params ={
            TableName:tableName,

            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": stt,
            },
        };
        try {
            const subject = await dynamodb.query(params).promise();
            return subject.Items[0];
        } catch (error) {
            console.error("Error getting subject by ID: ",error);
            throw error;
        }
    },
};
module.exports = SubjectModel;