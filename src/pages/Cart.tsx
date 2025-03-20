import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../app/store';
import { fetchCart, submitOrder } from '../features/cart/cartAPI';
import style from '../styles/Cart.module.scss';
import CartItem from '../components/cartItem'
import { fetchOrders } from '../features/orders/ordersAPI';

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleSubmitOrder = () => {
    dispatch(submitOrder(items));
    dispatch(fetchOrders({ page: 1, limit: 5 }));
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
        
        {total > 10000 && 
        <p className={style.errorMessage}>Общая сумма заказа не может превышать 10 000 руб.</p>}

        <button onClick={handleSubmitOrder} 
                className={style.checkoutButton}
                disabled={total > 10_000}>
                  ОФОРМИТЬ ЗАКАЗ
        </button>
      </div>
    </div>
  );
};

export default Cart;