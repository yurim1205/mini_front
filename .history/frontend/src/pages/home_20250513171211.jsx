import { useNavigate } from 'react-router-dom';
import FileFeedbackBtn from '../components/buttons/fileFeedbackBtn';
import RecordFeedbackBtn from '../components/buttons/rec_FeedbackBtn';
import logoImg from '../assets/img/logo.png';

function Home() {
    const navigate = useNavigate();
    
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
            <div
                className="relative h-screen flex flex-col items-center justify-center max-w-[360px] w-full"
                style={{
                    background: "linear-gradient(to bottom, #fff 0%, #fff 25%, #6699E6 60%, #0033ff 100%)"
                }}
            >
                <img
                    src={logoImg}
                    alt="logo"
                    className="w-60 absolute top-[160px] left-1/2 -translate-x-1/2"
                    style={{ zIndex: 10 }}
                />
                <div className="absolute bottom-[150px] left-1/2 -translate-x-1/2 flex flex-col w-full items-center">
                    <FileFeedbackBtn onClick={() => navigate('/file')} />
                      <br></br>
                    <RecordFeedbackBtn onClick={() => navigate('/record')} />
                </div>
            </div>
        </div>
    )
}

export default Home;