import { useAppDispatch } from '../app/store';
import { updateCart } from '../features/cart/cartAPI';
import style from '../styles/CartItem.module.scss';
import { CartItemProps } from '../types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CartItem = (item: CartItemProps) => {
  const dispatch = useAppDispatch();
  const [quantityInto, setQuantityInfo] = useState(item.quantity);
  const [showOneItemPrice, setShowOneItemPrice] = useState(item.quantity === 1);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const handleIncrease = () => {
    if (showDeleteButton) {
      setShowDeleteButton(false);
      dispatch(updateCart({ ...item, quantity: 1 }));
      setQuantityInfo(1);
      setShowOneItemPrice(true);
    }
    else if (item && item.quantity < 10) {
      dispatch(updateCart({ ...item, quantity: item.quantity + 1 }));
      setQuantityInfo(item.quantity + 1);
      setShowOneItemPrice(false);
    }
  };

  const handleDecrease = () => {
    if (item && item.quantity > 1) {
      dispatch(updateCart({ ...item, quantity: item.quantity - 1 }));
      if(quantityInto === 2){
        setShowOneItemPrice(true);
      }
      setQuantityInfo(item.quantity - 1);
    }

    if(item && item.quantity === 1){
      setShowDeleteButton(true);
    }
  };

  const handleDelete = () => {
    dispatch(updateCart({ ...item, quantity: 0 })); 
  }

  const truncateTitle = (title: string, maxLength: number = 70): string => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  };
  
  return (
    <div key={item.id} className={style.cartItem}>
      <img src={item.picture} alt={item.title} className={style.productImage} />
      
        <h3 className={style.productTitle}>
          <Link to = {`/${item.id}`}>{truncateTitle(item.title)}
          </Link>
        </h3>
      
      <div className={style.quantityControls}>
        <button onClick={handleDecrease} className={style.decreaseButton}>
            <img src="/img/Minus.png" alt="Уменьшить" />    
        </button>
        <span className={style.quantityInto}>{item.quantity}</span>
        <button onClick={handleIncrease} className={style.increaseButton}>
            <img src="/img/Plus.png" alt="Уменьшить" /> 
        </button>
      </div>

      {showDeleteButton ? 
        <button className={style.deleteButton} onClick={handleDelete}>
          <img src="/img/Trash.png" alt="Удалить" />
          Удалить
        </button>
        :
        <div className={style.totalPriceDiv}>
          {showOneItemPrice ? 
            <p className={style.totalPrice}>{item.price}₽</p>
            : 
            <div>
              <p className={style.singlePrice}>{item.price}₽ за шт.</p>
              <p className={style.totalPrice}>{item.price * item.quantity} ₽</p>
            </div>
          }
        </div>
      }
    </div>
  );
};

export default CartItem;