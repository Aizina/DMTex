import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchProduct } from '../features/products/productsAPI';
import { updateCart } from '../features/cart/cartAPI';
import style from '../styles/ProductPage.module.scss';
import { ProductProps } from '../types';
import { getStarImagePath } from '../utils/getStarImagePath';
import { convertHTMLToText } from '../utils/convertToText';
import { RootState, useAppDispatch } from '../app/store'; // Import typed dispatch

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localQuantity, setLocalQuantity] = useState(1); // Local state for quantity
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(true);

  useEffect(() => {
    if (!id) {
      setError('Product ID is missing');
      return;
    }

    fetchProduct(id)
      .then((data) => {
        setProduct(data);
        // If item is already in cart, use its quantity
        const cartItem = cartItems.find((item) => item.id === data.id);
        if (cartItem) setLocalQuantity(cartItem.quantity);
      })
      .catch(() => setError('Product not found'));
  }, [id, cartItems]);

  if (error) {
    return (
      <div className={style.errorPage}>
        <h1>{error}</h1>
        <button onClick={() => navigate('/')}>Go to Product List</button>
      </div>
    );
  }

  if (!product) return <p>Loading...</p>;

  const handleIncrease = () => {
    if (localQuantity < 10) setLocalQuantity(localQuantity + 1);
  };

  const handleDecrease = () => {
    if (localQuantity > 1) setLocalQuantity(localQuantity - 1);
    if(localQuantity === 1) setIsAddToCartOpen(!isAddToCartOpen)
  };

  const handleAddToCart = () => {
    dispatch(updateCart({ id: product.id, title: product.title, picture: product.picture, price: product.price, quantity: localQuantity }));
    navigate('/cart');
  };

  return (
    <div className={style.productPage}>
      <button className={style.backButton} onClick={() => navigate(-1)}>
        <img src='/img/ArrowLeft.png' alt='back' className={style.backIcon} />
        Назад
      </button>
      <div className={style.productContainer}>
        <img src={product.picture} alt={product.title} className={style.productImage} />
        <div className={style.productDetails}>
          <h1 className={style.productTitle}>{product.title}</h1>
          <img src={getStarImagePath(product.rating)} alt='rating' className={style.productRating} />
          <p className={style.productPrice}>{product.price}₽</p>

          {isAddToCartOpen ? (
            <button className={style.addToCartButton} onClick={()=>setIsAddToCartOpen(!isAddToCartOpen)}>
              Добавить в корзину
            </button>
          ) : (
            <div className={style.cartControls}>
              <button className={style.decreaseButton} onClick={handleDecrease}>-</button>
              <span className={style.quantity}>{localQuantity}</span>
              <button className={style.increaseButton} onClick={handleIncrease}>+</button>
              <button className={style.checkoutButton} onClick={handleAddToCart}>ОФОРМИТЬ ЗАКАЗ</button>
            </div>
          )}
          <div className={style.returnPolicy}>
            <img src='/img/svg/Undo.svg' alt='return icon' className={style.returnPolicyIcon} />
            <span className={style.returnPolicyTitle}>Условия возврата</span>
          </div>
          <p className={style.returnPolicyText}>
            Обменять или вернуть товар надлежащего качества можно в течение 14 дней с момента покупки.
          </p>
          <span className={style.priceNote}>
            Цены в интернет-магазине могут отличаться от розничных магазинов.
          </span>
        </div>
      </div>
      <div className={style.productDescription}>
        <h2>Описание</h2>
        <div>{convertHTMLToText(product.description)}</div>
      </div>
    </div>
  );
};

export default ProductPage;
