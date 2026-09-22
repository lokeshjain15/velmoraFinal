import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";

function OrderSuccess() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("velmora-last-order");

    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-82px)] bg-[#faf7ef]">
      <div className="mx-auto flex min-h-[calc(100vh-82px)] w-full max-w-[1180px] items-center justify-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="w-full max-w-[620px] text-center">

          <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#cfc3b5] bg-[#f3eee6] text-[#5f6b4b]">
            <FiCheck size={28} />
          </div>

          <p className="mt-8 text-[14px] font-semibold uppercase tracking-[0.3em] text-[#9b8772]">
            Order Confirmed
          </p>

          <h1 className="mt-4 font-serif text-[48px] font-medium leading-[0.95] tracking-[-0.02em] text-[#332b24] sm:text-[58px]">
            Thank You for
            <span className="block italic font-normal text-[#715f4e]">
              Your Order
            </span>
          </h1>

          <div className="my-7 flex items-center justify-center">
            <span className="h-px w-10 bg-[#d4c7b8]" />
            <span className="mx-3 h-[5px] w-[5px] rotate-45 bg-[#8c735b]" />
            <span className="h-px w-10 bg-[#d4c7b8]" />
          </div>

          <p className="mx-auto max-w-[480px] text-[16px] leading-7 text-[#766b60]">
            Your order has been received and is now being prepared with care.
            We&apos;ll keep you updated as your Velmora pieces make their way to you.
          </p>

          {order && (
            <div className="mx-auto mt-8 max-w-[460px] border border-[#ddd3c6] bg-[#f3eee6] px-6 py-6 text-left">
              <div className="flex items-center gap-2 text-[#66594d]">
                <FiShoppingBag size={14} />

                <p className="text-[14px] font-semibold uppercase tracking-[0.18em]">
                  Order Details
                </p>
              </div>

              <div className="mt-5 space-y-3 text-[15px] text-[#675c52]">
                <div className="flex justify-between gap-5">
                  <span>Order ID</span>
                  <strong className="font-medium text-[#332b24]">
                    {order.id}
                  </strong>
                </div>

                <div className="flex justify-between gap-5">
                  <span>Items</span>
                  <strong className="font-medium text-[#332b24]">
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </strong>
                </div>

                <div className="flex justify-between gap-5">
                  <span>Total</span>
                  <strong className="font-medium text-[#332b24]">
                    ₹{order.total.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <Link
            to="/shop"
            className="group mt-8 inline-flex min-h-[50px] items-center justify-center gap-3 bg-[#332b24] px-8 text-[14px] font-semibold uppercase tracking-[0.17em] text-white transition duration-300 hover:bg-[#514337]"
          >
            Continue Shopping

            <FiArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;