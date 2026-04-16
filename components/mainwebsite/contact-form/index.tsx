"use client";

import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { submitLead, type LeadSubmissionPayload } from "@/utils/api/public";
import { useAuth } from "@/contexts/AuthContext";

interface ContactFormProps {
  footer?: boolean;
  onSuccess?: () => void; // Callback when form is successfully submitted
}

interface FormErrors {
  fullName?: string;
  contactNumber?: string;
  gender?: string;
}

export default function ContactForm({ footer = false, onSuccess }: ContactFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    gender: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  // Prefill from logged-in user (without clobbering user edits once typed)
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      fullName: prev.fullName || user.name || "",
      contactNumber: prev.contactNumber || user.phone || "",
      gender: prev.gender || (user.gender || ""),
    }));
  }, [user]);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  // Validation functions
  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Full name is required";
    }
    if (name.trim().length < 2) {
      return "Full name must be at least 2 characters";
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Full name should only contain letters and spaces";
    }
    return undefined;
  };

  const validateContactNumber = (number: string): string | undefined => {
    if (!number.trim()) {
      return "Contact number is required";
    }
    // Remove spaces, dashes, and plus signs for validation
    const cleaned = number.replace(/[\s\-+()]/g, "");
    if (!/^\d+$/.test(cleaned)) {
      return "Contact number should only contain digits";
    }
    if (cleaned.length < 10) {
      return "Contact number must be at least 10 digits";
    }
    if (cleaned.length > 15) {
      return "Contact number is too long";
    }
    return undefined;
  };

  const validateGender = (gender: string): string | undefined => {
    // Gender is optional, no validation needed
    return undefined;
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "fullName":
        return validateFullName(value);
      case "contactNumber":
        return validateContactNumber(value);
      case "gender":
        return validateGender(value);
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate on blur
    const error = validateField(name, value);
    if (error) {
      setErrors({
        ...errors,
        [name]: error,
      });
    } else {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      gender: e.target.value,
    });

    // Clear gender error when selected
    if (errors.gender) {
      setErrors({
        ...errors,
        gender: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const contactNumberError = validateContactNumber(formData.contactNumber);
    if (contactNumberError) newErrors.contactNumber = contactNumberError;

    const genderError = validateGender(formData.gender);
    if (genderError) newErrors.gender = genderError;

    setErrors(newErrors);
    setTouched({
      fullName: true,
      contactNumber: true,
      gender: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields only
    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare payload - only include fields that have values
      const payload: LeadSubmissionPayload = {
        name: formData.fullName.trim(),
        number: formData.contactNumber.trim(),
      };

      // Add optional fields only if they have values
      if (formData.gender.trim()) {
        payload.gender = formData.gender.trim();
      }

      // Submit to API
      const response = await submitLead(payload);

      if (response.status === 'success') {
        setIsSubmitting(false);
        setSubmitStatus("success");
        setFormData({ fullName: "", contactNumber: "", gender: "" });
        setErrors({});
        setTouched({});
        
        // Call onSuccess callback if provided (e.g., to close modal)
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 3000); // Show message for 3 seconds before closing
        } else {
          setTimeout(() => {
            setSubmitStatus(null);
          }, 5000); // Show message for 5 seconds if not in modal
        }
      } else {
        setIsSubmitting(false);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setSubmitStatus("error");
    }
  };

  return (
    <div className={styles.contactFormWrapper}>
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName" className={styles.label}>
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${
              touched.fullName && errors.fullName ? styles.inputError : ""
            }`}
            placeholder="Enter your full name"
            required
          />
          {touched.fullName && errors.fullName && (
            <span className={styles.errorMessage}>{errors.fullName}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contactNumber" className={styles.label}>
            Contact Number <span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${
              touched.contactNumber && errors.contactNumber ? styles.inputError : ""
            }`}
            placeholder="Enter your 10-digit phone number"
            required
          />
          {touched.contactNumber && errors.contactNumber && (
            <span className={styles.errorMessage}>{errors.contactNumber}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Gender
          </label>
          <div className={styles.radioGroup}>
            <label
              className={`${styles.radioLabel} ${
                formData.gender === "male" ? styles.radioLabelChecked : ""
              }`}
            >
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleGenderChange}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>Male</span>
            </label>
            <label
              className={`${styles.radioLabel} ${
                formData.gender === "female" ? styles.radioLabelChecked : ""
              }`}
            >
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleGenderChange}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>Female</span>
            </label>
            <label
              className={`${styles.radioLabel} ${
                formData.gender === "other" ? styles.radioLabelChecked : ""
              }`}
            >
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleGenderChange}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>Other</span>
            </label>
          </div>
          {touched.gender && errors.gender && (
            <span className={styles.errorMessage}>{errors.gender}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </button>

        <p className={styles.disclaimer}>
          By submitting this form, you agree to our privacy policy and terms of
          service.
        </p>

        {submitStatus === "success" && (
          <div className={styles.successMessage}>
            Your enquiry is submitted. Our team will contact you shortly.
          </div>
        )}

        {submitStatus === "error" && (
          <div className={styles.submitErrorMessage}>
            {Object.keys(errors).length > 0
              ? "Please fix the errors above before submitting."
              : "Something went wrong. Please try again."}
          </div>
        )}
      </form>
    </div>
  );
}

