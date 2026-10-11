import { Routes } from '@angular/router';

import { SuperHeroList } from './features/super-heroes/pages/super-hero-list/super-hero-list';

export const routes: Routes = [
  {
    path: '',
    component: SuperHeroList,
  },
];
