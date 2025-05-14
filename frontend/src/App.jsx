import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import FileFeedback from './pages/fileFeedback';
import RecordFeedback from './pages/recordFeedback';
import Loading from './pages/loading';
import ResultFeedback from './pages/resultFeedback';
import AllContent from './pages/allContent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/file" element={<FileFeedback />} />
        <Route path="/record" element={<RecordFeedback />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/resultFeedback" element={<ResultFeedback />} />
        <Route path="/allContent" element={<AllContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;