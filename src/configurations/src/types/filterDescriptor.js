import { FilterDescriptorBase } from "./filterDescriptorBase";

export class FilterDescriptor extends FilterDescriptorBase {
    field;
    value;
    operator;

    constructor() {
        super();
    }
}