import { useNavigate } from 'react-router-dom';
import FileFeedbackBtn from '../components/buttons/fileFeedbackBtn';
import RecordFeedbackBtn from '../components/buttons/rec_FeedbackBtn';
import logoImg from '../assets/img/logo.png';

function Home() {
    const navigate = useNavigate();
    
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-main-top to-main-bottom max-w-[360px] mx-auto">
        <img src={logoImg} alt="logo" className="w-24 mb-10" />
        <FileFeedbackBtn onClick={() => navigate('/file')} />
        <RecordFeedbackBtn onClick={() => navigate('/record')} />
      </div>
    )
}

export default Home;