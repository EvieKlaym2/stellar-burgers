import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkAuth } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { ModalSwitch } from './ModalSwitch';
import styles from './app.module.css';

const App = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );
  const ingredients = useSelector((state) => state.ingredients.items);
  const error = useSelector((state) => state.ingredients.error);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className={styles.app}>
        <AppHeader />
        {isIngredientsLoading ? (
          <Preloader />
        ) : error ? (
          <div className={`${styles.error} text text_type_main-medium pt-4`}>
            {error}
          </div>
        ) : ingredients.length > 0 ? (
          <ModalSwitch />
        ) : (
          <div className={`${styles.title} text text_type_main-medium pt-4`}>
            Нет ингредиентов
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
