import React from "react";
import Svc, { Mark } from "../svc";
import { Table } from "react-bootstrap";

interface Props {
    marks: Mark[] | null;
}

const TimeTrialTable: React.SFC<Props> = (props: Props) => {
    const results = [] as Mark[][]
    if (props.marks) {
        props.marks.forEach(mark => {
            if (mark.number) {
                let arr = results[mark.number as any]
                if (!arr) {
                    results[mark.number as any] = arr = []
                }
                arr[mark.lap] = mark
            }
        })
        results.sort((a, b) => a[0]?.time ?
            (b[0]?.time ? a[0].time.getTime() - b[0].time.getTime() : 1) :
            (b[0]?.time ? -1 : 0)
        )
    }

    return (
        <Table striped hover>
            <thead>
                <tr>
                    <th>Номер</th>
                    <th>Гонщик</th>
                    <th>Старт</th>
                    <th>Фишиш</th>
                    <th>Результат</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                {results.map((result, index) => {
                    const num = result[0]?.number
                    const start = result[0]?.time
                    const finish = result[1]?.time
                    return (
                        <tr key={(num && 'n' + num) || index}>
                            <td>{num || ''}</td>
                            <td>{result[0]?.name || ''}</td>
                            <td>{start?.toLocaleDateString('ru')}</td>
                            <td>{finish?.toLocaleDateString('ru')}</td>
                            <td>{Svc.formatTime(finish, start)}</td>
                            <td/>
                        </tr>
                    )
                })}
            </tbody>
        </Table>);
}

export default TimeTrialTable;