import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/ordersAPI";
import { setPage } from "../features/orders/orderSlice";
import { RootState, AppDispatch } from "../app/store";
import { OrdersProps } from "../types";
import style from '../styles/Orders.module.scss';

const Orders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, currentPage, status, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders({ page: currentPage, limit: 5 }));
  }, [dispatch, currentPage]);

  const handleNextPage = () => dispatch(setPage(currentPage + 1));
  const handlePrevPage = () => dispatch(setPage(Math.max(1, currentPage - 1)));

  const currentPageOrders = orders[currentPage] || [];

  const calculateOrderTotal = (order: OrdersProps) =>
    order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Helper function to format date
const formatDate = (isoDate: string) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoDate));
};



  return (
    <div className={style.ordersContainer}>

      {status === "loading" && <p>Loading orders...</p>}
      {status === "failed" && <p>{error}</p>}

      {currentPageOrders.length > 0 ? (
        <ul className={style.ordersList}>
          {currentPageOrders.map((order) => (
            <li key={order.uniqueId} className={style.orderItem}>
              <div className={style.orderId}>
                <span className={style.greyText}>Заказ</span>
                <span className={style.orderNumber}>№{order.uniqueId?.slice(0, 6)}</span>
              </div>

              <div className={style.itemsContainer}>
                {order.items.map((item, idx) => (
                  <div key={idx} className={style.item}>
                    <img
                      src={item.product.picture}
                      alt={item.product.title}
                      className={style.itemImage}
                    />
                  </div>
                ))}
              </div>

              <div className={style.orderDetails}>
                <div className={style.greyText}>
                  <span >Оформлено </span>
                  <span>На сумму </span>
                </div>

                <div className={style.highlightText}>
                  <span>{formatDate(order.items[0].createdAt)} </span>
                  <span>{calculateOrderTotal(order).toFixed(0)} ₽</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        status === "succeeded" && <p className={style.noOrders}>No orders found.</p>
      )}

      <div className={style.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className={style.pageButton}>
          Previous
        </button>
        <span className={style.currentPage}>Page {currentPage}</span>
        <button onClick={handleNextPage} className={style.pageButton}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
