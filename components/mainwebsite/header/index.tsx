"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./style.module.scss";
import { Stethoscope, CalendarCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "../contact-form";
import CallButton from "../call-button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import BookingAppointmentForm from "./../BookingAppointmentForm";
import {
  Sparkles,
  ScanFace,
  Droplets,
  Syringe,
  Activity,
  Brush,
  Zap,
  Layers,
  Wand2,
  Flame,
  HeartPulse,
  Scissors,
  Smile,
  User,
  Target,
  CircleDot,
  Waves,
  Feather,
  Sun,
  Snowflake,
} from "lucide-react";
// import BookingAppointmentForm from "../BookingAppointmentForm";

  const actions = [
  { label: "Consult a Dentist", type: "dentist" },
  { label: "Consult Dermatologist", type: "dermat" },
  { label: "Book an Appointment", type: "appointment" },
];

export default function Header() {
  const pathname = usePathname();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<"dentist" | "dermat" | "others">("dentist");

  const searchParams = useSearchParams();
  const { user, token, loading } = useAuth();
  const { getCartCount } = useCart();
  const [mounted, setMounted] = useState(false);
const treatmentsMenu = [
  {
    title: "Skin",
    icon: "Sparkles",
    items: [
      { name: "Laser Hair Removal", slug: "laser-hair-removal", icon: "Zap" },
      { name: "Laser Facials", slug: "laser-facials", icon: "ScanFace" },
      { name: "Chemical Peels", slug: "chemical-peel", icon: "Droplets" },
      { name: "Face PRP", slug: "face-prp", icon: "Syringe" },
      { name: "Skin Rejuvenation", slug: "skin-rejuvenation", icon: "Activity" },
      { name: "Permanent Makeup", slug: "permanent-makeup", icon: "Brush" },
      { name: "Exosome Treatment", slug: "exosome-treatment", icon: "Layers" },
      { name: "Microdermabrasion", slug: "microdermabrasion", icon: "Wand2" },
      { name: "Microneedling", slug: "microneedling", icon: "CircleDot" },
      { name: "Hydra Facial", slug: "hydra-facial", icon: "Waves" },
      { name: "Acne Treatment", slug: "acne-treatment", icon: "Flame" },
      { name: "Fractional CO2", slug: "fractional-co2", icon: "Sun" },
    ],
  },
  {
    title: "Body Contouring",
    icon: "Target",
    items: [
      { name: "Body Slimming", slug: "body-slimming", icon: "Feather" },
      { name: "Weight Loss", slug: "weight-loss-treatment", icon: "Activity" },
      { name: "Slimming Facial", slug: "slimming-facial", icon: "Smile" },
      { name: "Jawline", slug: "jawline-definition", icon: "User" },
      { name: "Body Shaping", slug: "body-shaping", icon: "Layers" },
      { name: "Coolsculpting", slug: "coolsculpting", icon: "Snowflake" },
      { name: "Figure Correction", slug: "figure-correction", icon: "Target" },
      { name: "Face Remodeling", slug: "full-face-remodeling", icon: "ScanFace" },
      { name: "Chin Enhancement", slug: "chin-enhancement", icon: "CircleDot" },
    ],
  },
  {
    title: "Hair",
    icon: "Scissors",
    items: [
      { name: "Hair PRP", slug: "hair-prp", icon: "Syringe" },
      { name: "Hair GFC", slug: "hair-gfc", icon: "Droplets" },
      { name: "Hair Transplant", slug: "hair-transplant", icon: "Scissors" },
      { name: "Hair Exosome", slug: "hair-exosome", icon: "Layers" },
    ],
  },
  {
    title: "Anti Aging",
    icon: "HeartPulse",
    items: [
      { name: "Botox", slug: "botox", icon: "Syringe" },
      { name: "HIFU", slug: "hifu-treatment", icon: "Zap" },
      { name: "Skin Booster", slug: "skin-booster", icon: "Droplets" },
      { name: "MNRF", slug: "mnrf", icon: "Activity" },
      { name: "Cog Thread", slug: "cog-thread", icon: "Layers" },
      { name: "PRP", slug: "prp", icon: "Syringe" },
      { name: "Dermal Filler", slug: "dermal-filler", icon: "CircleDot" },
      { name: "Prophilo", slug: "prophilo", icon: "Droplets" },
    ],
  },
];
  // Prevent hydration mismatch by only showing auth state after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial render, always show login (prevents hydration mismatch)
  const isAuthed = mounted && (Boolean(user) || Boolean(token));
  const shortName =
    user?.name && user.name.trim().length > 0 ? user.name.trim().slice(0, 2) : "Ac";
  const accountLabel = user?.name
    ? `Hi, ${user.name.split(" ")[0]}`
    : "Account";

  // Safe cart count function
  const safeGetCartCount = getCartCount || (() => 0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<"Female" | "Male">("Female");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const homeMenuItems = [
    { label: "About Us", href: "/about" },
    // { label: "Our Services", href: "/services" },
    // { label: "Gallery", href: "/gallery" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ];

  const servicesMenuItems = [
    { label: "Laser Hair Removal", id: "66545d890c42d4097a3533f1", href: "/services/laser-hair-reduction" },
    { label: "Hair Treatment", id: "66545f2e0c42d4097a35cea0", href: "/services/hair-treatment" },
    { label: "Skin Rejuvenation", id: "66545f740c42d4097a35e9ee", href: "/services/skin-rejuvenation" },
    { label: "Advance Laser Facial", id: "66545fb40c42d4097a36035b", href: "/services/advanced-laser-facial" },
    { label: "Dental Sathi", id: "681e29785ccfa5802f5195b3", href: "/services/siama-dental" },
    { label: "Chemical Peel", id: "681f7c575ccfa5802f52d47e", href: "/services/chemical-peel" },
    { label: "Glutathione", id: "6820cf635ccfa5802f535d3f", href: "/services/glutathione" },
    { label: "Body Slimming", id: "6820cf835ccfa5802f5361c0", href: "/services/body-slimming" },
  ];
const dentalMenuItems = [
  
  { label: "Teeth Whitening", id: "681f7c575ccfa5802f52d48a", href: "/services/teeth-whitening" },
  { label: "Aligners", id: "681f7c575ccfa5802f52d48b", href: "/services/aligners" },
  { label: "Braces", id: "681f7c575ccfa5802f52d48c", href: "/services/braces" },
  { label: "Dental Veneers", id: "681f7c575ccfa5802f52d48d", href: "/services/dental-veneers" },
  { label: "Smile MakeOver", id: "681f7c575ccfa5802f52d48e", href: "/services/smile-makeover" },
  { label: "Full Mouth Rehabilitation", id: "681f7c575ccfa5802f52d48f", href: "/services/full-mouth-rehabilitation" },
  { label: "Dental Implant", id: "681f7c575ccfa5802f52d490", href: "/services/dental-implant" },
  { label: "Root Canal Treatment", id: "681f7c575ccfa5802f52d491", href: "/services/root-canal-treatment" },
  { label: "Teeth Fillings", id: "681f7c575ccfa5802f52d492", href: "/services/teeth-fillings" },
  { label: "Teeth Cleaning", id: "681f7c575ccfa5802f52d493", href: "/services/teeth-cleaning" },
  { label: "Dental Bonding", id: "681f7c575ccfa5802f52d494", href: "/services/dental-bonding" }
];
  const concernsMenuItems = [
    { label: "Acne", slug: "acne", id: "66545d890c42d4097a3533f1" },
    { label: "Pigmentation", slug: "pigmentation", id: "66545f2e0c42d4097a35cea0" },
    { label: "Antiaging", slug: "antiaging", id: "66545f740c42d4097a35e9ee" },
    { label: "Hair Loss", slug: "hair-loss", id: "66545fb40c42d4097a36035b" },
    { label: "Hair Fall", slug: "hair-fall", id: "681e29785ccfa5802f5195b3" },
    { label: "Dark Lips", slug: "dark-lips", id: "681f7c575ccfa5802f52d47e" },
    { label: "Dark Circle", slug: "dark-circle", id: "681f7c575ccfa5802f52d47f" },
    { label: "Acne Scar", slug: "acne-scar", id: "681f7c575ccfa5802f52d480" },
    { label: "Dull & Dehydrated Skin", slug: "dull-dehydrated-skin", id: "681f7c575ccfa5802f52d481" },
    { label: "Wrinkles", slug: "wrinkles", id: "681f7c575ccfa5802f52d482" },
    { label: "Gaps in Teeth", slug: "gaps-in-teeth", id: "681f7c575ccfa5802f52d483" },
    { label: "Crooked Teeth", slug: "crooked-teeth", id: "681f7c575ccfa5802f52d484" },
    { label: "Misaligned teeth", slug: "misaligned-teeth", id: "681f7c575ccfa5802f52d485" },
    { label: "Missing Tooth", slug: "missing-tooth", id: "681f7c575ccfa5802f52d486" },
    { label: "Full Mouth Rehabilitation", slug: "full-mouth-rehabilitation", id: "681f7c575ccfa5802f52d487" },
    { label: "Pain in Tooth", slug: "pain-in-tooth", id: "681f7c575ccfa5802f52d488" },
    { label: "Yellow Teeth", slug: "yellow-teeth", id: "681f7c575ccfa5802f52d489" },
    
  ];

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileDropdown = (menu: string) => {
    setMobileDropdown(mobileDropdown === menu ? null : menu);
  };

  function setModalType(type: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <header className={styles.header}>
      <div className={styles.mainHeader}>
        <div className={` ${styles.container} ${styles.headerTop}`}>
          {/* Mobile: Hamburger (left) */}
         <div className="container">
         <div className="row align-items-center justify-content-between">
           <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
        
            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Logo Section - centered on mobile */}
          <div className={`col-md-3 ${styles.logoSection}`}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/img/siama.jpeg"
                alt="Siama Esthetics"
                width={126}
                height={50}
                className={styles.logoImage}
                priority
              />
            </Link>
          </div>

          {/* Mobile: Search, Cart, User icons (right) - visible only on mobile */}
          <div className={`col-md-12 ${styles.mobileHeaderIcons}`}>
            <button
              type="button"
              className={styles.mobileHeaderIcon}
              onClick={() => { }}
              aria-label="Search"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <Link href="/cart" className={styles.mobileHeaderCart} aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {safeGetCartCount() > 0 && (
                <span className={styles.mobileHeaderCartCount}>{safeGetCartCount()}</span>
              )}
            </Link>
            <Link href={isAuthed ? "/account" : "/login"} className={styles.mobileHeaderIcon} aria-label="Account">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>

          {/* Search Bar - desktop only */}
          {/* <div className={`col-md-6 ${styles.searchSection}`  }>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className={styles.searchIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </div> */}
    <div className="col-md-5 headerbtn d-flex justify-content-end gap-3">

  <button
  onClick={() => {
          setSelectedCategory("dentist");
          setIsBookingOpen(true);
        }}
    className="cta secondary"
  >
    <Stethoscope size={16} />
    <span>Consult Dentist</span>
  </button>

  <button
    onClick={() => {
          setSelectedCategory("dermat");
          setIsBookingOpen(true);
        }}
    className="cta secondary"
  >
    <Sparkles size={16} />
    <span>Consult Dermat</span>
  </button>

  <button
 onClick={() => {
   setSelectedCategory("others");
    setIsBookingOpen(true);
  }}
  className="cta primary"
  >
    <CalendarCheck size={18} />
    <span>Book Now</span>
  </button>

</div>
{isBookingOpen && (
  <div
    className="quick-chat-overlay"
    onClick={() => setIsBookingOpen(false)}
  >
    <div
      className="quick-chat-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="quick-chat-close"
        onClick={() => setIsBookingOpen(false)}
      >
        ×
      </button>

      <BookingAppointmentForm defaultCategory={selectedCategory}  />
    </div>
  </div>
)}
{/* <div className="col-md-5 headerbtn text-end d-flex flex-column gap-2">
  {actions.map((action) => (
    <button
      key={action.type}
      type="button"
      onClick={() => {
        setIsModalOpen(true);
        setModalType(action.type); // optional (for dynamic modal)
      }}
      className="about-btn"
    >
      {action.label}
    </button>
  ))}
</div> */}
</div></div></div>
        <div className={styles.container}>
<div className="container">
<div className="row align-items-center justify-content-between">
          {/* Navigation and Actions */}
          <div className={`col-md-8 ${styles.navSection}`}>
            {/* Navigation Links with Dropdowns */}
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                {/* Home Dropdown */}
                <li
                  className={styles.navItem}
                  // onMouseEnter={() => handleMouseEnter("home")}
                  // onMouseLeave={handleMouseLeave}
                >
                  <Link href="/" className={styles.navLink}>HOME
                    {/* <svg
                      className={styles.dropdownArrow}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg> */}
                  </Link>
                  {/* {activeDropdown === "home" && (
                    <ul
                      className={styles.dropdownMenu}
                      onMouseEnter={() => handleMouseEnter("home")}
                      onMouseLeave={handleMouseLeave}
                    >
                      {homeMenuItems.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} className={styles.dropdownLink}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )} */}
                </li>

                {/* Treatments Dropdown */}
                {/* <li
                  className={styles.navItem}
                  onMouseEnter={() => handleMouseEnter("services")}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link href="/services" className={styles.navLink} title="services">Treatments
                    <svg
                      className={styles.dropdownArrow}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Link>
                  {activeDropdown === "services" && (
                    <ul
                      className={styles.dropdownMenu}
                      onMouseEnter={() => handleMouseEnter("services")}
                      onMouseLeave={handleMouseLeave}
                    >
                      {servicesMenuItems.map((item) => (
                        <li key={item.href} style={{ display: "block", justifyContent: "center" }}>
                          <Link href={item.href} className={styles.dropdownLink}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li> */}
                  {/* =========================
                🔥 TREATMENTS MENU
            ========================== */}
            {/* <li
              className={styles.navItem}
              onMouseEnter={() => handleMouseEnter("services")}
              onMouseLeave={handleMouseLeave}
            >
              <span className={styles.navLink}>
                TREATMENTS
                 <svg
                      className={styles.dropdownArrow}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
              </span>

            
{activeDropdown === "services" && (
  <div
    className={`${styles.dropdownMenu} ${styles.megaWrapper}`}
    onMouseEnter={() => handleMouseEnter("services")}
    onMouseLeave={handleMouseLeave}
  >
    
   
<div className="container mt-4">
      <div className="row  bg-white overflow-hidden">
        
     
        <div className="col-md-3  p-0">
          <ul className="">
            {treatmentsMenu.map((cat, index) => (
              <li
                key={index}
                className={`list-group-item ${
                  activeIndex === index ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                {cat.category}
              </li>
            ))}
          </ul>
        </div>

        
        <div className="col-md-9 p-4">
          <h5 className="mb-3">{treatmentsMenu[activeIndex].category}</h5>

          <div className="row">
            {treatmentsMenu[activeIndex].services.map((service, idx) => (
              <div key={idx} className="col-md-4 mb-3">
                <div className="p-3 border rounded h-100 hover-shadow">
                  
                  <h6 className="mb-1">{service.name}</h6>

                  
                  {"subServices" in service && service.subServices && (
                    <ul className="small text-muted ps-3 mb-0">
                      {Object.values(service.subServices)
                        .flat()
                        .slice(0, 3)
                        .map((sub, i) => (
                          <li key={i}>{sub}</li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      
      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: 0.3s;
        }

        .list-group-item.active {
          background-color: #f59e0b;
          border-color: #f59e0b;
          color: #fff;
        }
      `}</style>
    </div>
  </div>
)}
                
            </li>
               */}





                  

                  <li
                  className={`concernsNav ${styles.navItem}`}
                  onMouseEnter={() => handleMouseEnter("treatments")}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link 
                    href="/services" 
                    className={` ${styles.navLink} ${
                      pathname.startsWith("/services") ? styles.navLinkActive : ""
                    }`}
                  >Treatments
                    <svg
                      className={styles.dropdownArrow}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Link>
               {activeDropdown === "treatments" && (
  <div
    className={`${styles.cmdropdownMenu} row`}
    onMouseEnter={() => handleMouseEnter("treatments")}
    onMouseLeave={handleMouseLeave}
  >
    {/* ================= SKIN ================= */}
    <div className="col-md-3">
      <h6 className="d-flex align-items-center gap-2">
        <Sparkles size={16}/> Skin
      </h6>
      <ul>
        <li><Link href="/services/laser-hair-removal" className={styles.mdropdownLink}><Zap size={14}/> Laser Hair Removal</Link></li>
        <li><Link href="/services/laser-facials" className={styles.mdropdownLink}><ScanFace size={14}/> Laser Facials</Link></li>
        <li><Link href="/services/chemical-peel" className={styles.mdropdownLink}><Droplets size={14}/> Chemical Peels</Link></li>
        <li><Link href="/services/face-prp" className={styles.mdropdownLink}><Syringe size={14}/> Face PRP</Link></li>
        <li><Link href="/services/skin-rejuvenation" className={styles.mdropdownLink}><Activity size={14}/> Skin Rejuvenation</Link></li>
        <li><Link href="/services/permanent-makeup" className={styles.mdropdownLink}><Brush size={14}/> Permanent Makeup</Link></li>
        <li><Link href="/services/exosome-treatment" className={styles.mdropdownLink}><Layers size={14}/> Exosome Treatment</Link></li>
        <li><Link href="/services/microdermabrasion" className={styles.mdropdownLink}><Wand2 size={14}/> Microdermabrasion</Link></li>
        <li><Link href="/services/microneedling" className={styles.mdropdownLink}><CircleDot size={14}/> Microneedling</Link></li>
        <li><Link href="/services/hydra-facial" className={styles.mdropdownLink}><Waves size={14}/> Hydra Facial</Link></li>
        <li><Link href="/services/acne-treatment" className={styles.mdropdownLink}><Flame size={14}/> Acne Treatment</Link></li>
        <li><Link href="/services/fractional-co2" className={styles.mdropdownLink}><Sun size={14}/> Fractional CO2</Link></li>
        <li>
          <Link href="/services" className={styles.mdropdownLink} style={{fontSize:"12px"}}>
            View All →
          </Link>
        </li>
      </ul>
    </div>

    {/* ================= BODY CONTOURING ================= */}
    <div className="col-md-3">
      <h6 className="d-flex align-items-center gap-2">
        <Target size={16}/> Body Contouring
      </h6>
      <ul>
        <li><Link href="/services/body-slimming" className={styles.mdropdownLink}><Feather size={14}/> Body Slimming</Link></li>
        <li><Link href="/services/weight-loss-treatment" className={styles.mdropdownLink}><Activity size={14}/> Weight Loss</Link></li>
        <li><Link href="/services/slimming-facial" className={styles.mdropdownLink}><Smile size={14}/> Slimming Facial</Link></li>
        <li><Link href="/services/jawline-definition" className={styles.mdropdownLink}><User size={14}/> Jawline</Link></li>
        <li><Link href="/services/body-shaping" className={styles.mdropdownLink}><Layers size={14}/> Body Shaping</Link></li>
        <li><Link href="/services/coolsculpting" className={styles.mdropdownLink}><Snowflake size={14}/> Coolsculpting</Link></li>
        <li><Link href="/services/figure-correction" className={styles.mdropdownLink}><Target size={14}/> Figure Correction</Link></li>
        <li><Link href="/services/full-face-remodeling" className={styles.mdropdownLink}><ScanFace size={14}/> Face Remodeling</Link></li>
        <li><Link href="/services/chin-enhancement" className={styles.mdropdownLink}><CircleDot size={14}/> Chin Enhancement</Link></li>
      </ul>
    </div>

    {/* ================= HAIR ================= */}
    <div className="col-md-3">
      <h6 className="d-flex align-items-center gap-2">
        <Scissors size={16}/> Hair
      </h6>
      <ul>
        <li><Link href="/services/hair-prp" className={styles.mdropdownLink}><Syringe size={14}/> Hair PRP</Link></li>
        <li><Link href="/services/hair-gfc" className={styles.mdropdownLink}><Droplets size={14}/> Hair GFC</Link></li>
        <li><Link href="/services/hair-transplant" className={styles.mdropdownLink}><Scissors size={14}/> Hair Transplant</Link></li>
        <li><Link href="/services/hair-exosome" className={styles.mdropdownLink}><Layers size={14}/> Hair Exosome</Link></li>
      </ul>
    </div>

    {/* ================= ANTI AGING ================= */}
    <div className="col-md-3">
      <h6 className="d-flex align-items-center gap-2">
        <HeartPulse size={16}/> Anti Aging
      </h6>
      <ul>
        <li><Link href="/services/botox" className={styles.mdropdownLink}><Syringe size={14}/> Botox</Link></li>
        <li><Link href="/services/hifu-treatment" className={styles.mdropdownLink}><Zap size={14}/> HIFU</Link></li>
        <li><Link href="/services/skin-booster" className={styles.mdropdownLink}><Droplets size={14}/> Skin Booster</Link></li>
        <li><Link href="/services/mnrf" className={styles.mdropdownLink}><Activity size={14}/> MNRF</Link></li>
        <li><Link href="/services/cog-thread" className={styles.mdropdownLink}><Layers size={14}/> Cog Thread</Link></li>
        <li><Link href="/services/prp" className={styles.mdropdownLink}><Syringe size={14}/> PRP</Link></li>
        <li><Link href="/services/dermal-filler" className={styles.mdropdownLink}><CircleDot size={14}/> Dermal Filler</Link></li>
        <li><Link href="/services/prophilo" className={styles.mdropdownLink}><Droplets size={14}/> Prophilo</Link></li>
      </ul>
    </div>
  </div>
)}
                </li>

                <li
                  className={`concernsNav ${styles.navItem}`}
                  onMouseEnter={() => handleMouseEnter("concerns")}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link 
                    href="/concerns" 
                    className={` ${styles.navLink} ${
                      pathname.startsWith("/concerns") ? styles.navLinkActive : ""
                    }`}
                  >CONCERNS
                    <svg
                      className={styles.dropdownArrow}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Link>
                  {activeDropdown === "concerns" && (
                    <ul 
                      className={styles.cdropdownMenu}
                      onMouseEnter={() => handleMouseEnter("concerns")}
                      onMouseLeave={handleMouseLeave}
                    >
                      {concernsMenuItems.map((item) => (
                        <li key={item.id} style={{ display: "block", justifyContent: "center" }}>
                          <Link href={`/concerns?slug=${item.slug}`} className={styles.dropdownLink}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  )}
                </li>
                  <li
                  className={`concernsNav ${styles.navItem}`}
                  onMouseEnter={() => handleMouseEnter("dental")}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link 
                    href="/services/siama-dental" 
                    className={` ${styles.navLink} ${
                      pathname.startsWith("/dental") ? styles.navLinkActive : ""
                    }`}
                  >Dental
                    <svg
                      className={styles.dropdownArrow}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Link>
                  {activeDropdown === "dental" && (
                    <ul 
                      className={styles.cdropdownMenu}
                      onMouseEnter={() => handleMouseEnter("dental")}
                      onMouseLeave={handleMouseLeave}
                    >
                      {dentalMenuItems.map((item) => (
                        <li key={item.id} style={{ display: "block", justifyContent: "center" }}>
                          <Link href={`${item.href}`} className={styles.dropdownLink}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  )}
                </li>  
             
              <Link href={'/men-services'} className={styles.navLink}>MEN  </Link>
              <Link href={'/women-services'} className={styles.navLink}>WOMEN  </Link>
                 <Link href="/blogs" className={styles.navLink}>BLOGS
                    {/* <svg
                      className={styles.dropdownArrow}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg> */}
                  </Link>
                <li className={styles.navItem}>
                  <Link href="/contact" className={styles.navLink}>CONTACT US</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Desktop Action Buttons (Cart, Enquiry, Login) - visible on desktop only */}
          <div className={`col-md-3 text-end `}>
            <div className={`${styles.actionButtons}`}>
            <Link href="/cart" className={styles.cartButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4h15l-1 7H6"></path>
              </svg>
              {safeGetCartCount() > 0 && (
                <span className={styles.cartCount}>{safeGetCartCount()}</span>
              )}
            </Link>

            {/* <button
              className={styles.enquiryButton}
              onClick={() => setIsModalOpen(true)}
            >
              Enquiry now
            </button> */}
            {isAuthed ? (
              <Link href="/account" className={styles.loginButton}>
                {shortName.toUpperCase()}
              </Link>
            ) : (
              <Link href="/login" className={styles.loginButton}>
                Login
              </Link>
            )}
          </div></div>
          </div>
        </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.mobileMenuClose}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className={styles.mobileMenuContent}>
              {/* Top action buttons: Home, Contact us, Wallet */}
              <div className={styles.mobileTopButtons}>
                <Link href="/" className={styles.mobileTopButton} onClick={() => setIsMobileMenuOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Home</span>
                </Link>
                <button
                  type="button"
                  className={styles.mobileTopButton}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Contact us</span>
                </button>
                {/* <Link href={isAuthed ? "/account" : "/login"} className={styles.mobileTopButton} onClick={() => setIsMobileMenuOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span>Wallet</span>
                </Link> */}
              </div>

              {/* Main nav: TREATMENTS, CONCERNS, TREATMENTS FOR MEN */}
              <nav className={styles.mobileNav}>
                <ul className={styles.mobileNavList}>
                  <li className={styles.mobileNavItem}>
                    <button type="button" className={styles.mobileNavLink} onClick={() => toggleMobileDropdown("treatments")}>
                      <span>SERVICES</span>
                      <svg className={`${styles.mobileNavChevron} ${mobileDropdown === "treatments" ? styles.mobileNavChevronOpen : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                    {mobileDropdown === "treatments" && (
                      <ul className={styles.mobileDropdownMenu}>
                        {servicesMenuItems.map((item) => (
                          <li key={item.href}>
                            <Link href={item.href} className={styles.mobileDropdownLink} onClick={() => setIsMobileMenuOpen(false)}>
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  {/* <li className={styles.mobileNavItem}>
                    <button type="button" className={styles.mobileNavLink} onClick={() => toggleMobileDropdown("concerns")}>
                      <span>CONCERNS</span>
                      <svg className={`${styles.mobileNavChevron} ${mobileDropdown === "concerns" ? styles.mobileNavChevronOpen : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                    {mobileDropdown === "concerns" && (
                      <ul className={styles.mobileDropdownMenu}>
                        {concernsMenuItems.map((item) => (
                          <li key={item.id}>
                            <Link href={`/concerns?subCategory=${item.id}`} className={styles.mobileDropdownLink} onClick={() => setIsMobileMenuOpen(false)}>
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li> */}
                  <li className={styles.mobileNavItem}>
                    <Link href="/men-services" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                      <span>MEN</span>
                      <svg className={styles.mobileNavChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <Link href="/blogs" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                      <span>BLOGS</span>
                      <svg className={styles.mobileNavChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </li> 
                </ul>
              </nav>

              {/* Skin Analysis card */}
              {/* <Link href="/skin-analysis" className={styles.mobileSkinCard} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={styles.mobileSkinCardBg} />
                <div className={styles.mobileSkinCardContent}>
                  <h3 className={styles.mobileSkinCardTitle}>SKIN ANALYSIS</h3>
                  <p className={styles.mobileSkinCardSubtitle}>AI that understands your skin</p>
                  <span className={styles.mobileSkinCardCta}>Analyse now</span>
                </div>
              </Link> */}

              {/* About & Consult */}
              <nav className={styles.mobileNavSecondary}>
                <Link href="/about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                  <span>ABOUT US</span>
                  <svg className={styles.mobileNavChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
                {/* <Link href="/consult-dermat" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                  <span>CONSULT A DERMAT</span>
                  <span className={styles.mobileNavFree}>Free</span>
                  <svg className={styles.mobileNavChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link> */}
              </nav>

              {/* Follow us on */}
              <div className={styles.mobileFollowSection}>
                <p className={styles.mobileFollowTitle}>Follow us on:</p>
                <div className={styles.mobileSocialIcons}>
                  <a href="https://www.instagram.com/siamaskincare/" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialIcon} aria-label="Instagram">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/channel/UCzx2IumMFVltYJcqtyPWqNg" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialIcon} aria-label="YouTube">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61559660877512" target="_blank" rel="noopener noreferrer" className={styles.mobileSocialIcon} aria-label="Facebook">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                </div>
                {/* Mobile Action Buttons */}
                <div className={styles.mobileActionButtons}>
                  <Link
                    href="/cart"
                    className={styles.mobileCartButton}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className={styles.mobileCartButtonIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      {safeGetCartCount() > 0 && (
                        <span className={styles.mobileCartCount}>{safeGetCartCount()}</span>
                      )}
                    </span>
                    <span className={styles.mobileCartButtonLabel}>Cart{safeGetCartCount() > 0 ? ` (${safeGetCartCount()})` : ''}</span>
                  </Link>

                  <button
                    className={styles.mobileEnquiryButton}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsModalOpen(true);
                    }}
                  >
                    Enquiry now
                  </button>
                  {isAuthed ? (
                    <Link
                      href="/account"
                      className={styles.mobileLoginButton}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {shortName.toUpperCase()}
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className={styles.mobileLoginButton}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>

                {/* Experience our mobile app */}
                {/* <div className={styles.mobileAppSection}>
                <p className={styles.mobileFollowTitle}>Experience our mobile app:</p>
                <div className={styles.mobileAppIcons}>
                  <a href="https://apps.apple.com/app/siama" target="_blank" rel="noopener noreferrer" className={styles.mobileAppIcon} aria-label="App Store">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" />
                      <path d="M14 4h4v16h-4" />
                      <path d="M6 4h4v16H6" />
                    </svg>
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=in.siama.app" target="_blank" rel="noopener noreferrer" className={styles.mobileAppIcon} aria-label="Google Play">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </a>
                </div>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} ref={modalRef}>
            <button
              className={styles.modalCloseButton}
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Book Your Consultation</h2>
              <p className={styles.modalSubtitle}>
                Schedule your personalized treatment today
              </p>
            </div>
            <div className={styles.modalBody}>
              <ContactForm onSuccess={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
      <CallButton />
    </header>
  );
}

