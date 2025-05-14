import { useNavigate } from 'react-router-dom';
import FileFeedbackBtn from '../components/buttons/fileFeedbackBtn';
import RecordFeedbackBtn from '../components/buttons/rec_FeedbackBtn';

function Home() {
    const navigate = useNavigate();
    
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-500 max-w-[360px] mx-auto">
        {/* <FileFeedbackBtn onClick={() => navigate('/file')} />
        <RecordFeedbackBtn onClick={() => navigate('/record')} /> */}
      </div>
    )
}

export default Home;