export interface Activity {
    id?: string,
    title: string,
    description?: string,
    duration: number,
    completed: boolean;
    date: Date,
}