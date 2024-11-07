import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { CraetepostComponent } from './component/craetepost/craetepost.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ProductdetailsComponent } from './component/productdetails/productdetails.component';
import { FavouritesComponent } from './component/favourites/favourites.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'createpost', component: CraetepostComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'property-details/:propertyId', component: ProductdetailsComponent },
    {path: 'favourites', component: FavouritesComponent}
];
