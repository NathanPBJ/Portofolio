import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Preloader from './components/Preloader';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.body.style.backgroundImage = `linear-gradient(rgba(18, 28, 21, 0.85), rgba(18, 28, 21, 0.95)), url('${import.meta.env.BASE_URL}Background.png')`;
  }, []);

  return (
    <Router>
      <Preloader />
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
