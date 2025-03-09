import { Kafka, Consumer, EachMessagePayload } from "kafkajs";

// Настройка Kafka
const kafka = new Kafka({
	clientId: "ms-logs",
	brokers: ["kafka:9092"], // Адрес брокера Kafka
});

// Создание консьюмера
const consumer: Consumer = kafka.consumer({ groupId: "logs-group" });

// Функция для запуска консьюмера
export async function startConsumer() {
	try {
		// Подключение к Kafka
		await consumer.connect();
		console.log("Connected to Kafka");

		// Подписка на топик
		await consumer.subscribe({
			topic: "board-updates",
			fromBeginning: true,
		});
		console.log("Subscribed to topic: board-updates");
		await consumer.subscribe({
			topic: "users-updates",
			fromBeginning: true,
		});
		console.log("Subscribed to topic: users-updates");

		// Обработка сообщений
		await consumer.run({
			eachMessage: async ({
				topic,
				partition,
				message,
			}: EachMessagePayload) => {
				const event = JSON.parse(message.value?.toString() || "{}");
				console.log(`Received message:`, event);
			},
		});
	} catch (error) {
		console.error("Error in Kafka consumer:", error);
	}
}
