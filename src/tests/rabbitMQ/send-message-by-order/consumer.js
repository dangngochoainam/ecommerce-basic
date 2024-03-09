const amqp = require('amqplib');
const message = 'Hello RabbitMQ for NamDNH';

// Message sẽ không theo thứ tự
// const runConsumer = async () => {
//   try {
//     const connection = await amqp.connect('amqp://guest:12345@localhost');
//     const channel = await connection.createChannel();

//     const queueName = 'ordered-queued-message';
//     await channel.assertQueue(queueName, { durable: true });

//     channel.consume(
//       queueName,
//       (message) => {
//         setTimeout(() => {
//           console.log(`Received message: ${message.content.toString()}`);
//         }, Math.random() * 1000);
//       },
//       { noAck: true }
//     );
//   } catch (err) {
//     console.error(err);
//   }
// };

// Message sẽ xử lí theo thứ tự
const runConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message';
    await channel.assertQueue(queueName, { durable: true });

    channel.prefetch(1);
    channel.consume(queueName, (message) => {
      // mô phỏng tình huống 1 task sẽ xử lí tốn thời gian
      setTimeout(() => {
        console.log(`Received message: ${message.content.toString()}`);
        channel.ack(message);
      }, Math.random() * 1000);
    });
  } catch (err) {
    console.error(err);
  }
};

runConsumer();
