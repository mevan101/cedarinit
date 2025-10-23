import React from 'react';
import SafeImage from '../../../components/SafeImage';
import SafeLink from '../../../components/SafeLink';

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">We'd love to hear from you! Please reach out with any questions or comments.</p>
      
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Get in Touch</h2>
        <p>Email: <SafeLink href="mailto:info@cedar-initiative.org">info@cedar-initiative.org</SafeLink></p>
        <p>Phone: <SafeLink href="tel:+1234567890">+1 (234) 567-890</SafeLink></p>
      </div>

      <form className="w-full max-w-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="name">Name</label>
          <input className="border rounded w-full py-2 px-3" type="text" id="name" name="name" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
          <input className="border rounded w-full py-2 px-3" type="email" id="email" name="email" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="message">Message</label>
          <textarea className="border rounded w-full py-2 px-3" id="message" name="message" rows="4" required></textarea>
        </div>
        <button className="bg-emerald-500 text-white font-bold py-2 px-4 rounded" type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;