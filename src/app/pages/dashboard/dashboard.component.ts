import { Component, inject } from '@angular/core';
import { Activity } from '../../interfaces/activities.entity';
import { ActivityService } from '../../services/activities.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../header/header.component";
import { OverviewComponent } from "../../overview/overview.component";
import { LucideAngularModule } from 'lucide-angular';
 

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [
    OverviewComponent,
    HeaderComponent, 
    ReactiveFormsModule, 
    FormsModule, 
    CommonModule,
    HeaderComponent,
    OverviewComponent, 
    LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export default class DashboardComponent {
  activitys: Activity[] = [];
  newActivity: Activity = { title: '', description: '',completed: false,duration: 0, date: new Date() };
  private activityService = inject(ActivityService)
  fb = inject(FormBuilder);
  formValue = this.fb.group({
    title: ['', [Validators.required]],
    date: [ Date, [Validators.required]],
    description: ['', [Validators.required]],
    duration:[0 ,[Validators.required]],
  });


  ngOnInit(): void {
    this.loadActivities();
  }
 
  loadActivities():void {
    this.activityService.getActivities().subscribe((activitys) =>(this.activitys = activitys))
  }
 
  addActivity():void{
    if (!this.formValue.valid) {
      return;
    }
    const { title, date, description, duration } = this.formValue.value;
    this.activityService.createActivity({title: title!, description:description!, completed: false!, duration:0!, date:new Date()! }).subscribe((activity)=>{
      console.log({activity});
      this.loadActivities();
    });
  }


  deleteActivity(id:string): void {
    this.activityService.deleteActivity(id).subscribe(()=>{
      this.loadActivities();
    });
  }





  toggleActivity(activity: Activity): void {
    if (!activity.id) {
      console.error('Activity ID is undefined');
      return;
    }
  
    const updatedActivity = { ...activity, completed: !activity.completed };
    this.activityService.updateTask(activity.id, updatedActivity).subscribe(() => {
      this.loadActivities();
    });
  }
}
