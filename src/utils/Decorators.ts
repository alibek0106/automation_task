import { test } from '@playwright/test';

export function step(stepName?: string) {
    return function decorator<T extends (...args: any[]) => any>(
        target: T,
        context: ClassMethodDecoratorContext<unknown, T>
    ): T {
        return function replacementMethod(this: any, ...args: any[]) {
            const name = stepName || `${this.constructor.name}.${context.name as string}`;
            return test.step(
                name,
                async () => {
                    return await target.call(this, ...args);
                },
                { box: true }
            );
        } as T;
    };
}