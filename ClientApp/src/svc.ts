import { Subject, BehaviorSubject } from 'rxjs';
import moment from 'moment';
import * as signalR from "@aspnet/signalr";

export interface RaceInfo {
    raceName: string;
    startName: string;
    startId: number;
    start: Date | null;
}

export interface Mark {
    id: string;
    time?: Date | null;
    number?: string | null;
    timeSource?: string;
    numberSource?: string;
}

export default class Service {
    public static readonly Marks = new Subject<Mark[]>();
    public static readonly Race = new BehaviorSubject<RaceInfo | null>(null);

    public static Connect() {
        if (Service.inited) return;
        else Service.inited = true;

        Service.GetMarks();

        // listen to singalr
        Service.sRconnection = new signalR.HubConnectionBuilder().withUrl('/resultHub').build();
        Service.sRconnection.on('ResultAdded', (mark: Mark) => {
            Service.marks.push(mark);
            Service.onMarksChange();
        });
        Service.sRconnection.on('ActiveStart', Service.setCurrentRaceInfo)
        Service.sRconnection.on('RaceStarted', Service.setCurrentRaceInfo)

        Service.sRconnection.on('ResultUpdated', (mark: Mark) => {
            const ind = Service.marks.findIndex(m => m.id === mark.id);
            if (ind >= 0) {
                Service.marks[ind] = mark;
                Service.onMarksChange();
            }
        });
        // tslint:disable-next-line:no-console
        Service.sRconnection.start().catch(err => console.error(err))

        this.GetRaceInfo().then(Service.setCurrentRaceInfo)
    }

    public static Disconnect() {
        if (!Service.inited) return;
        else Service.inited = false;

        if (Service.sRconnection) {
            Service.sRconnection.stop();
            delete Service.sRconnection;
        }
    }

    public static SetActiveStart(startId: number): Promise<number> {
        return fetch('/api/setActive/' + startId,
            { method: 'post' }).then(this.checkStatus);
    }

    public static DeactivateStart(): Promise<void> {
        return fetch('/api/deactivate/', { method: 'delete' }).then(this.checkStatus)
    }

    public static async GetRaceInfo(): Promise<RaceInfo | null> {
        if (Service.race) return Promise.resolve(Service.race);
        const r = await fetch('/api/race');
        if (r.status === 204) return null;
        else return Service.race = await r.json();
    }

    public static async StartRace(startId: number): Promise<void> {
        if ((!Service.race || !Service.race.start)) {
            await fetch('/api/startRun/' + startId, { method: 'post' })
        }
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
        for (let i = Service.marks.length - 1; i >= 0; i--) {
            if (Service.marks[i].time) break;
            mark = Service.marks[i];
        }
        if (mark) {
            mark.time = new Date();
            mark.timeSource = source;
            if (Service.sRconnection) {
                Service.sRconnection.send('ResultUpdated', mark);
            }
        } else {
            Service.addMark({ time: new Date(), timeSource: source });
        }
        Service.onMarksChange();
    }

    public static AddNumber(num: string, numberSource: string) {
        let mark;
        for (let i = Service.marks.length - 1; i >= 0; i--) {
            if (Service.marks[i].number) break;
            mark = Service.marks[i];
        }
        if (mark) {
            mark.number = num;
            mark.numberSource = numberSource;
            if (Service.sRconnection) {
                Service.sRconnection.send('ResultUpdated', mark);
            }
        } else {
            Service.addMark({ number: num, numberSource });
        }
        Service.onMarksChange();
    }

    public static formatTime(time: Date | null | undefined, start: Date): string {
        if (!time) return '--:--';
        const dur = moment.duration(moment(time).diff(start));
        const result = Math.floor(dur.asHours()) + moment.utc(dur.asMilliseconds()).format(":mm:ss")
        return result;
    }

    public static uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // tslint:disable-next-line:no-bitwise
            const r = Math.random() * 16 | 0;
            // tslint:disable-next-line:no-bitwise
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private static sRconnection: signalR.HubConnection | undefined;
    private static marks: Mark[] = [];
    private static race: RaceInfo | null = null;

    private static inited = false;

    private static setCurrentRaceInfo(race: RaceInfo | null) {
        Service.race = race;
        Service.Race.next(race);
    }

    private static addMark(mark: Partial<Mark>) {
        const m = { ...mark, id: Service.uuidv4(), time: mark.time || null };
        Service.marks.push(m);
        if (Service.sRconnection) {
            // tslint:disable-next-line:no-console
            Service.sRconnection.send('ResultAdded', m).catch(err => console.error(err));
        }
    }

    private static onMarksChange() {
        Service.Marks.next(Service.marks);
    }

    private static async checkStatus(resp: Response) {
        if (resp.ok) return resp.headers.get('Content-Length') === '0' ? resp.text() : resp.json()
        throw new Error(`${resp.statusText} ${await resp.text()}`)
    }
}