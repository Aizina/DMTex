import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productsAPI';
import { setPage } from '../features/products/productsSlice';
import { RootState, AppDispatch } from '../app/store';
import EachProduct from '../components/EachProduct';
import { useSearchParams } from 'react-router-dom';
import style from '../styles/Products.module.scss';

const itemsPerPage = 15;
const totalPages = 20;

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, currentPage, status, error } = useSelector((state: RootState) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const observerBottom = useRef<IntersectionObserver | null>(null);
  const observerTop = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const pageFromUrl = Number(searchParams.get('page')) || 1;
    dispatch(setPage(pageFromUrl));
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (!items[currentPage]) {
      dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage }));
    }
  }, [dispatch, currentPage, items]);

  useEffect(() => {
    setSearchParams({ page: String(currentPage) });
  }, [currentPage, setSearchParams]);

  const lastProductRef = (node: HTMLDivElement | null) => {
    if (status === 'loading') return;
    if (observerBottom.current) observerBottom.current.disconnect();

    observerBottom.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        dispatch(setPage(currentPage + 1));
      }
    });

    if (node) observerBottom.current.observe(node);
  };

  const firstProductRef = (node: HTMLDivElement | null) => {
    if (observerTop.current) observerTop.current.disconnect();

    observerTop.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      }
    });

    if (node) observerTop.current.observe(node);
  };

  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className={style.productsContainer}>
      <div className={style.productsGrid}>
        {Object.values(items)
          .flat()
          .map((product, index, arr) => (
            <div
              key={product.id}
              ref={index === 0 ? firstProductRef : index === arr.length - 1 ? lastProductRef : null}
            >
              <EachProduct product={product} />
            </div>
          ))}
      </div>
      {status === 'loading' && <p>Loading...</p>}
    </div>
  );
};

export default Products;