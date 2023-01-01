import { Demo } from "../Demo";

describe('Demo', () => {
    test('test class modification', () => {
        const demo = new Demo(1);
        const wrapped = (a:Demo) => {
            expect(a.value).toBe(1)
            a.modify()
            expect(a.value).toBe(10)
            a.modify()
            expect(a.value).toBe(100)
        }
        wrapped(demo)
        expect(demo.value).toBe(100)
        
    });
});
