import React from "react";
import Svc, { Mark } from "../svc";
import { Table } from "react-bootstrap";

interface Props {
    marks: Mark[] | null;
}

const ResultTable: React.SFC<Props> = (props: Props) => {
    return (
        <Table striped hover>
            <thead>
                <tr>
                    <th>Круг</th>
                    <th>Место</th>
                    <th>Время</th>
                    <th>Номер</th>
                    <th>Гонщик</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                {props.marks && props.marks.map(mark => (
                    <tr key={mark.id}>
                        <td>{mark.lap}</td>
                        <td>{mark.place}</td>
                        <td>{Svc.formatTime(mark.time)}</td>
                        <td>{mark.number}</td>
                        <td>{mark.name}</td>
                        <td><small>{(mark.time || mark.createdOn)?.toLocaleTimeString('ru')}</small></td>
                    </tr>
                ))}
            </tbody>
        </Table>);
}

export default ResultTable;