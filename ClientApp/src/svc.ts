import { Subject } from 'rxjs';
import moment from 'moment';

export class Mark {
    time?: Date;
    number?: string;
    timeSource?: string;
    numberSource?: string;
}

export default class Service {
    static formatTime(time: Date | undefined, start: Date): string {
        if (time === undefined) return '--:--';
        let dur = moment.duration(moment().diff(start));
        let result = Math.floor(dur.asHours()) + moment.utc(dur.asMilliseconds()).format(":mm:ss")
        return result;
    }

    private static marks: Mark[] = [];
    public static readonly Marks = new Subject<Mark[]>();

    public static AddMarkNow(source: string) {
        // find first mark with no time
        let mark = this.marks.find(m => m.time === undefined);
        if (mark) {
            mark.time = new Date();
            mark.timeSource = source;
        } else
            this.marks.push({ time: new Date(), timeSource: source });
        this.onChange();
    }

    public static AddNumber(number: string, numberSource: string) {
        let mark = this.marks.find(m => m.number === undefined);
        if (mark) {
            mark.number = number;
            mark.numberSource = numberSource;
        } else
            this.marks.push({ number, numberSource })
    }

    private static onChange() {
        this.Marks.next(this.marks);
    }
}