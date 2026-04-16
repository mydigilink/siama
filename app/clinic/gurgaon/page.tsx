'use client';
import ClinicProfile from '@/components/mainwebsite/clinicprofile';
import { useState } from 'react';

import Link from "next/link";
import { notFound } from "next/navigation";
import Image from 'next/image';
import Script from "next/script";
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import ClinicDetailPage from '@/components/mainwebsite/ClinicDetailPage';


const clinic = {
  name: 'Siama SkinCare',
  type: 'Skin care clinic',
  image:'/img/Gurgaon.jpeg',
  rating: 4.7,
  reviews: 29,
  location: 'Gurgaon - Sec 67',
  address: 'Shop No 104, M3M Urbana, Sec67, Gurgaon',
  phone: '+91 8287795045',

  images: [
    'https://lh3.googleusercontent.com/p/AF1QipO_b5Zbf2rNh5vNW_B5aPlXtBGPkOIMF1oh_7O-=w243-h406-n-k-no-nu',
    'https://lh3.googleusercontent.com/p/AF1QipOoBcCmJfwfH0kEeNEHMA2VdWBYitxZQfs9-Xea=w243-h174-n-k-no-nu',
    'https://lh3.googleusercontent.com/p/AF1QipP9cNx6pmMr4vwrZrKjEdaV3DEsHryqnmBp3CJ0=w243-h406-n-k-no-nu',
    'https://lh3.googleusercontent.com/p/AF1QipOoBcCmJfwfH0kEeNEHMA2VdWBYitxZQfs9-Xea=w243-h174-n-k-no-nu'
  ],

  mapEmbed:
    'https://www.google.com/maps?q=Siama+SkinCare+Noida&output=embed'
};

const faqData = [
  {
    question: 'Where is Siama SkinCare located?',
    answer:
      'Siama SkinCare is located in Noida, Uttar Pradesh, India.',
  },
  {
    question: 'What is the rating of Siama SkinCare?',
    answer:
      'The clinic has a rating of 4.7 based on 29 Google reviews.',
  },
  {
    question: 'What services are available at Siama SkinCare?',
    answer:
      'Services include acne treatment, laser therapy, anti-aging treatments, and skin rejuvenation.',
  },
  {
    question: 'How can I contact Siama SkinCare?',
    answer:
      'You can contact the clinic directly using the Call Now button on this page.',
  },
  {
    question: 'Does Siama SkinCare accept appointments?',
    answer:
      'Yes, appointments are recommended. You can call the clinic to book your visit.',
  },
];
const reviews = [
  {
    name: 'Rahul Sharma',
    rating: 5,
    time: '2 weeks ago',
    text: 'Excellent skin treatment! The doctor is very experienced and staff is friendly.',
  },
  {
    name: 'Priya Verma',
    rating: 4,
    time: '1 month ago',
    text: 'Good experience overall. Clean clinic and professional service.',
  },
  {
    name: 'Amit Singh',
    rating: 5,
    time: '3 weeks ago',
    text: 'Highly recommended for acne treatment. Visible results in few sessions.',
  },
];
export default function NoidaClinicPage() {
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Header />
             <div className="container pt-4 min-h-screen bg-gray-50">
           <ClinicDetailPage clinic={clinic} faqData={faqData} reviews={reviews} /> 
           {/* <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Noida Clinic
                </h1>
                
                <div className="bg-white rounded-lg shadow p-8">
                    <p className="text-gray-600 text-lg mb-8">
                        Welcome to our Noida clinic. Please select a service below.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded-lg p-6 hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold mb-2">Appointment</h2>
                            <p className="text-gray-600 mb-4">Book your appointment</p>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Book Now
                            </button>
                        </div>
                        
                        <div className="border rounded-lg p-6 hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold mb-2">Services</h2>
                            <p className="text-gray-600 mb-4">View our services</p>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
        <Footer />
        </>
       
    );
}