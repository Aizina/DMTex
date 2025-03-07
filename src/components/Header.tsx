import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import style from '../styles/Header.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const Header: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={style.header}>
      <div className={style.logo}>
        <NavLink to="/" onClick={closeMenu}>
          <img src="/img/Logo.png" alt="Logo" />
        </NavLink>
      </div>

      <nav className={`${style.nav} ${isMenuOpen ? style.navOpen : ''}`}>
        <div className={style.mainNavList}>
            <NavLink to="/" 
            className={({ isActive }) => isActive ? `${style.navItem} ${style.active}` : style.navItem}
            onClick={closeMenu}>
                Товары
            </NavLink>
            <NavLink to="/orders" 
            className={({ isActive }) => isActive ? `${style.navItem} ${style.active}` : style.navItem}
            onClick={closeMenu}>
                Заказы
            </NavLink>
        </div>

        <NavLink to="/cart" className={style.cartItem}
         onClick={closeMenu}>
            Корзина ({cartItemCount})
        </NavLink>
      </nav>

      <div className={style.burger} onClick={toggleMenu}>
        <img src="/img/menu.png" alt="Burger" />
      </div>
    </header>
  );
};

export default Header;
