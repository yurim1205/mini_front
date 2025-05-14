import { useNavigate } from 'react-router-dom';
import FileFeedbackBtn from '../components/buttons/fileFeedbackBtn';
import RecordFeedbackBtn from '../components/buttons/rec_FeedbackBtn';

function Home() {
    const navigate = useNavigate();
    
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-500 relative">
            {/* 로고 및 타이틀 */}
            <div className="flex flex-col items-center mt-16 mb-8">
                {/* <img src="/logo.png" alt="로고" className="w-32 h-32 mb-4" /> */}
                <div className="text-base font-semibold text-black mb-2">나만의 발표 코치</div>
                <div className="text-4xl font-extrabold text-blue-800 mb-4">스픽똑딱</div>
            </div>
            {/* 버튼들 */}
            <FileFeedbackBtn onClick={() => navigate('/file')} />
            <RecordFeedbackBtn onClick={() => navigate('/record')} />
        </div>
    )
}

export default Home;