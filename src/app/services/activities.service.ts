import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Activity } from "../interfaces/activities.entity";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    url = "http://localhost:3000/activities";
    http = inject(HttpClient)
    authService = inject(AuthService)
    constructor() { }

    getActivities(): Observable<Activity[]> {
        return this.http.get<Activity[]>(this.url, this.authService.headers);
    }
    createActivity(activity: Activity): Observable<Activity> {
        return this.http.post<Activity>(this.url, activity,this.authService.headers);
    }
    deleteActivity(id: string): Observable<Activity> {
        return this.http.delete<Activity>(`${this.url}/${id}`);
    }
    updateTask(id: string, activity: Partial<Activity>): Observable<Activity> {
        return this.http.put<Activity>(`${this.url}/${id}`, activity);
    }

}