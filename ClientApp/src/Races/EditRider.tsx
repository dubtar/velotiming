import { Rider } from "./RaceService";

interface Props {
    rider: Partial<Rider>;
    onSubmit: (rider?: Rider) => void;
}

const EditRider: React.SFC<Props> = (props) => {
    return <div>Hi</div>
}

export default EditRider