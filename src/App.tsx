import { Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import ProductPage from './pages/ProductPage';
import Header from './components/Header';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

const App = () => {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Products />} />  
        <Route path="/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  );
};

export default App;
