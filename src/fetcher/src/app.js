import container from './container.js';

(async () => {
    console.log('✅ Fetcher Service starting...');
    
    // Initialize kafka producer connection
    const kafkaProducer = container.resolve('kafkaProducer');
    await kafkaProducer.connect();
    
    // Get services from container
    const blockDelayService = container.resolve('blockDelayService');
    const infuraWebClient = container.resolve('infuraWebClient');
    
    console.log('📡 Connecting to Infura WebSocket...');
    
    setTimeout(() => infuraWebClient.connect(), 1000);
    // setTimeout(() => infuraWebClient.disconnect(), 60 * 1000);
    // setTimeout(() => process.exit(0), 60 * 1000);
})().catch(console.error);