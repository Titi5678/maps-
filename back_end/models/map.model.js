const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mapSchema = new Schema({
    consequence: {type: Object, required: true},
    imageId: {type: String, required: true},
    address: {type: Object, required: true},
    streets: {type: Array, required: true},
    dataType: {type: String, required: true},
    validities: {type: Array, required: true},
    description: {type: String, required: true},
    messageId: {type: String, required: true},
    section: {type:String, required: true},
    source: {type: String, required: true},
    uri: {type: String, required: true},
    removed: {type: Boolean, required: true},
    street: {type: Array, required: true},
    name: {type: String, required: true},
    property: {type: Array, required: true},
    location: {type: Object, required: true},
    id: {type: String, required: true},
    validity: {type: Array, required: true},
    operatorId: {type: String, required: true},
    properties: {type: Array, required: true}
});

const tbl_map = mongoose.model('map_tbl', mapSchema);

module.exports = tbl_map;