import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { provideApiConfig } from './shared/di/url';
import { provideApiUrl } from './shared/interceptors/apiUrl';
import { provideToken } from './shared/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideApiConfig({ apiUrl: 'https://api.realworld.io/api' }),
        provideRouter(
            [
                {
                    path: '',
                    loadComponent: () => import('./layout/layout.component'),
                    loadChildren: () => import('./layout/layout.routes')
                }
            ],
            withHashLocation(),
            withComponentInputBinding()
        ),
        provideHttpClient(withInterceptors([provideApiUrl(), provideToken()]))
    ]
};
