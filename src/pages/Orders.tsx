import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/ordersAPI";
import { setPage } from "../features/orders/orderSlice";
import { RootState, AppDispatch } from "../app/store";
import { OrdersProps } from "../types";
import style from '../styles/Orders.module.scss';
import Pagination from "../components/Pagination";
import { formatDate } from "../utils/FormatDate";
import { Link } from "react-router-dom";
import { updateCart } from "../features/cart/cartAPI";

const Orders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, currentPage, status, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders({ page: currentPage, limit: 5 }));
  }, [dispatch, currentPage]);


  const handlePageChange = (page: number) => dispatch(setPage(page));
  const totalPages = 10;

  const currentPageOrders = orders[currentPage] || [];

  const calculateOrderTotal = (order: OrdersProps) =>
    order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleOrderClick = (order: OrdersProps) => {
    console.log(order); // Log the order structure
    order.items.forEach(item => 
      dispatch(updateCart({
        id: item.product.id,
        title: item.product.title,
        picture: item.product.picture,
        price: item.product.price,
        quantity: item.quantity
      }))
    );
  };


  return (
    <div className={style.ordersContainer}>
      {status === "loading" && <p>Loading orders...</p>}
      {status === "failed" && <p>{error}</p>}

      {currentPageOrders.length > 0 ? (
        <ul className={style.ordersList}>
          {currentPageOrders.map((order) => (
            <li key={order.uniqueId} className={style.orderItem} >
              <div className={style.orderId} onClick={() =>handleOrderClick(order)}>
                <span className={style.greyText}>Заказ</span>
                <span className={style.orderNumber}>№{order.uniqueId?.slice(0, 6)}</span>
              </div>

              <div className={style.itemsContainer}>
                {order.items.map((item, idx) => (
                  <div key={idx} className={style.item}>
                    <Link to = {`/${item.product.id}`} >
                      <img
                        src={item.product.picture}
                        alt={item.product.title}
                        className={style.itemImage}
                      />
                    </Link>
                  </div>
                ))}
              </div>

              <div className={style.orderDetails}>
                <div className={style.greyText}>
                  <span>Оформлено </span>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Orders;
