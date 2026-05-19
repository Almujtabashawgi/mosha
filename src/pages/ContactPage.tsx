import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 🔥 الدالة الصحيحة لإرسال الايميل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");

      setIsSubmitted(true);

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      setTimeout(() => setIsSubmitted(false), 4000);

    } catch (err) {
      setErrorMsg("Failed to send message. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Hero */}
      <section className="py-20 bg-blue-900 text-center text-white">
        <h1 className="text-4xl font-bold">{t('contactTitle')}</h1>
        <p className="mt-4 text-blue-200">{t('contactSubtitle')}</p>
      </section>

      {/* Contact */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">
              {isRTL ? 'أرسل لنا رسالة' : 'Send Us a Message'}
            </h2>

            {isSubmitted && (
              <div className="text-green-600 flex items-center gap-2 mb-6">
                <CheckCircle /> Message sent successfully
              </div>
            )}

            {errorMsg && (
              <div className="text-red-600 mb-6">{errorMsg}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-3 border rounded-xl"
              />

              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border rounded-xl"
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-3 border rounded-xl"
              />

              <select
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              >
                <option value="">Select subject</option>
                <option value="general">General Inquiry</option>
                <option value="products">Product Inquiry</option>
                <option value="partnership">Business Partnership</option>
                <option value="other">Other</option>
              </select>

              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full p-3 border rounded-xl"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-900 text-white py-4 rounded-xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send />
              </button>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;