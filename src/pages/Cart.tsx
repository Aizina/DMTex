import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../app/store';
import { fetchCart, submitOrder } from '../features/cart/cartAPI';
import style from '../styles/Cart.module.scss';
import CartItem from '../components/cartItem'

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleSubmitOrder = () => {
    if (total > 10_000) {
      setError('Общая сумма заказа не может превышать 10 000 руб.');
      return;
    }

    dispatch(submitOrder(items));
    alert('Заказ успешно оформлен!');
  };

  if (items.length === 0) return <p className={style.emptyCart}>Корзина пуста</p>;

  return (
    <div className={style.cart}>
      <h2>Корзина</h2>
      <div className={style.cartList}>
        {items.map((item) => (
          <CartItem key={item.id} {...item} /> 
        ))}
      </div>
      <div className={style.cartTotal}>
        <div className={style.cartTotalAmount}>
          <span className={style.totalText}>Итого </span>
          <span className={style.totalAmount}>{total}₽</span>
        </div>
        
        {error && <p className={style.error}>{error}</p>}
        <button onClick={handleSubmitOrder} className={style.checkoutButton}>ОФОРМИТЬ ЗАКАЗ</button>
      </div>
    </div>
  );
};

export default Cart;