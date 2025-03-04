
import { ProductProps } from "../types";
import style from '../styles/EachProduct.module.scss'
import { getStarImagePath } from "../utils/getStarImagePath";
import { Link } from 'react-router-dom';

interface EachProductProps {
  product: ProductProps;  
}

const EachProduct: React.FC<EachProductProps> = ({ product }) => {
  return (
    <div key={product.id} className={style.productCard}>
      <Link to={`/${product.id}`}>
        <div className={style.imageContainer}>
            <img src={product.picture} alt={product.title} className={style.productImage} />
          </div>
        
        <div className={style.productInfo}>
          <h3 className={style.productTitle}>{product.title}</h3>
          <img src={getStarImagePath(product.rating)} alt='rating' className={style.productRating} />
          <p className={style.productPrice}>{product.price}₽</p>
        </div>
      </Link>
    </div>
  );
};

export default EachProduct;
