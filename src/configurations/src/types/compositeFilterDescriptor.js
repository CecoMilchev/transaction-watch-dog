import { FilterDescriptorBase } from "./filterDescriptorBase";

export class CompositeFilterDescriptor extends FilterDescriptorBase {
    filtersDescriptors = [];
    logicalOperator;

    constructor() {
        super();
    }
}