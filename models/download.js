const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadSchema = new Schema({
    fileUrl: String,
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required: true,
    }
});

module.exports = mongoose.model("downloadfile", downloadSchema);


// const Sequelize = require('sequelize');
// const sequelize = require("../util/database");

// const download = sequelize.define("downloadFile",{
//     id:{
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },
//     fileUrl:{
//         type: Sequelize.STRING
//     }
// });

// module.exports = download;//