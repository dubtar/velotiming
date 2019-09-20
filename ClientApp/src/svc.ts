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
    createdOn: Date;
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
        Service.sRconnection.on('ActiveStart', Service.setCurrentRaceInfo)
        Service.sRconnection.on('RaceStarted', Service.setCurrentRaceInfo)

        Service.sRconnection.on('ResultAdded', (mark: Mark) => {
            let inserted = false;
            this.ConvertMarkTimes(mark);
            for (let i = 0; i < Service.marks.length; i++) {
                const curMark = Service.marks[i];
                const curMarkTime = curMark.time || curMark.createdOn;
                const newMarkTime = mark.time || mark.createdOn;
                if (curMarkTime > newMarkTime) {
                    Service.marks.splice(i, 0, mark);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) Service.marks.push(mark);
            Service.onMarksChange();
        });

        Service.sRconnection.on('ResultUpdated', (mark: Mark) => {
            const ind = Service.marks.findIndex(m => m.id === mark.id);
            this.ConvertMarkTimes(mark);
            if (ind >= 0) {
                Service.marks[ind] = mark;
                Service.onMarksChange();
            }
            // TODO: sort marks by time
        });

        // tslint:disable-next-line:no-console
        Service.startConnection()
        Service.sRconnection.onclose(async () => {
            await this.startConnection();
        })

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
        else return Service.race = Service.UpdateRaceTimes(await r.json());
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
            marks.forEach(Service.ConvertMarkTimes)
            Service.marks = marks;
            Service.onMarksChange();
            return marks;
        }
    }
    public static AddTime(source: string) {
        if (Service.sRconnection) {
            Service.sRconnection.send('AddTime', new Date(), source);
        }
    }

    public static AddNumber(num: string, source: string) {
        if (Service.sRconnection) {
            Service.sRconnection.send('AddNumber', num, source);
        }
    }

    public static formatTime(time: Date | null | undefined, start: Date | null = null): string {
        if (!start) {
            if (Service.race) start = Service.race.start;
        }
        if (!time || !start) return '--:--';
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

    private static async startConnection() {
        try {
            if (this.sRconnection) await this.sRconnection.start();
        } catch (err) {
            // tslint:disable-next-line: no-console
            console.log(err);
            setTimeout(() => this.startConnection(), 5000);
        }
    }

    private static setCurrentRaceInfo(race: RaceInfo | null) {
        Service.race = race;
        Service.Race.next(race);
        Service.GetMarks();
    }

    private static onMarksChange() {
        Service.Marks.next(Service.marks);
    }

    private static async checkStatus(resp: Response) {
        if (resp.ok) return resp.headers.get('Content-Length') === '0' ? resp.text() : resp.json()
        throw new Error(`${resp.statusText} ${await resp.text()}`)
    }

    private static ConvertMarkTimes(mark: Mark): void {
        if (!mark) return;
        if (mark.createdOn) mark.createdOn = moment(mark.createdOn).toDate()
        if (mark.time) mark.time = moment(mark.time).toDate()
    }

    private static UpdateRaceTimes(race: RaceInfo) {
        if (race) {
            if (race.start) race.start = moment(race.start).toDate()
        }
        return race;
    }

}