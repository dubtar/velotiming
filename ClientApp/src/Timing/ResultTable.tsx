import React from "react";
import Svc, { Mark } from "../svc";
import { Col, Row, Table } from "react-bootstrap";

interface Props {
    marks: Mark[] | null;
}

const ResultTable: React.SFC<Props> = (props: Props) => {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Время</th>
                    <th>Номер</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            {props.marks && props.marks.map(mark => (
                <tr>
                    <td>{Svc.formatTime(mark.time)}</td>
                    <td>{mark.number}</td>
                    <td><small>{(mark.time && mark.time.toLocaleTimeString('ru') || mark.createdOn && mark.createdOn.toLocaleDateString && mark.createdOn.toLocaleTimeString('ru'))}</small></td>
                </tr>
            ))}
        </Table>);
}

export default ResultTable;