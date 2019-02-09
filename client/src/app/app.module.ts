import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { GestureConfig } from '@angular/material';
import { GlobalErrorHandler } from './error-handler';
import { AppConfig } from '../environments/environment';
import { UrlSerializer } from '@angular/router';
import CustomUrlSerializer from './CustomUrlSerializer';

const CustomUrlSerializerProvider = {
    provide: UrlSerializer,
    useValue: new CustomUrlSerializer()
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    NgxsModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: AppConfig.production
    })
  ],
  providers: [
    // https://github.com/angular/material2/issues/4278
    {
      provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    CustomUrlSerializerProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
