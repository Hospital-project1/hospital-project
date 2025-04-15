// models/MedicalReport.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicalReportSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
    index: true // لإضافة فهرسة لتحسين الأداء
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
    index: true
  },
  reportType: {
    type: String,
    enum: ['xray', 'blood_test', 'mri', 'ultrasound', 'progress', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  details: {
    type: String,
    required: true
  },
  diagnosis: String,
  recommendations: String,
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  files: [{
    url: {
      type: String,
      required: true
    },
    name: String,
    fileType: String
  }],
  isCritical: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['complete','incomplete'],
    default: 'incomplete'
  }
}, {
  timestamps: true // يضيف createdAt و updatedAt تلقائيًا
});

// إضافة فهارس إضافية
medicalReportSchema.index({ date: -1 }); // للفرز حسب التاريخ
medicalReportSchema.index({ reportType: 1 }); // للبحث حسب النوع

module.exports = mongoose.model("MedicalReport", medicalReportSchema);