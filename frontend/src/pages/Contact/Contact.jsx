import { useState } from "react";
import {
  FiMail,
  FiMapPin,
  FiClock,
  FiGlobe,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { api, getApiError } from "../../features/auth/services/auth.api";

/* =========================================
   CONTACT DETAILS

   ↓ YAHAN APNI REAL EMAIL ID PASTE KARNA
========================================= */

const CONTACT_EMAIL = "dugarlokesh28@gmail.com";

const BUSINESS_LOCATION = "Mumbai, Maharashtra, India";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setSubmitError("");
      await api.post("/feedback", { ...form, fullName: form.name });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      setSubmitError(getApiError(error, "Unable to send your message."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7ef] text-[#332b24]">

      {/* =========================================
          HERO
      ========================================== */}

      <section className="border-b border-[#ded5c9]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

          <p className="text-[14px] font-semibold uppercase tracking-[0.3em] text-[#9b8772]">
            Contact Velmora
          </p>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_430px] lg:items-end">

            <h1 className="font-serif text-[50px] font-medium leading-[0.92] tracking-[-0.03em] sm:text-[64px] lg:text-[76px]">
              We’d Love to
              <span className="block italic font-normal text-[#715f4e]">
                Hear From You
              </span>
            </h1>

            <p className="max-w-[430px] text-[16px] leading-7 text-[#766b60]">
              Have a question about a product, your order, delivery,
              or anything Velmora? Send us a message and we’ll be
              happy to help.
            </p>

          </div>
        </div>
      </section>


      {/* =========================================
          CONTACT CONTENT
      ========================================== */}

      <section>
        <div className="mx-auto grid w-full max-w-[1180px] gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-10 lg:py-24">

          {/* =====================================
              LEFT SIDE
          ====================================== */}

          <div>

            <p className="text-[14px] font-semibold uppercase tracking-[0.25em] text-[#9b8772]">
              Get in Touch
            </p>

            <h2 className="mt-4 max-w-[420px] font-serif text-[38px] font-medium leading-[0.95] sm:text-[46px]">
              Here whenever
              <span className="block italic font-normal text-[#715f4e]">
                you need us.
              </span>
            </h2>

            <p className="mt-6 max-w-[420px] text-[15px] leading-7 text-[#766b60]">
              Velmora is an online home and lifestyle destination.
              Our support is available digitally, making it easy to
              reach us wherever you are.
            </p>


            {/* =====================================
                CONTACT DETAILS
            ====================================== */}

            <div className="mt-10 border-t border-[#ded5c9]">

              {/* EMAIL */}

              <ContactItem
                icon={<FiMail size={16} />}
                label="Email"
              >
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-[#8A7356]"
                >
                  {CONTACT_EMAIL}
                </a>
              </ContactItem>


              {/* LOCATION */}

              <ContactItem
                icon={<FiMapPin size={16} />}
                label="Based In"
              >
                {BUSINESS_LOCATION}
              </ContactItem>


              {/* BUSINESS TYPE */}

              <ContactItem
                icon={<FiGlobe size={16} />}
                label="Business"
              >
                Online Store — Shop Velmora anytime, from anywhere.
              </ContactItem>


              {/* SUPPORT HOURS */}

              <ContactItem
                icon={<FiClock size={16} />}
                label="Customer Support"
                last
              >
                Monday — Saturday
                <span className="block">
                  10:00 AM — 7:00 PM IST
                </span>
              </ContactItem>

            </div>


            {/* SMALL NOTE */}

            <div className="mt-9 border-l border-[#cdbfaf] pl-5">

              <p className="max-w-[360px] font-serif text-[20px] italic leading-[1.3] text-[#725f4d]">
                Thoughtful pieces deserve thoughtful service.
              </p>

              <p className="mt-3 max-w-[360px] text-[14px] leading-6 text-[#8a7d70]">
                We aim to respond to customer enquiries as quickly
                as possible during our support hours.
              </p>

            </div>

          </div>


          {/* =====================================
              RIGHT — CONTACT FORM
          ====================================== */}

          <div className="border border-[#ded5c9] bg-[#fffdf9] p-6 sm:p-8 lg:p-10">

            <div className="mb-8">

              <p className="text-[14px] font-semibold uppercase tracking-[0.25em] text-[#9b8772]">
                Send an Enquiry
              </p>

              <h2 className="mt-3 font-serif text-[32px] font-medium leading-none sm:text-[38px]">
                How can we help?
              </h2>

              <p className="mt-4 max-w-[520px] text-[15px] leading-6 text-[#7b7065]">
                Share a few details below and we’ll get back to you.
              </p>

            </div>


            {/* =====================================
                SUCCESS MESSAGE
            ====================================== */}

            {submitted && (
              <div className="mb-7 flex items-start gap-3 border border-[#cfd3bd] bg-[#f1f3e8] px-4 py-4 text-[#55603e]">

                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#aeb797]">
                  <FiCheck size={13} />
                </div>

                <div>

                  <p className="text-[14px] font-semibold uppercase tracking-[0.12em]">
                    Message Sent
                  </p>

                  <p className="mt-1 text-[14px] leading-5">
                    Thank you for contacting Velmora. We’ll be in
                    touch with you soon.
                  </p>

                </div>

              </div>
            )}


            {/* =====================================
                FORM
            ====================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {submitError && <p className="auth-error" role="alert">{submitError}</p>}

              {/* NAME + EMAIL */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <Field
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />

                <Field
                  label="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

              </div>


              {/* PHONE + SUBJECT */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <Field
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91"
                  required={false}
                />

                <div>

                  <label className="mb-2 block text-[14px] font-semibold uppercase tracking-[0.17em] text-[#8e7b69]">
                    Subject
                  </label>

                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="h-[52px] w-full border border-[#d9cfc2] bg-[#faf7ef] px-4 text-[16px] text-[#40372f] outline-none transition focus:border-[#8a7356]"
                  >
                    <option value="">
                      Select a subject
                    </option>

                    <option value="Product Inquiry">
                      Product Enquiry
                    </option>

                    <option value="Order Related">
                      Order Support
                    </option>

                    <option value="General Inquiry">
                      Shipping & Delivery
                    </option>

                    <option value="Complaint">
                      Returns & Exchanges
                    </option>

                    <option value="Suggestion">
                      Product Selection Help
                    </option>

                    <option value="Payment Related">
                      Business Enquiry
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>

              </div>


              {/* MESSAGE */}

              <div>

                <label className="mb-2 block text-[14px] font-semibold uppercase tracking-[0.17em] text-[#8e7b69]">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none border border-[#d9cfc2] bg-[#faf7ef] px-4 py-4 text-[16px] leading-6 text-[#40372f] outline-none transition placeholder:text-[#b1a69a] focus:border-[#8a7356]"
                />

              </div>


              {/* SEND */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-2 inline-flex min-h-[52px] w-full items-center justify-center gap-3 bg-[#332b24] px-8 text-[14px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#514337] sm:w-auto"
              >
                {isSubmitting ? "Sending..." : "Send Message"}

                <FiArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

            </form>

          </div>

        </div>
      </section>


      {/* =========================================
          SERVICE STRIP
      ========================================== */}

      <section className="border-y border-[#ded5c9] bg-[#f3eee6]">

        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 px-5 sm:grid-cols-3 sm:px-8 lg:px-10">

          <ServiceItem
            number="01"
            title="Product Support"
            text="Questions about materials, dimensions or choosing the right piece."
          />

          <ServiceItem
            number="02"
            title="Order Assistance"
            text="Help with your order, shipping, delivery, returns or exchanges."
          />

          <ServiceItem
            number="03"
            title="Online Support"
            text="Friendly digital support from Velmora, wherever you are."
            last
          />

        </div>

      </section>

    </main>
  );
}


/* =========================================
   FIELD
========================================= */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = true,
}) {
  return (
    <div>

      <label className="mb-2 block text-[14px] font-semibold uppercase tracking-[0.17em] text-[#8e7b69]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-[52px] w-full border border-[#d9cfc2] bg-[#faf7ef] px-4 text-[16px] text-[#40372f] outline-none transition placeholder:text-[#b1a69a] focus:border-[#8a7356]"
      />

    </div>
  );
}


/* =========================================
   CONTACT ITEM
========================================= */

function ContactItem({
  icon,
  label,
  children,
  last = false,
}) {
  return (
    <div
      className={`grid grid-cols-[38px_1fr] gap-4 py-5 ${
        last
          ? ""
          : "border-b border-[#ded5c9]"
      }`}
    >

      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6cabd] text-[#665747]">
        {icon}
      </div>

      <div>

        <p className="text-[14px] font-semibold uppercase tracking-[0.19em] text-[#9b8772]">
          {label}
        </p>

        <div className="mt-1 text-[15px] leading-6 text-[#50473f]">
          {children}
        </div>

      </div>

    </div>
  );
}


/* =========================================
   SERVICE ITEM
========================================= */

function ServiceItem({
  number,
  title,
  text,
  last = false,
}) {
  return (
    <div
      className={`py-10 sm:px-8 sm:py-12 ${
        last
          ? ""
          : "border-b border-[#d8cfc3] sm:border-b-0 sm:border-r"
      }`}
    >

      <span className="text-[14px] font-semibold tracking-[0.18em] text-[#9b8772]">
        {number}
      </span>

      <h3 className="mt-3 font-serif text-[25px] font-medium">
        {title}
      </h3>

      <p className="mt-3 max-w-[280px] text-[14px] leading-6 text-[#776b60]">
        {text}
      </p>

    </div>
  );
}

export default Contact;
