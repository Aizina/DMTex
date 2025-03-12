import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/ordersAPI";
import { setPage } from "../features/orders/orderSlice";
import { RootState, AppDispatch } from "../app/store";

const Orders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, currentPage, status, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders({ page: currentPage, limit: 5 }));
  }, [dispatch, currentPage]);

  const handleNextPage = () => dispatch(setPage(currentPage + 1));
  const handlePrevPage = () => dispatch(setPage(Math.max(1, currentPage - 1)));

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {status === "loading" && <p>Loading orders...</p>}
      {status === "failed" && <p className="error">{error}</p>}

      {items[currentPage]?.length > 0 ? (
        <ul className="orders-list">
          {items[currentPage].map((order) => (
            <li key={order.id} className="order-item">
              <img src={order.picture} alt={`Order ${order.id}`} />
              <p>Order ID: {order.id}</p>
            </li>
          ))}
        </ul>
      ) : (
        status === "succeeded" && <p>No orders found.</p>
      )}

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default Orders;
