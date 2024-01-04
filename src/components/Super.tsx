import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { AddToCart } from './cartSlice';
import { getDataAsync, selectProduct } from '../slicers/superSlice';
import { useAppDispatch } from '../app/hooks';

const Super: React.FC = () => {
  const products = useSelector(selectProduct);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getDataAsync());
  }, [dispatch]);

  return (
    <div>
      <h1>Products</h1>
      {products.map((item) => (
        <div key={item.id}>
          {item.prodName} : {item.price}$
          {/* <button onClick={() => dispatch(AddToCart({ id: item.id, prodName: item.prodName, price: item.price }))} >  Add To Cart </button> */}
        </div>
      ))}
    </div>
  );
};

export default Super;
