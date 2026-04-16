'use client';

import { useEffect } from 'react';
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import ClinicProfile from '@/components/mainwebsite/clinicprofile';

export default function NoidaClinicPage() {

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, []);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">

        {/* NAV */}
        <div className="sticky top-0 bg-white z-20 shadow p-4 flex gap-4 justify-center">
          <a href="#noida">Noida</a>
          <a href="#gurgaon">Gurgaon</a>
          <a href="#ghaziabad">Ghaziabad</a>
        </div>

        {/* NOIDA */}
        <div id="noida">
          <ClinicProfile
            clinicData={{
              name: 'Siama SkinCare - Noida',
              location: 'Sector 18, Noida',
              address: 'C-129, First Floor, Sector 18, Noida',
              phone: '+91-8287795045',
              map: 'https://www.google.com/maps/place/Siama+SkinCare/data=!4m2!3m1!1s0x0:0x43d528d5c6e71ea5?sa=X&ved=1t:2428&ictx=111',
              url: 'noida'
            }}
          />
        </div>

        {/* GURGAON */}
        <div id="gurgaon">
          <ClinicProfile
            clinicData={{
              name: 'Siama SkinCare - Gurgaon',
              location: 'DLF Phase 1, Gurgaon',
              address: 'MG Road, DLF Phase 1, Gurgaon',
              phone: '+91-8287795046',
              image:'/img/Gurgaon.jpeg',
              map: 'https://maps.app.goo.gl/WPhnkCJKQzMqTdmM7',
              url: 'gurgaon'
            }}
          />
        </div>

        {/* GHAZIABAD */}
        <div id="ghaziabad">
          <ClinicProfile
            clinicData={{
              name: 'Siama SkinCare - Ghaziabad',
              location: 'Raj Nagar, Ghaziabad',
              address: 'Raj Nagar District Centre, Ghaziabad',
              phone: '+91-8287795047',
              map: 'https://www.google.com/maps?q=Raj+Nagar+Ghaziabad+Skin+Clinic',
              url: 'ghaziabad'
            }}
          />
        </div>

      </div>

      <Footer />
    </>
  );
}