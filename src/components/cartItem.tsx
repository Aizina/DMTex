import { useAppDispatch } from '../app/store';
import { updateCart } from '../features/cart/cartAPI';
import style from '../styles/CartItem.module.scss';
import { CartItemProps } from '../types';

const CartItem = (item: CartItemProps) => {
  const dispatch = useAppDispatch();

  const handleIncrease = () => {
    if (item && item.quantity < 10) {
      dispatch(updateCart({ ...item, quantity: item.quantity + 1 }));
    }
  };

  const handleDecrease = () => {
    if (item && item.quantity > 1) {
      dispatch(updateCart({ ...item, quantity: item.quantity - 1 }));
    }
  };

  const truncateTitle = (title: string, maxLength: number = 40): string => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  };
  

  return (
    <div key={item.id} className={style.cartItem}>
        <img src={item.picture} alt={item.title} className={style.productImage} />
        <h3 className={style.productTitle}>{truncateTitle(item.title)}</h3>
        <div className={style.quantityControls}>
            <button onClick={handleDecrease} className={style.decreaseButton}>
                <img src="/img/Minus.png" alt="Уменьшить" />    
            </button>
            <span className={style.quantityInto}>{item.quantity}</span>
            <button onClick={handleIncrease} className={style.increaseButton}>
                <img src="/img/Plus.png" alt="Уменьшить" /> 
            </button>
        </div>
        <p>{item.price}₽ за штуку</p>
        <p>Сумма: {item.price * item.quantity}₽</p>
    </div>
  );
};

export default CartItem;
