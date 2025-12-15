import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Loading from "../pages/Loading";
import toast from "react-hot-toast";
import { IoCheckmarkCircle, IoStar, IoDiamond } from "react-icons/io5";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingPlan, setPurchasingPlan] = useState(null);
  const { token, axios } = useAppContext();

  // Fetch plans from backend
  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Failed to load plans");
      }
    } catch (error) {
      toast.error(error.message || "Server error while fetching plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPlans();
    else setLoading(false);
  }, [token]);

  // Stripe checkout
  const handlePurchase = async (planId) => {
    setPurchasingPlan(planId);
    try {
      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        { headers: { Authorization: token } }
      );
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to start purchase");
        setPurchasingPlan(null);
      }
    } catch (error) {
      toast.error(error.message || "Stripe checkout error");
      setPurchasingPlan(null);
    }
  };

  // Calculate price per credit
  const calculatePricePerCredit = (price, credits) => {
    return (price / credits).toFixed(3);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-full overflow-y-auto mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3 sm:mb-4">
          Choose Your Credits Plan
        </h1>
        <p className="text-base sm:text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
          Select the perfect plan for your AI needs. All plans include instant
          access and premium features.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 max-w-6xl mx-auto">
        {plans.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
              No plans available at the moment.
            </p>
          </div>
        )}
        {plans.map((plan, index) => {
          const isPro = plan._id === "pro";
          const pricePerCredit = calculatePricePerCredit(
            plan.price,
            plan.credits
          );

          return (
            <div
              key={plan._id}
              className={`group relative flex flex-col rounded-2xl border-2 transition-all duration-300 transform hover:scale-101 hover:-translate-y-1 ${
                isPro
                  ? "bg-gradient-to-br from-light-card to-light-hover dark:from-dark-card dark:to-dark-hover border-gray-400 dark:border-icon-active/60 shadow-2xl shadow-purple-500/20 dark:shadow-icon-active/20 md:scale-101"
                  : "bg-light-card dark:bg-dark-card border-gray-200 dark:border-dark-hover/30 shadow-lg hover:shadow-xl dark:hover:shadow-2xl"
              }`}
            >
              {/* Popular Badge */}
              {isPro && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-light-hover dark:bg-dark-hover text-light-text-primary dark:text-dark-text-secondary text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <IoStar className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className={`text-2xl sm:text-3xl font-bold ${
                        isPro
                          ? "text-purple-900 dark:text-icon-active"
                          : "text-light-text-primary dark:text-dark-text-primary"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    {isPro && (
                      <IoDiamond className="w-6 h-6 text-black dark:text-icon-active" />
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span
                      className={`text-4xl sm:text-5xl font-extrabold ${
                        isPro
                          ? "text-purple-900 dark:text-icon-active"
                          : "text-light-text-primary dark:text-dark-text-primary"
                      }`}
                    >
                      ${plan.price}
                    </span>
                    <span className="text-sm sm:text-base text-light-text-tertiary dark:text-dark-text-tertiary ml-2">
                      / {plan.credits} credits
                    </span>
                  </div>

                  {/* Price per credit */}
                  <p className="text-xs sm:text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                    ${pricePerCredit} per credit
                  </p>
                </div>

                {/* Features List */}
                <div className="flex-1 mb-6">
                  <ul className="space-y-3 sm:space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <IoCheckmarkCircle
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            isPro
                              ? "text-purple-600 dark:text-icon-active"
                              : "text-green-600 dark:text-icon-active"
                          }`}
                        />
                        <span className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handlePurchase(plan._id)}
                  disabled={purchasingPlan === plan._id}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-101 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isPro
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-icon-active dark:to-icon-active/80 hover:from-purple-700 hover:to-indigo-700 dark:hover:from-icon-active/90 dark:hover:to-icon-active/70 text-white shadow-lg shadow-purple-500/30 dark:shadow-icon-active/30"
                      : "bg-light-text-primary dark:bg-dark-hover hover:bg-light-text-secondary dark:hover:bg-dark-hover/80 text-white shadow-md dark:shadow-lg"
                  }`}
                >
                  {purchasingPlan === plan._id ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    "Buy Now"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Credits;
