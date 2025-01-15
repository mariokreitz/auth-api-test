import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String, required: true },
});

const Audit = mongoose.model("Audit", auditSchema);
export default Audit;
