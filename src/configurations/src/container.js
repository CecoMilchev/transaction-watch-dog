import { createContainer, asClass, InjectionMode } from 'awilix';
import FilterDescriptorService from './services/filterDescriptorService.js';
import CompositeFilterDescriptorService from './services/compositeFilterDescriptorService.js';
import KafkaProducerService from './services/kafkaProducerService.js';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container.register({
  kafkaProducerService: asClass(KafkaProducerService).singleton(),
  filterDescriptorService: asClass(FilterDescriptorService, {
    injectionMode: InjectionMode.CLASSIC
  }).singleton(),
  compositeFilterDescriptorService: asClass(CompositeFilterDescriptorService, {
    injectionMode: InjectionMode.CLASSIC  
  }).singleton()
});

export default container;
