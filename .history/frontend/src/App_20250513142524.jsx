import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import FileFeedback from '';
import RecordFeedback from '';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/file" element={<FileFeedback />} />
        <Route path="/record" element={<RecordFeedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;