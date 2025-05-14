import { useNavigate } from 'react-router-dom';
import FileFeedbackBtn from '../components/buttons/fileFeedbackBtn';
import RecordFeedbackBtn from '../components/buttons/rec_FeedbackBtn';

function Home() {
    const navigate = useNavigate();
    
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-500 relative max-w-[360px] mx-auto">
        {/* ...버튼 등 내용... */}
      </div>
    )
}

export default Home;