import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../services/activities.service';
import { Activity } from '../interfaces/activities.entity';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-overview',
  imports:[LucideAngularModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  activitys: Activity[] = [];
  completedactivitys = 0;
  totalMinutes = 0;

  constructor(private activityService: ActivityService) {}

  ngOnInit() {
    this.activityService.getActivities().subscribe((activitys) => {
      this.activitys = activitys;
      this.completedactivitys = activitys.filter((activitys) => activitys.completed).length;
      this.totalMinutes = activitys.reduce((sum, activitys) => sum + activitys.duration, 0);
    });
  }
}