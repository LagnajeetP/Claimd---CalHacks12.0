import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import pages from './pages';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<pages.Landing />} />
            <Route path="/user" element={<pages.UserPage />} />
            <Route path="/user/form" element={<pages.UserFormPage />} />
            <Route path="/admin" element={<pages.AdminDash />} />
            <Route path="/admin/detail/:applicationId" element={<pages.ApplicationDetail />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
