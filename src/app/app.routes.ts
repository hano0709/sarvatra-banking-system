import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { TransferDetails } from './components/transfer-details/transfer-details';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login},
    { path: 'home', component: Home },
    {
        path: 'components',
        component: Home,
        children: [
            {path: 'transfer-details', component: TransferDetails}
        ]
    }
];