import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'explorer',
        pathMatch: 'full'
    },
    {
        path: 'explorer',
        loadChildren: './explorer/explorer.module#ExplorerModule'
    },
    {
        path: 'management',
        loadChildren: './management/management.module#ManagementModule'
    },
    {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: NoPreloading,
            useHash: true
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
