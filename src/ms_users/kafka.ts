import { Kafka } from "kafkajs";

const kafka = new Kafka({
	clientId: "ms-users",
	brokers: ["kafka:9092"],
});

const producer = kafka.producer();

export async function sendUserUpdate(event: unknown) {
	await producer.connect();
	await producer.send({
		topic: "users-updates",
		messages: [{ value: JSON.stringify(event) }],
	});
	await producer.disconnect();
}
