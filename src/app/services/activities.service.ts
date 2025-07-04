import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Activity } from "../interfaces/activities.entity";
import { map, Observable, Subject } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    url = "http://localhost:3000/activities";
    http = inject(HttpClient)
    authService = inject(AuthService)
    constructor() { }
    private activitiesChangedSource = new Subject<void>();
    activitiesChanged$ = this.activitiesChangedSource.asObservable();

    notifyActivitiesChanged() {
        this.activitiesChangedSource.next();
    }

    getActivities(): Observable<Activity[]> {
        return this.http.get<Activity[]>(this.url, this.authService.headers);
    }
    createActivity(activity: Activity): Observable<Activity> {
        return this.http.post<Activity>(this.url, activity, this.authService.headers);
    }
    deleteActivity(id: string): Observable<Activity> {
        return this.http.delete<Activity>(`${this.url}/${id}`, this.authService.headers);
    }
    updateTask(id: string, activity: Partial<Activity>): Observable<Activity> {
        return this.http.put<Activity>(`${this.url}/${id}`, activity, this.authService.headers);
    }
    getActivitiesForMonth(year: number, month: number): Observable<Activity[]> {
        return this.getActivities().pipe(
            map(activities => activities.filter(activity => {
                const date = new Date(activity.date);
                return date.getFullYear() === year && date.getMonth() === month;
            }))
        );
    }

}