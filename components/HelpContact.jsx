"use client";

export default function HelpContact() {
  return (
    <section className="help-section py-5">
      <div className="container">

        <div className="row g-4">

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

          {/* RIGHT FORM */}
          <div className="col-lg-6">
            <div className="help-card">

              <h3 className="help-title">
                Looking for any help?
              </h3>

              <form className="help-form">

                <div className="row g-3">

                  <div className="col-md-6">
                    <label>First name *</label>
                    <input type="text" className="form-control"/>
                  </div>

                  <div className="col-md-6">
                    <label>Last name</label>
                    <input type="text" className="form-control"/>
                  </div>

                  <div className="col-md-6">
                    <label>Your email *</label>
                    <input type="email" className="form-control"/>
                  </div>

                  <div className="col-md-6">
                    <label>Your phone *</label>
                    <input type="tel" className="form-control"/>
                  </div>

                  <div className="col-12">
                    <label>Message *</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Message"
                    ></textarea>
                  </div>

                </div>

                <button className="help-btn mt-4">
                  Send message
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}