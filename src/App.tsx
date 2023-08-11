import './App.css';
import './App.styles.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import OutLoginLayout from './layouts/out-login/out-login';
import InLoginLayout from './layouts/in-login/in-login';
import General from './pages/general/general';
import { AnimatePresence } from 'framer-motion';
import Book from './pages/book/book';
import Register from './layouts/register/Register';
import ActiveAccount from './layouts/ActiveAccount/ActiveAccount';
function App() {
  
  return (
    <div className="App">
      <AnimatePresence>
        <Router>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route element={<InLoginLayout />} path="/management" >
                <Route element={<Book />} path="/management/book" />
              </Route>
            </Route>
            <Route element={<OutLoginLayout />} path="/" />
            <Route element={<Register />} path="/register" />
            <Route element={<ActiveAccount />} path="/active-account" />
          </Routes>
        </Router>
      </AnimatePresence>
    </div>
  );
}

export default App;
