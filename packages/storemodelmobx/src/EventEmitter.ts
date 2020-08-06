export class EventEmitter {
  private events: any[] = [];

  on(event: string, cb: any) {
    this.events.push({ event, cb });
  }

  emit(event: string, data?: any) {
    this.events.forEach((v: any) => {
      if (v.event === event) v.cb(data);
    });
  }
}
