import { Router } from '@vaadin/router';

export const initRouter = () => {
  const appRoot = document.querySelector('app-root');
  const outlet = appRoot?.shadowRoot?.getElementById('outlet');

  if (!outlet) {
    console.error('No outlet found!');
    return;
  }

  const router = new Router(outlet);
  router.setRoutes([
    { path: '/', redirect: '/employees' },
    { path: '/employees', component: 'employee-list' },
    { path: '/employees/new', component: 'employee-form' },
    { path: '/employees/edit/:id', component: 'employee-form' }
  ]);
};
