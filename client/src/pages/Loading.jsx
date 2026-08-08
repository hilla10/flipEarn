import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!nextUrl) return;

    const timeoutId = window.setTimeout(() => {
      navigate(`/${nextUrl}`);
    }, 6000);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, nextUrl]);
  return (
    <div className='flex justify-center items-center h-[80vh]'>
      <Loader2Icon className='animate-spin text-indigo-600 size-7' />
    </div>
  );
};

export default Loading;
