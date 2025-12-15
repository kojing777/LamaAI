const Loading = () => {

  // Removed automatic navigation timeout - let the app control navigation
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     navigate("/");
  //   }, 8000);
  //   return () => clearTimeout(timeout);
  // }, []);
  return (
    <div className="bg-gradient-to-b dark:from-dark-primary dark:to-dark-modal from-gray-50 to-gray-100 backdrop-capacity-60 flex items-center justify-center h-screen w-screen text-gray-900 dark:text-dark-text-primary text-2xl transition-colors duration-300">
      <div className="w-10 h-10 rounded-full border-3 border-gray-900 dark:border-icon-active border-t-transparent animate-spin"></div>
    </div>
  );
};

export default Loading;
