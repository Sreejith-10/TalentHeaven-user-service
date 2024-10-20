import amqp from "amqplib/callback_api.js";
import dotenv from "dotenv";
import {addJobs} from "../controllers/addjobs.js";
import {updateApplicationStatus} from "../controllers/updateApplicationStatus.js";
import {getJobPreferences} from "../controllers/getJobPreferences.js";
import {user} from "../controllers/user.js";

dotenv.config();

let queue = "job_service_queue";
let channel = null;

const routingKeys = [
	"JOB_POST",
	"APPLY_JOB",
	"JOB_REJECTION",
	"UPDATE_APPLICATION_STATUS",
	"USER_PREFERENCES",
	"USER_PREFERENCES_REPLY",
	"USER_DATA",
	"USER_DATA_REPLY",
];

export const amqpConnect = () => {
	amqp.connect(process.env.AMQP_URL, async (err0, connection) => {
		if (err0) {
			throw err0;
		}
		channel = await connection.createChannel();
		await channel.assertExchange(queue, "direct", {durable: false});
		const q = await channel.assertQueue("", {exclusive: true});
		console.log("Waiting for data");
		routingKeys.forEach((route) => {
			channel.bindQueue(q.queue, queue, route);
		});

		channel.consume(
			q.queue,
			(msg) => {
				const key = msg.fields.routingKey;

				switch (key) {
					case "JOB_POST":
						console.log(msg.content.toString());
						break;
					case "APPLY_JOB":
						addJobs(JSON.parse(msg.content.toString()));
						break;
					case "JOB_REJECTION":
						rejection(JSON.parse(msg.content.toString()));
						break;
					case "UPDATE_APPLICATION_STATUS":
						updateApplicationStatus(JSON.parse(msg.content.toString()));
						break;
					case "USER_PREFERENCES":
						const {uid, replyQueue} = JSON.parse(msg.content.toString());
						getJobPreferences(uid, replyQueue);
						break;
					case "USER_DATA":
						user(JSON.parse(msg.content.toString()));
						break;
					default:
						break;
				}
			},
			{noAck: true}
		);
	});
};

export async function sendToQueue(key, data) {
	let msg = JSON.stringify(data);
	await channel.publish(queue, key, Buffer.from(msg));
	console.log(`Sent :  to queue:${queue}`);
	// setTimeout(() => {
	// 	connection.close();
	// 	process.exit(0);
	// }, 500);
}
