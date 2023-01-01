
export class Demo {

    value: number;

    constructor(value: number) {
        this.value = value;
    }

    modify = () => {
        this.value *= 10;
    }
}
