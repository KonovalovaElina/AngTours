import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http'
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd/i18n';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    { provide: NZ_I18N, useValue: ru_RU}
  ]
};
