const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
  notificationType: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  vehicleProblemDescription: {
    type: String,
    required: true,
  },
  vehicleProblemList: {
    type: Array,
    default: [],
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  expiryTime: {
    type: Date,
  },
});

const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

module.exports = NotificationModel;
