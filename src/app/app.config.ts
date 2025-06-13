import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

import { routes } from './app.routes';

// Configurar Amplify con los outputs del backend
Amplify.configure(outputs);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
