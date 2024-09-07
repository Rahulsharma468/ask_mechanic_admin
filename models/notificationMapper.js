const mongoose = require('mongoose');

const NotificationMapperSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
  },
  didAccept: {
    type: Boolean,
    default: false,
  },
  currentTime: {
    type: Date,
    default: Date.now,
  },
});

const NotificationMapperModel = mongoose.models.NotificationMapper || mongoose.model('NotificationMapper', NotificationMapperSchema);

module.exports = NotificationMapperModel;
