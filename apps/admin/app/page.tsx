import PublicPages from '../components/PublicPages';
import AdminLayout from '../components/SCLayout_v2';
import Profile from './features/auth/Profile';
import styles from './page.module.css';


export default function Index() {
  return (

      <AdminLayout>
        <PublicPages title={'Welcome to Study And Visa!'}>
          <Profile />
        </PublicPages>
      </AdminLayout>
  
  );
}
