import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full", // Coincide exactamente con el path raíz
        redirectTo: "auth/sign-in" // Redirige a /dashboard
    },
    {
        path: "dashboard",
        loadComponent: ()=> import("./pages/dashboard/dashboard.component"),
    },
    {
        path: "calendar",
        loadComponent: ()=> import("./pages/calendar/calendar.component").then(m => m.CalendarComponent),
    },
    {
        path: "auth",
        children: [
            {
                path: "sign-in",
                loadComponent: () => import("./auth/sign-in/sign-in.component")
            },
            {
                path: "sign-up",
                loadComponent: () => import("./auth/sign-up/sign-up.component")
            },
        ]
    }
];
