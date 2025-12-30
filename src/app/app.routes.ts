import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Home } from './component/home/home';
import { authGuard } from './guard/auth/auth-guard';
import { RegisterUser } from './component/register-user/register-user';
import { ForgotPassword } from './component/forgot-password/forgot-password';
import { guestGuard } from './guard/guest/guest-guard';
import { PetManagement } from './component/pet-management/pet-management';

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
        path: 'pet-management',
        component: PetManagement,
        canActivate: [authGuard]
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];
