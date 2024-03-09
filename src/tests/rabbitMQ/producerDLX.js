const amqp = require('amqplib');
const message = 'Hello RabbitMQ for NamDNH';
const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const notificationExchange = 'notificationExchange';
    const notiQueue = 'notificationQueueProcess';
    const notificationExchangeDLX = 'notificationExDLX';
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    await channel.bindQueue(queueResult.queue, notificationExchange);

    const msg = 'a new product';

    // 1.TTL
    // await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
    //   expiration: '10000',
    // });

    // 2. Logic error
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg));

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.error(err);
  }
};

runProducer();
