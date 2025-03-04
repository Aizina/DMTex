import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    const fetchProduct = async () => {
        try {
          const response = await axios.get(`https://skillfactory-task.detmir.team/products/${id}`);
          setProduct(response.data);
        } catch (err) {
          setError((err as Error).message);
        }
      };

    fetchProduct();
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
        <div>
            <img src={product.picture} alt={product.title} />
            <div>
                <h1>{product.title}</h1>
                <img src={getStarImagePath(product.rating)} alt='rating' className={style.productRating} />
                <p>{product.price}₽</p>
                <button>Add to Cart</button>
                <p>Условия возврата</p>
                <p>Обменять или вернуть товар надлежащего качества можно в течение 14 дней с момента покупки.</p>
                <span>Цены в интернет-магазине могут отличаться от розничных магазинов.</span>
            </div>

            <div>
                <h2>Описание</h2>
                <p>{convertHTMLToText(product.description)}</p>
            </div>
        </div>    
    </div>
  );
};

export default ProductPage;