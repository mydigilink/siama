'use client';
import Image from 'next/image';
export default function About() {
                    return (
                        <main className=" container bg-white">
                            {/* Hero Section */}
                            <section className="px-6 py-24 sm:px-12 lg:px-24">
                                <div className="max-w-4xl mx-auto">
                                    <h1 className="text-5xl font-bold text-gray-900 mb-6">About Us</h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        <Image
                                                src="/img/hero-1.jpg"
                                                alt="About Us"
                                                    width={500}
                                                height={300}
                                                className="object-cover rounded-lg pull-left"
                                            />  <div>
                                            <p className="text-xl text-gray-600 leading-relaxed mb-4">
                                                At Siama, we devote ourselves to deliver best quality services at your home with top notch professionals and high-quality products. Siama is founded by Dr Nidhi Khandelwal and Co-founded by Mr. Manoj Srivastava.
                                            </p>
                                            <p className="text-xl text-gray-600 leading-relaxed">
                                                SIAMA is a symbiotic platform for therapist, doctors & consumers, creating an entire ecosystem for well-being.
                                            </p>
                                        </div>
                                    
                                    </div>
                                </div>
                            </section>

                            {/* Mission Section */}
                            <section className="px-6 py-16 sm:px-12 lg:px-24 bg-gray-50">
                                <div className="max-w-4xl mx-auto">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-8">A step towards bringing confidence with beauty.</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        <div className="relative h-80 order-2 md:order-1">
                                           
                                        </div>
                                        <p className="text-lg text-gray-600 leading-relaxed order-1 md:order-2">
                                            Siama is a premier beauty care service provider with a range of specialized treatments. We think real beauty emanates from your confident look. With quality products and the latest techniques, we provide exceptional care.
                                        </p>
                                    </div>
                                </div>
                            </section>
                            <div className='clearfix'></div>

                            {/* Values Section */}
                            <section className="px-6 py-16 sm:px-12 lg:px-24">
                                <div className="max-w-4xl mx-auto">
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="text-center">
                                            <div className="relative h-48 mb-4">
                                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M9 18h6"/>
  <path d="M10 22h4"/>
  <path d="M12 2a7 7 0 0 0-4 12c1 1 2 2 2 4h4c0-2 1-3 2-4a7 7 0 0 0-4-12z"/>
</svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                                            <p className="text-gray-600">Continuously improving and adapting to new challenges.</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="relative h-48 mb-4">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z"/>
  <path d="M9 12l2 2 4-4"/>
</svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrity</h3>
                                            <p className="text-gray-600">Acting with honesty and strong moral principles.</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="relative h-48 mb-4">
                                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M8 21h8"/>
  <path d="M12 17v4"/>
  <path d="M5 3h14v4a7 7 0 0 1-14 0V3z"/>
  <path d="M3 5h2v2a4 4 0 0 1-2-2z"/>
  <path d="M21 5h-2v2a4 4 0 0 0 2-2z"/>
</svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
                                            <p className="text-gray-600">Delivering quality in everything we do.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>
                    );
                }