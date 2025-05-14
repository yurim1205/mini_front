import { useNavigate } from 'react-router-dom';
import FileFeedbackBtn from '../components/buttons/fileFeedbackBtn';
import RecordFeedbackBtn from '../components/buttons/rec_FeedbackBtn';
import logoImg from '../assets/img/logo.png';

function Home() {
    const navigate = useNavigate();
    
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
            <div className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-[#6699E6] to-[#0033ff] max-w-[360px] w-full">
                <img
                    src={logoImg}
                    alt="logo"
                    className="w-60 absolute top-[00px] left-1/2 -translate-x-1/2"
                    style={{ zIndex: 10 }}
                />
                <div className="flex flex-col w-full items-center">
                    <FileFeedbackBtn onClick={() => navigate('/file')} />
                    <RecordFeedbackBtn onClick={() => navigate('/record')} />
                </div>
            </div>
        </div>
    )
}

export default Home;