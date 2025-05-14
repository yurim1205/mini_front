import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FileFeedback from './pages/FileFeedback';
import RecordFeedback from './pages/RecordFeedback';

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