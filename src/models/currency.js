const {
    Schema,
    model
  } = require("mongoose");
  
    module.exports = model('currency', new Schema({
      userID: { type: String },
      guildID: { type: String },
      wallet: { type: Number, default: 100 },
      bank: { type: Number, default: 1000 },
      inventory: { type: Array, default: "nothing" },
      lastUpdated: { type: Date, default: new Date() },
      lastGamble: { type: Number, default: 0 },
      lastWork: { type: Number, default: 0 }
    }));