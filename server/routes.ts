import { ImageController, WelcomeController } from './controller';

export const Routes = [{
    method: 'get',
    route: '/users',
    controller: ImageController,
    action: 'all'
}, {
    method: 'get',
    route: '/users/:id',
    controller: ImageController,
    action: 'one'
}, {
    method: 'post',
    route: '/users',
    controller: ImageController,
    action: 'save'
}, {
    method: 'delete',
    route: '/users/:id',
    controller: ImageController,
    action: 'remove'
}, {
    method: 'get',
    route: '/welcome/:name',
    controller: WelcomeController,
    action: 'greet'
}, {
    method: 'get',
    route: '/dbtest',
    controller: WelcomeController,
    action: 'test'
}];
