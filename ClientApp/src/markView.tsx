import Svc, { Mark } from './svc';
import React from 'react';

type Props = {
    mark: Mark,
    start: Date
}
const MarkView: React.SFC<Props> = (props) => {
    return <div className="d-inline-block p-1 mr-1 border border-primary rounded bg-light">
        <div>{Svc.formatTime(props.mark.time, props.start)}</div>
        <div className="text-center">{props.mark.number}</div>
    </div>;
}

export default MarkView; 