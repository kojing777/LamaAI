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
    <div>

    </div>
  )
}

export default Community