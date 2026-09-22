import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiLock,
} from "react-icons/fi";

import { useCart } from "../../hooks/useCart";

import {
  isRequired,
  isValidEmail,
  isValidName,
  isValidPhone,
  isValidIndianPostalCode,
} from "../../utils/validation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const shipping = subtotal >= 20000 ? 0 : 499;

  const total = useMemo(() => {
    return subtotal + shipping;
  }, [subtotal, shipping]);

  /* ========================================
     INPUT CHANGE
  ======================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    let newValue = value;

    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "postalCode") {
      newValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setPaymentError("");
  };

  /* ========================================
     VALIDATION
  ======================================== */

  const validateForm = () => {
    const newErrors = {};

    if (!isRequired(form.email)) {
      newErrors.email = "Email address is required.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!isRequired(form.phone)) {
      newErrors.phone = "Phone number is required.";
    } else if (!isValidPhone(form.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!isRequired(form.firstName)) {
      newErrors.firstName = "First name is required.";
    } else if (!isValidName(form.firstName)) {
      newErrors.firstName = "Enter a valid first name.";
    }

    if (!isRequired(form.lastName)) {
      newErrors.lastName = "Last name is required.";
    } else if (!isValidName(form.lastName)) {
      newErrors.lastName = "Enter a valid last name.";
    }

    if (!isRequired(form.address)) {
      newErrors.address = "Address is required.";
    } else if (form.address.trim().length < 5) {
      newErrors.address = "Enter a complete address.";
    }

    if (!isRequired(form.city)) {
      newErrors.city = "City is required.";
    }

    if (!isRequired(form.state)) {
      newErrors.state = "State is required.";
    }

    if (!isRequired(form.postalCode)) {
      newErrors.postalCode = "Postal code is required.";
    } else if (!isValidIndianPostalCode(form.postalCode)) {
      newErrors.postalCode =
        "Enter a valid 6-digit Indian PIN code.";
    }

    if (!isRequired(form.country)) {
      newErrors.country = "Country is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ========================================
     LOAD RAZORPAY SCRIPT
  ======================================== */

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  /* ========================================
     CREATE ORDER FROM BACKEND
  ======================================== */

  const createRazorpayOrder = async () => {
    const syncResponse = await fetch(`${API_BASE_URL}/cart/sync`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        items: items.map((item) => {
          const isNumericId =
            Number.isInteger(Number(item.id)) &&
            Number(item.id) > 0 &&
            !/^[0-9a-fA-F]{24}$/.test(String(item.id));

          return {
            catalogId: isNumericId ? Number(item.id) : (item.catalogId || undefined),
            productId: !isNumericId ? String(item.productId || item._id || item.id) : undefined,
            quantity: item.quantity,
          };
        }),
      }),
    });

    if (!syncResponse.ok) {
      const syncError = await syncResponse.json().catch(() => ({}));
      if (syncResponse.status === 401) {
        throw new Error("Please login before completing checkout.");
      }
      throw new Error(syncError.message || "Unable to synchronize your cart.");
    }

    const response = await fetch(`${API_BASE_URL}/cart/payment/create/order`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Unable to create payment order.");
    }

    const data = await response.json();
    return data.order;
  };

  /* ========================================
     VERIFY PAYMENT
  ======================================== */

  const verifyPayment = async (paymentResponse) => {
    const response = await fetch(`${API_BASE_URL}/cart/payment/verify/order`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",

      body: JSON.stringify({
        razorpay_order_id:
          paymentResponse.razorpay_order_id,

        razorpay_payment_id:
          paymentResponse.razorpay_payment_id,

        razorpay_signature:
          paymentResponse.razorpay_signature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Payment verification failed.");
    }

    return response.json();
  };

  /* ========================================
     CHECKOUT SUBMIT
  ======================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setIsProcessing(true);
      setPaymentError("");

      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Unable to load Razorpay. Please check your internet connection."
        );
      }

      const razorpayOrder =
        await createRazorpayOrder();

      const keyId =
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error(
          "Razorpay Key ID is missing."
        );
      }

      const options = {
        key: keyId,

        amount: razorpayOrder.amount,

        currency:
          razorpayOrder.currency || "INR",

        name: "VELMORA",

        description: "Velmora Order Payment",

        order_id: razorpayOrder.id,

        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },

        notes: {
          address: form.address,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
        },

        theme: {
          color: "#332b24",
        },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },

        handler: async function (
          paymentResponse
        ) {
          try {
            const verification =
              await verifyPayment(
                paymentResponse
              );

            if (
              verification.success === false
            ) {
              throw new Error(
                "Payment verification failed."
              );
            }

            const orderId =
              verification.orderId ||
              `VEL-${Date.now()
                .toString()
                .slice(-8)}`;

            const orderData = {
              id: orderId,

              customer: form,

              items,

              subtotal,

              shipping,

              total,

              payment: {
                method: "Razorpay",

                paymentId:
                  paymentResponse.razorpay_payment_id,

                razorpayOrderId:
                  paymentResponse.razorpay_order_id,

                status: "Paid",
              },
            };

            sessionStorage.setItem(
              "velmora-last-order",
              JSON.stringify(orderData)
            );

            clearCart();

            navigate("/order-success");
          } catch (error) {
            console.error(error);

            setPaymentError(
              error.message ||
                "Payment verification failed. Please contact support."
            );

            setIsProcessing(false);
          }
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            response.error
          );

          setPaymentError(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setIsProcessing(false);
        }
      );

      razorpay.open();

      setIsProcessing(false);
    } catch (error) {
      console.error(error);

      setPaymentError(
        error.message ||
          "Unable to start payment. Please try again."
      );

      setIsProcessing(false);
    }
  };

  /* ========================================
     EMPTY CHECKOUT
  ======================================== */

  if (!items || items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-82px)] bg-[#faf7ef]">
        <div className="mx-auto flex min-h-[calc(100vh-82px)] w-full max-w-[1180px] items-center justify-center px-5 py-16 text-center sm:px-8 lg:px-10">
          <div className="max-w-[520px]">

            <p className="mb-4 text-[15px] font-semibold uppercase tracking-[0.25em] text-[#9b8772]">
              Secure Checkout
            </p>

            <h1 className="font-serif text-[44px] font-medium leading-none text-[#332b24] sm:text-[54px]">
              Your Bag is Empty
            </h1>

            <p className="mx-auto mt-5 max-w-[420px] text-[14px] leading-7 text-[#776b60]">
              Add something beautiful to your collection
              before continuing to checkout.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-3 bg-[#332b24] px-8 text-[15px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:bg-[#514337]"
            >
              Continue Shopping

              <FiArrowRight size={14} />
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-82px)] bg-[#faf7ef]">

      <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

        {/* HEADER */}

        <header className="mb-12 border-b border-[#ddd3c6] pb-10 sm:mb-14 lg:mb-16 lg:pb-12">

          <Link
            to="/cart"
            className="mb-7 inline-flex items-center gap-2 text-[15px] font-semibold uppercase tracking-[0.17em] text-[#887665] transition hover:text-[#332b24]"
          >
            <FiArrowLeft size={13} />

            Back to Cart
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="mb-3 text-[15px] font-semibold uppercase tracking-[0.28em] text-[#9b8772]">
                Secure Checkout
              </p>

              <h1 className="font-serif text-[46px] font-medium leading-[0.95] tracking-[-0.02em] text-[#332b24] sm:text-[54px] lg:text-[60px]">
                Complete Your Order
              </h1>

              <p className="mt-5 max-w-[500px] text-[14px] leading-7 text-[#7d7166]">
                Enter your details below and review
                your order before completing your
                purchase.
              </p>

            </div>

            <div className="hidden items-center gap-2 pb-1 text-[15px] text-[#88796b] sm:flex">

              <FiLock size={13} />

              Secure checkout

            </div>

          </div>
        </header>

        {/* PAYMENT ERROR */}

        {paymentError && (
          <div className="mb-8 border border-red-300 bg-red-50 px-5 py-4 text-[16px] text-red-700">
            {paymentError}
          </div>
        )}

        {/* CHECKOUT FORM */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 xl:gap-16"
        >

          {/* LEFT */}

          <div className="min-w-0">

            <CheckoutSection
              number="01"
              title="Contact Information"
            >

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <Field
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <Field
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  inputMode="numeric"
                  maxLength={10}
                />

              </div>

            </CheckoutSection>

            {/* SHIPPING */}

            <CheckoutSection
              number="02"
              title="Shipping Address"
            >

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <Field
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />

                <Field
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />

                <div className="sm:col-span-2">

                  <Field
                    label="Address"
                    name="address"
                    placeholder="Street address"
                    value={form.address}
                    onChange={handleChange}
                    error={errors.address}
                  />

                </div>

                <div className="sm:col-span-2">

                  <Field
                    label="Apartment, Suite, etc."
                    name="apartment"
                    placeholder="Optional"
                    value={form.apartment}
                    onChange={handleChange}
                    required={false}
                  />

                </div>

                <Field
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  error={errors.city}
                />

                <Field
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  error={errors.state}
                />

                <Field
                  label="Postal Code"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode}
                  inputMode="numeric"
                  maxLength={6}
                />

                <div>

                  <label className="mb-2 block text-[15px] font-semibold uppercase tracking-[0.17em] text-[#8e7b69]">
                    Country
                  </label>

                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={`h-[52px] w-full border bg-[#fffdf9] px-4 text-[14px] text-[#40372f] outline-none transition ${
                      errors.country
                        ? "border-red-400"
                        : "border-[#d9cfc2] focus:border-[#8a7356]"
                    }`}
                  >

                    <option value="India">
                      India
                    </option>

                  </select>

                  {errors.country && (
                    <p className="mt-2 text-[16px] text-red-600">
                      {errors.country}
                    </p>
                  )}

                </div>

              </div>

            </CheckoutSection>

            {/* PAYMENT */}

            <CheckoutSection
              number="03"
              title="Payment"
              last
            >

              <div className="border border-[#d9cfc2] bg-[#fffdf9] p-5 sm:p-6">

                <div className="flex items-start gap-4">

                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ded4c7] text-[#6c5d50]">

                    <FiLock size={15} />

                  </div>

                  <div>

                    <p className="text-[14px] font-medium text-[#40372f]">
                      Razorpay Secure Payment
                    </p>

                    <p className="mt-2 text-[16px] leading-6 text-[#84786c]">
                      After clicking the payment button,
                      Razorpay&apos;s secure checkout will open
                      where you can choose available payment
                      methods such as UPI, cards and other
                      supported options.
                    </p>

                  </div>

                </div>

              </div>

            </CheckoutSection>

          </div>

          {/* ORDER SUMMARY */}

          <aside className="h-fit lg:sticky lg:top-[110px]">

            <div className="border border-[#ddd3c6] bg-[#f3eee6] p-6 sm:p-7">

              <p className="text-[15px] font-semibold uppercase tracking-[0.24em] text-[#998571]">
                Order Summary
              </p>

              <div className="mt-7 space-y-5">

                {items.map((item) => (

                  <div
                    key={item.id}
                    className="grid grid-cols-[76px_minmax(0,1fr)] gap-4"
                  >

                    <div className="relative h-[92px] overflow-hidden rounded-[3px] bg-[#e5ddd2]">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#332b24] px-1 text-[14px] text-white">
                        {item.quantity}
                      </span>

                    </div>

                    <div className="flex min-w-0 flex-col justify-between py-1">

                      <div>

                        <p className="text-[14px] font-semibold uppercase tracking-[0.15em] text-[#998571]">
                          {item.categoryLabel ||
                            item.category ||
                            "Velmora"}
                        </p>

                        <p className="mt-1 font-serif text-[20px] font-medium leading-[1.05] text-[#332b24]">
                          {item.name}
                        </p>

                      </div>

                      <p className="mt-3 text-[16px] text-[#5c5147]">

                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </p>

                    </div>

                  </div>

                ))}

              </div>

              <div className="my-7 h-px bg-[#d5cabd]" />

              {/* PRICE ROWS */}

              <div className="space-y-4 text-[16px] text-[#675c52]">

                <div className="flex items-center justify-between gap-5">

                  <span>Subtotal</span>

                  <strong className="font-medium text-[#40372f]">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <div className="flex items-center justify-between gap-5">

                  <span>Shipping</span>

                  <span className="text-right text-[#40372f]">

                    {shipping === 0
                      ? "Complimentary"
                      : `₹${shipping.toLocaleString(
                          "en-IN"
                        )}`}

                  </span>

                </div>

                <div className="flex items-center justify-between gap-5">

                  <span>Taxes</span>

                  <span className="text-right text-[#807468]">
                    Included at checkout
                  </span>

                </div>

              </div>

              <div className="my-7 h-px bg-[#d5cabd]" />

              {/* TOTAL */}

              <div className="flex items-end justify-between gap-5">

                <span className="font-serif text-[28px] font-medium leading-none text-[#332b24]">
                  Total
                </span>

                <strong className="text-[16px] font-semibold text-[#332b24]">

                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}

                </strong>

              </div>

              {/* PAY BUTTON */}

              <button
                type="submit"
                disabled={isProcessing}
                className="group mt-8 flex min-h-[54px] w-full items-center justify-center gap-3 bg-[#332b24] px-5 text-[15px] font-semibold uppercase tracking-[0.17em] text-white transition duration-200 hover:bg-[#514337] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {isProcessing
                  ? "Processing..."
                  : `Pay ₹${total.toLocaleString(
                      "en-IN"
                    )}`}

                {!isProcessing && (
                  <FiArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}

              </button>

              <Link
                to="/cart"
                className="mt-5 flex items-center justify-center gap-2 text-[14px] font-semibold uppercase tracking-[0.14em] text-[#77695c] transition hover:text-[#332b24]"
              >

                <FiArrowLeft size={11} />

                Return to Cart

              </Link>

              <div className="mt-7 border-t border-[#d5cabd] pt-6">

                <p className="flex items-center gap-2 text-[15px] text-[#7f7368]">

                  <FiLock size={12} />

                  Secure payment powered by Razorpay

                </p>

                <p className="mt-3 text-[15px] leading-5 text-[#8a7e72]">
                  Carefully packed and delivered.
                </p>

                <p className="mt-1 text-[15px] leading-5 text-[#8a7e72]">
                  Easy returns within 14 days.
                </p>

              </div>

            </div>

          </aside>

        </form>

      </div>

    </main>
  );
}

/* ========================================
   CHECKOUT SECTION
======================================== */

function CheckoutSection({
  number,
  title,
  children,
  last = false,
}) {
  return (
    <section
      className={
        last
          ? ""
          : "mb-11 border-b border-[#ddd3c6] pb-11 sm:mb-12 sm:pb-12"
      }
    >

      <div className="mb-7">

        <p className="mb-2 text-[14px] font-semibold uppercase tracking-[0.2em] text-[#9d8974]">
          {number}
        </p>

        <h2 className="font-serif text-[30px] font-medium leading-none text-[#332b24] sm:text-[34px]">
          {title}
        </h2>

      </div>

      {children}

    </section>
  );
}

/* ========================================
   FIELD
======================================== */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = true,
  error = "",
  inputMode,
  maxLength,
}) {
  return (
    <div>

      <label className="mb-2 block text-[15px] font-semibold uppercase tracking-[0.17em] text-[#8e7b69]">
        {label}

        {!required && (
          <span className="ml-2 normal-case tracking-normal text-[#aa9e92]">
            Optional
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`h-[52px] w-full border bg-[#fffdf9] px-4 text-[14px] text-[#40372f] outline-none transition placeholder:text-[#b1a69a] ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-[#d9cfc2] focus:border-[#8a7356]"
        }`}
      />

      {error && (
        <p className="mt-2 text-[16px] leading-5 text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}

export default Checkout;




