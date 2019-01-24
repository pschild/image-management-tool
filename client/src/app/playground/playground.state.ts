import { State, Action, StateContext } from '@ngxs/store';

export class AppendBar {
    static readonly type = 'AppendBar';
    constructor(public payload: string) { }
}

@State<string>({
    name: 'appendBar',
    defaults: 'bar'
})
export class FooState {
    @Action(AppendBar)
    add({ getState, setState }: StateContext<string>, action: AppendBar) {
        const state = getState();
        setState(state + ' ' + action.payload);
    }
}

export interface PlaygroundState {
    foo: FooState;
}

export const playgroundState = [FooState];
