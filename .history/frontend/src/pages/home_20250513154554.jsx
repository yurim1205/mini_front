import { useNavigate } from 'react-router-dom';
import FileFeedbackBtn from '../components/buttons/fileFeedbackBtn';
import RecordFeedbackBtn from '../components/buttons/rec_FeedbackBtn';
import logoImg from '../assets/img/logo.png';

function Home() {
    const navigate = useNavigate();
    
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
            <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-[#6699E6] to-[#0033ff] max-w-[360px] w-full">
                <img src={logoImg} alt="logo" className="w-60 mb-10 -mt-4" />
                <FileFeedbackBtn onClick={() => navigate('/file')} />
                <RecordFeedbackBtn onClick={() => navigate('/record')} />
            </div>
        </div>
    )
}

export default Home;