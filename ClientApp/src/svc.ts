import { Subject } from 'rxjs';
import moment from 'moment';
import * as signalR from "@aspnet/signalr";

export class Mark {
    id!: string;
    time?: Date;
    number?: string;
    timeSource?: string;
    numberSource?: string;
}

export default class Service {
    constructor() {
        // TODO: load current marks on start

        // listen to singalr
        Service.sRconnection = new signalR.HubConnectionBuilder().withUrl('/resultHub').build();
        Service.sRconnection.on('ResultAdded', (mark: Mark) => {
            // TODO: put into correct place of marks
            Service.marks.push(mark);
            Service.onChange()
        });
        Service.sRconnection.start();
    }

    private static sRconnection: signalR.HubConnection | undefined;
    private static marks: Mark[] = [];
    public static readonly Marks = new Subject<Mark[]>();

    public static AddMarkNow(source: string) {
        // find first mark with no time
        let mark = this.marks.find(m => m.time === undefined);
        if (mark) {
            mark.time = new Date();
            mark.timeSource = source;
        } else
            this.addMark({ time: new Date(), timeSource: source });
        this.onChange();
    }

    public static AddNumber(number: string, numberSource: string) {
        let mark = this.marks.find(m => m.number === undefined);
        if (mark) {
            mark.number = number;
            mark.numberSource = numberSource;
        } else
            this.addMark({ number, numberSource });
        this.onChange();
    }

    private static addMark(mark: Partial<Mark>) {
        // TODO: generate Id
        let m = { ...mark, id: 'TODO' };
        this.marks.push(m);
        if (Service.sRconnection)
            Service.sRconnection.invoke('addMark', m).catch(err => console.error(err));
    }

    private static onChange() {
        this.Marks.next(this.marks);
    }

    public static formatTime(time: Date | undefined, start: Date): string {
        if (time === undefined) return '--:--';
        let dur = moment.duration(moment().diff(start));
        let result = Math.floor(dur.asHours()) + moment.utc(dur.asMilliseconds()).format(":mm:ss")
        return result;
    }

}