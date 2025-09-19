import React, { useEffect, useState } from 'react'
import { dummyPublishedImages } from '../assets/assets';
import Loading from './Loading';

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setImages(dummyPublishedImages)
    setLoading(false);
  }

  useEffect(() => {
    fetchImages();
  }, []);
  if(loading) {
    return (
     <Loading />
    )
  }
  return (
    <div className='p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-x-scroll'>
      <h2 className='text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100'>Community Images</h2>
    </div>
  )
}

export default Community