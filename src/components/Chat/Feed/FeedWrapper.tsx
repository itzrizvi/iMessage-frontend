import { Session } from "next-auth";

interface FeedWrapperProps {
    session: Session
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
    return <div>This is Feed Wrapper</div>;
};

export default FeedWrapper;
