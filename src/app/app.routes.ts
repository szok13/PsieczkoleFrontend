import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Home } from './component/home/home/home';
import { authGuard } from './guard/auth/auth-guard';
import { RegisterUser } from './component/register-user/register-user';
import { ForgotPassword } from './component/forgot-password/forgot-password';
import { guestGuard } from './guard/guest/guest-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'register',
        component: RegisterUser,
        canActivate: [guestGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPassword,
        canActivate: [guestGuard]
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];
