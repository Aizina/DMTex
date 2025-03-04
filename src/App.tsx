import { Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import ProductPage from './pages/ProductPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Products />} />  
      <Route path="/:id" element={<ProductPage />} />
    </Routes>
  );
};

export default App;
