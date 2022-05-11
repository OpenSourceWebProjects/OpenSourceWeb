import { AsyncCallback, Callback } from '@osw/shared';

export interface IBenchmark {
    add: (fn:Callback | AsyncCallback, options:any) => this;
    addAsync: (fn: AsyncCallback, options:any) => this;

    run: () => this;
    statistics: () => this;
}

// before test
// after test
// 