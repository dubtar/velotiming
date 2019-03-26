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

interface RaceInfo {
    name: string;
    date: Date;
    start: Date | null;
}

export default class Service {
    private static inited = false;
    public static init() {
        if (this.inited) return;
        else this.inited = true;
        // TODO: load current marks on start

        // listen to singalr
        Service.sRconnection = new signalR.HubConnectionBuilder().withUrl('/resultHub').build();
        Service.sRconnection.on('ResultAdded', (mark: Mark) => {
            // TODO: put into correct place of marks
            Service.marks.push(mark);
            Service.onChange()
        });
        Service.sRconnection.on('GetRaceInfo', (race: RaceInfo) => {
            Service.race = race;
            if (Service.racePromiseResolve) {
                Service.racePromiseResolve(race);
                delete Service.racePromise;
            }
        }
        );
        Service.sRconnection.start().catch(err => console.error(err)).then(() => {
            Service.sRconnection!!.send("GetRaceInfo");
        });
    }

    private static sRconnection: signalR.HubConnection | undefined;
    private static race: RaceInfo | undefined = undefined;
    private static racePromise: Promise<RaceInfo>;
    private static racePromiseResolve: (r: RaceInfo) => void | undefined;
    private static marks: Mark[] = [];
    public static readonly Marks = new Subject<Mark[]>();

    public static GetRaceInfo(): Promise<RaceInfo> {
        if (this.race) return Promise.resolve(this.race);
        return Service.racePromise || (Service.racePromise = new Promise<RaceInfo>((resolve) => {
            Service.racePromiseResolve = resolve;
        }));
    }

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
            Service.sRconnection.send('ResultAdded', m).catch(err => console.error(err));
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