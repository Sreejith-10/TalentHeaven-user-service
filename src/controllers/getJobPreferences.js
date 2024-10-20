import { sendToQueue } from "../config/amqp.js";
import UserModel from "../models/userModel.js";

export const getJobPreferences = async (uid, reply) => {
  if (uid) {
    const preferences = await UserModel.findOne({ user_id: uid });
    await sendToQueue(reply, preferences?.job_preferences);
  } else {
    await sendToQueue(reply, null);
  }
};
