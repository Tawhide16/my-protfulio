import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Your Navbar would go here */}
      <Navbar />
      
      <main className="flex-grow">
        <Outlet /> {/* All child routes will render here with the same background */}
      </main>
      <Footer />
      {/* Your Footer would go here */}
    </div>
      
    </div>
  );
}

export default App;