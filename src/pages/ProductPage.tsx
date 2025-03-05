import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../features/products/productsAPI';
import style from '../styles/ProductPage.module.scss';
import { ProductProps } from '../types';
import { getStarImagePath } from '../utils/getStarImagePath';
import { convertHTMLToText } from '../utils/convertToText';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id).then(setProduct).catch(setError);
    } else {
      setError('Product ID is missing');
    }
  }, [id]);

  if (error) {
    return (
      <div className={style.errorPage}>
        <h1>404 - Product Not Found</h1>
        <button onClick={() => navigate('/')}>Go to Product List</button>
      </div>
    );
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className={style.productPage}>
      <div className={style.productContainer}>
        <img src={product.picture} alt={product.title} className={style.productImage} />
        <div className={style.productDetails}>
          <h1 className={style.productTitle}>{product.title}</h1>
          <img src={getStarImagePath(product.rating)} alt='rating' className={style.productRating} />
          <p className={style.productPrice}>{product.price}₽</p>
          <button className={style.addToCartButton}>Добавить в корзину</button>
          <div>
            <img src='/img/svg/Undo.svg' alt='return icon' className={style.returnPolicyIcon} />
            <span className={style.returnPolicyTitle}>Условия возврата</span>
          </div>
          <p className={style.returnPolicyText}>Обменять или вернуть товар надлежащего качества можно в течение 14 дней с момента покупки.</p>
          <span className={style.priceNote}>Цены в интернет-магазине могут отличаться от розничных магазинов.</span>
        </div>
      </div>
      <div className={style.productDescription}>
        <h2>Описание</h2>
        <p>{convertHTMLToText(product.description)}</p>
      </div>
    </div>
  );
};

export default ProductPage;