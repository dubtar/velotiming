import { Subject } from 'rxjs';
import moment from 'moment';
import * as signalR from "@aspnet/signalr";

export class Mark {
    id!: string;
    time?: Date | null;
    number?: string | null;
    timeSource?: string;
    numberSource?: string;
}

export interface RaceInfo {
    name: string;
    date: Date;
    start: Date | null;
}

export default class Service {
    private static inited = false;
    public static init() {
        if (Service.inited) return;
        else Service.inited = true;

        Service.GetMarks();

        // listen to singalr
        Service.sRconnection = new signalR.HubConnectionBuilder().withUrl('/resultHub').build();
        Service.sRconnection.on('ResultAdded', (mark: Mark) => {
            Service.marks.push(mark);
            Service.onMarksChange();
        });
        Service.sRconnection.on('RaceStarted', (race: RaceInfo) => {
            Service.race = race;
            Service.Race.next(race);
        });
        Service.sRconnection.on('ResultUpdated', (mark: Mark) => {
            const ind = Service.marks.findIndex(m => m.id === mark.id);
            if (ind >= 0) {
                Service.marks[ind] = mark;
                Service.onMarksChange();
            }
        });
        Service.sRconnection.start().catch(err => console.error(err))
    }

    private static sRconnection: signalR.HubConnection | undefined;
    private static marks: Mark[] = [];
    public static readonly Marks = new Subject<Mark[]>();
    private static race?: RaceInfo;
    public static readonly Race = new Subject<RaceInfo>();

    public static async GetRaceInfo(): Promise<RaceInfo> {
        if (Service.race) return Promise.resolve(Service.race);
        const r = await fetch('/api/race');
        return Service.race = await r.json();
    }

    public static async StartRace() {
        if (Service.race && Service.race.start) return Promise.resolve(Service.race);
        if (Service.sRconnection) Service.sRconnection.send('RaceStarted');
    }

    public static async GetMarks() {
        const r = await fetch('/api/marks');
        const marks = await r.json();
        if (Array.isArray(marks)) {
            Service.marks = marks;
            Service.onMarksChange();
            return marks;
        }
    }

    public static AddTime(source: string) {
        // find first mark before setted with time not set
        let mark;
        for(let i = Service.marks.length -1; i>=0; i--) {
            if (Service.marks[i].time) break;
            mark = Service.marks[i];
        }
        if (mark) {
            mark.time = new Date();
            mark.timeSource = source;
            if (Service.sRconnection)
                Service.sRconnection.send('ResultUpdated', mark);
        } else
            Service.addMark({ time: new Date(), timeSource: source });
        Service.onMarksChange();
    }

    public static AddNumber(number: string, numberSource: string) {
        let mark;
        for(let i = Service.marks.length -1; i>=0; i--) {
            if (Service.marks[i].number) break;
            mark = Service.marks[i];
        }
        if (mark) {
            mark.number = number;
            mark.numberSource = numberSource;
            if (Service.sRconnection)
                Service.sRconnection.send('ResultUpdated', mark);
        } else
            Service.addMark({ number, numberSource });
        Service.onMarksChange();
    }

    private static addMark(mark: Partial<Mark>) {
        let m = { ...mark, id: Service.uuidv4(), time: mark.time || null };
        Service.marks.push(m);
        if (Service.sRconnection)
            Service.sRconnection.send('ResultAdded', m).catch(err => console.error(err));
    }

    private static onMarksChange() {
        Service.Marks.next(Service.marks);
    }

    public static formatTime(time: Date | null | undefined, start: Date): string {
        if (!time) return '--:--';
        let dur = moment.duration(moment(time).diff(start));
        let result = Math.floor(dur.asHours()) + moment.utc(dur.asMilliseconds()).format(":mm:ss")
        return result;
    }

    public static uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}