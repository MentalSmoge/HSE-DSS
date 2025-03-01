import amqp from "amqplib"

amqp.connect('amqp://localhost', function (error0: any, connection: any) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1: any, channel: any) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});