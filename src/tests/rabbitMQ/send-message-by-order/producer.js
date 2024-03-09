const amqp = require('amqplib');
const message = 'Hello RabbitMQ for NamDNH';
const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message';
    await channel.assertQueue(queueName, { durable: true });

    // send messages to consumer channel
    for (let index = 0; index < 10; index++) {
      channel.sendToQueue(queueName, Buffer.from(index.toString()));
      console.log(`message sent: ${index.toString()}`);
    }

    setTimeout(() => {
      connection.close();
    }, 3000);
  } catch (err) {
    console.error(err);
  }
};

runProducer();
