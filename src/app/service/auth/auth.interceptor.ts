import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = window.localStorage.getItem('auth-token'); 

  console.log('Interceptor sprawdza token:', token ? 'ZNALEZIONO' : 'BRAK');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};