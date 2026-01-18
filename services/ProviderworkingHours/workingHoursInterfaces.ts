export interface getWorkingHour {
  sp_work_hrs_id: string;
  provider_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  is_created: Date;
  updated_at: Date;
  buffer_time: string;
}

export interface IWorkingHour {
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface IUpdateWorkingHour {
  sp_work_hrs_id: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}
