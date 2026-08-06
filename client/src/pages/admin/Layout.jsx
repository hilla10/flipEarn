import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useState } from 'react';
import { useEffect } from 'react';
import { ArrowRightIcon, Loader2Icon } from 'lucide-react';
import { SignIn, useAuth, useUser } from '@clerk/clerk-react';
import api from '../../configs/axios';
import toast from 'react-hot-toast';

const Layout = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();
  const [checkedUserId, setCheckedUserId] = useState(null);

  useEffect(() => {
    let active = true;

    setIsAdmin(false);
    setIsLoading(true);
    setCheckedUserId(null);

    if (!isLoaded) {
      return () => {
        active = false;
      };
    }

    if (!user) {
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    const requestUserId = user.id;

    const fetchIsAdmin = async () => {
      try {
        const token = await getToken();
        const { data } = await api.get('/api/admin/isAdmin', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (active && requestUserId === user?.id) {
          setIsAdmin(data.isAdmin);
          setCheckedUserId(requestUserId);
        }
      } catch (error) {
        if (active && requestUserId === user?.id) {
          toast.error(error?.response?.data?.message || error.message);
          setIsAdmin(false);
          setCheckedUserId(requestUserId);
        }
      } finally {
        if (active && requestUserId === user?.id) {
          setIsLoading(false);
        }
      }
    };

    fetchIsAdmin();

    return () => {
      active = false;
    };
  }, [getToken, isLoaded, user]);

  if (isLoaded && !user) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <SignIn />
      </div>
    );
  }

  if (isLoading || (isLoaded && user && checkedUserId !== user.id)) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2Icon className='size-7 text-indigo-500 animate-spin' />
      </div>
    );
  }

  return isAdmin ? (
    <>
      <AdminNavbar />
      <div className='flex'>
        <AdminSidebar />
        <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] bg-slate-50 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen text-center '>
      <h2 className='text-2xl font-semibold mb-4'>
        You don't have access to this page
      </h2>
      <Link
        to='/'
        className='inline-flex items-center px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-all duration-200'>
        Go to Home <ArrowRightIcon className='ml-2 size-4' />
      </Link>
    </div>
  );
};

export default Layout;
