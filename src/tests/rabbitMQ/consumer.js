const amqp = require('amqplib');
const message = 'Hello RabbitMQ for NamDNH';
const runConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, { durable: true });

    // send messages to consumer channel
    channel.consume(
      queueName,
      (message) => {
        console.log(`Received message: ${message.content.toString()}`);
      },
      { noAck: true } // sẽ không gửi lại message đã xử lí
    );
  } catch (err) {
    console.error(err);
  }
};

runConsumer();
