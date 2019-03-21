import Svc, { Mark } from './svc';
import React from 'react';

type Props = {
    mark: Mark,
    start: Date
}
const MarkView: React.SFC<Props> = (props) => {
    return <div className="d-inline-block">
        {props.mark && Svc.formatTime(props.mark.time, props.start)}
    </div>;
}

export default MarkView; 