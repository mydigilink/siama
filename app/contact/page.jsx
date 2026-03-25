'use client';
import { useState } from 'react';




export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                   {/* LEFT CARD */}
          <div className="col-lg-6">
            <div className="help-card">

              <h3 className="help-title">
                Ready to help you!
              </h3>

              <div className="help-info">

                <p>
                  <strong>Address:</strong> First Floor, C-129 Pocket L<br/>
                  Noida sector 18, Uttar Pradesh (201301)
                </p>

                <p>
                  <strong>Phone:</strong> 8287795045 / 9220947771
                </p>

                <p>
                  <strong>Email:</strong> reach.siama@gmail.com
                </p>

              </div>

            </div>
          </div>
                <div className="col-lg-6">
                    <h1 className="mb-4 text-left">Contact Us</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="subject" className="form-label">Subject</label>
                            <input
                                type="text"
                                className="form-control"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">Message</label>
                            <textarea
                                className="form-control"
                                id="message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="about-btn btn-primary w-100">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
}