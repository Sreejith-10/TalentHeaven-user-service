import amqp from "amqplib/callback_api.js";
import dotenv from "dotenv";
import {addJobs} from "../controllers/addjobs.js";
import {updateApplicationStatus} from "../controllers/updateApplicationStatus.js";

dotenv.config();

let queue = "job_service_queue";
let channel = null;

export const amqpConnect = () => {
	amqp.connect(process.env.AMQP_URL, async (err0, connection) => {
		if (err0) {
			throw err0;
		}
		channel = await connection.createChannel();
		await channel.assertExchange(queue, "direct", {durable: false});
		const q = await channel.assertQueue("", {exclusive: true});
		console.log("Waiting for data");
		channel.bindQueue(q.queue, queue, "JOB_POST");
		channel.bindQueue(q.queue, queue, "APPLY_JOB");
		channel.bindQueue(q.queue, queue, "JOB_REJECTION");
		channel.bindQueue(q.queue, queue, "UPDATE_APPLICATION_STATUS");
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
					default:
						break;
				}
			},
			{noAck: true}
		);
	});
};
