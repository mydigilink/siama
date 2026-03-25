import React from 'react';

export default function RightSideBar() {
    
  const applicants = [
    { name: "Mike Tyson", role: "Applied for: IOS Developer" },
    { name: "Zara Thomas", role: "Applied for: Content Designer" },
    { name: "Neenu Abraham", role: "Applied for: Frontend Developer" },
    { name: "John Samuel", role: "Applied for: IOS Developer" },
    { name: "Zara Thomas", role: "Applied for: Content Designer" },
  ];
  const training = [
    { name: "Mike Tyson", role: "IOS Developer" },
    { name: "Samuel John", role: "Android Developer" },
    { name: "Jiya George", role: "UI/UX Designer" },
  ];
    return (
          <div className=" d-none d-lg-block">
          <div className="p-4 border-start bg-white" style={{ minHeight: "100vh" }}>
            {/* PROFILE */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex gap-3">
                <button className="btn btn-light btn-sm rounded-circle">
                  <i className="bi bi-gear"></i>
                </button>
                <button className="btn btn-light btn-sm rounded-circle">
                  <i className="bi bi-bell"></i>
                </button>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="text-end">
                  <div className="fw-semibold small">Sara Abraham</div>
                  <small className="text-muted">View profile</small>
                </div>
                <div
                  className="rounded-circle bg-warning"
                  style={{ width: "42px", height: "42px" }}
                ></div>
              </div>
            </div>

            {/* CALENDAR */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Schedule Calendar</h6>
                <small className="text-muted">May</small>
              </div>

              <div className="row g-2">
                {[
                  { day: "Mon", date: "22" },
                  { day: "Tue", date: "23" },
                  { day: "Wed", date: "24", active: true },
                  { day: "Thu", date: "23" },
                  { day: "Fri", date: "23" },
                ].map((d, i) => (
                  <div className="col" key={i}>
                    <div
                      className={`text-center rounded-4 py-3 ${
                        d.active ? "bg-primary text-white" : "bg-light"
                      }`}
                    >
                      <small className="d-block">{d.day}</small>
                      <strong>{d.date}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NEW APPLICANTS */}
            {/* <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">New Applicants</h6>
                <button className="btn btn-sm btn-light">View All</button>
              </div>

              <div className="card border-0 bg-light rounded-4">
                <div className="card-body p-3">
                  {applicants.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center mb-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle bg-secondary-subtle"
                          style={{ width: "42px", height: "42px" }}
                        ></div>
                        <div>
                          <div className="fw-semibold small">{item.name}</div>
                          <small className="text-muted">{item.role}</small>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-primary rounded-circle">
                          <i className="bi bi-chat-dots"></i>
                        </button>
                        <button className="btn btn-sm btn-primary rounded-circle">
                          <i className="bi bi-telephone"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            {/* READY FOR TRAINING */}
            {/* <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Ready For Training</h6>
                <button className="btn btn-sm btn-light">View All</button>
              </div>

              <div className="row g-3">
                {training.map((item, index) => (
                  <div className="col-4" key={index}>
                    <div className="card border-0 shadow-sm rounded-4 text-center h-100">
                      <div className="card-body p-2">
                        <div
                          className="rounded-circle bg-secondary-subtle mx-auto mb-2"
                          style={{ width: "48px", height: "48px" }}
                        ></div>
                        <div className="fw-semibold small">{item.name}</div>
                        <small className="text-muted d-block mb-2">{item.role}</small>
                        <button className="btn btn-primary btn-sm w-100 rounded-3">
                          Start
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
    );
}