import { Kafka } from "kafkajs";

const kafka = new Kafka({
	clientId: "ms-editor",
	brokers: ["kafka:9092"],
});

const producer = kafka.producer();

export async function sendBoardUpdate(event: any) {
	await producer.connect();
	await producer.send({
		topic: "board-updates",
		messages: [{ value: JSON.stringify(event) }],
	});
	await producer.disconnect();
}
