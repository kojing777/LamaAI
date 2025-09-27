import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Loading from "../pages/Loading";
import toast from "react-hot-toast";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCredits, setUserCredits] = useState(null);
  const { token, axios, user, setUser } = useAppContext();

  // Fetch user details (to get updated credits)
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setUserCredits(data.user.credits);
        setUser(data.user); // update context
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // Fetch plans from backend
  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan", {
        headers: { Authorization: token },
      });
      if (data.success && Array.isArray(data.plans)) {
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
    if (token) {
      fetchPlans();
      fetchUserData();
    } else {
      setLoading(false);
    }

    // Check if returning from Stripe checkout with transaction success
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get("payment") === "success";
    if (paymentSuccess) {
      fetchUserData();
      toast.success("Credits updated successfully!");
      // Clean URL query params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [token]);

  // Stripe checkout handler
  const handlePurchase = async (planId) => {
    try {
      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        { headers: { Authorization: token } }
      );
      if (data.success && data.url) {
        window.location.href = data.url; // redirect to Stripe checkout
      } else {
        toast.error(data.message || "Failed to start purchase");
      }
    } catch (error) {
      toast.error(error.message || "Stripe checkout error");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center mt-10 mb-4 text-gray-800 dark:text-white">
        Choose Your Credits Plan
      </h2>

      {userCredits !== null && (
        <p className="text-center mb-10 text-lg font-medium text-gray-700 dark:text-gray-300">
          Your Credits: {userCredits}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-8">
        {plans.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No plans available at the moment.
          </p>
        ) : (
          plans.map((plan) => (
            <div
              key={plan._id}
              className={`border rounded-lg shadow hover:shadow-xl transition-all p-6 min-w-[300px] flex flex-col ${
                plan._id === "pro"
                  ? "bg-purple-50 dark:bg-purple-900 border-purple-400"
                  : "bg-white dark:bg-gray-800 border-gray-300"
              }`}
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {plan.name || "Unnamed Plan"}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-purple-300 mb-4">
                  ${plan.price || 0}{" "}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-300">
                    / {plan.credits || 0} credits
                  </span>
                </p>

                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  {Array.isArray(plan.features) && plan.features.length > 0
                    ? plan.features.map((feature, i) => <li key={i}>{feature}</li>)
                    : <li>No features listed</li>}
                </ul>
              </div>

              <button
                onClick={() => handlePurchase(plan._id)}
                className="mt-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium py-2 rounded transition-colors cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Credits;
