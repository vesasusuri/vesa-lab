import { FormattedMessage } from "react-intl";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";

export const SocialMedia = [
  {
    to: "/",
    icon: <FaLinkedinIn />
  },
  {
    to: "/",
    icon: <FaTwitter />
  },
  {
    to: "/",
    icon: <FaFacebookF />
  },
  {
    to: "/",
    icon: <FaInstagram />
  }
];

export const FooterData = [
  {
    category: (
      <FormattedMessage id="company" defaultMessage="Company" />
    ),
    links: [
      {
        link: (
          <FormattedMessage id="about-us" defaultMessage="About Us" />
        ),
        to: "/about"
      },
      {
        link: (
          <FormattedMessage id="careers" defaultMessage="Careers" />
        ),
        to: "/careers"
      },
      {
        link: (
          <FormattedMessage id="press" defaultMessage="Press" />
        ),
        to: "/press"
      },
      {
        link: (
          <FormattedMessage id="blog" defaultMessage="Blog" />
        ),
        to: "/blog"
      }
    ]
  },
  {
    category: (
      <FormattedMessage id="for-candidates" defaultMessage="For Candidates" />
    ),
    links: [
      {
        link: (
          <FormattedMessage id="browse-jobs" defaultMessage="Browse Jobs" />
        ),
        to: "/jobs"
      },
      {
        link: (
          <FormattedMessage id="create-profile" defaultMessage="Create Profile" />
        ),
        to: "/profile"
      },
      {
        link: (
          <FormattedMessage id="career-advice" defaultMessage="Career Advice" />
        ),
        to: "/career-advice"
      },
      {
        link: (
          <FormattedMessage id="job-alerts" defaultMessage="Job Alerts" />
        ),
        to: "/job-alerts"
      }
    ]
  },
  {
    category: (
      <FormattedMessage id="for-employers" defaultMessage="For Employers" />
    ),
    links: [
      {
        link: (
          <FormattedMessage id="post-job" defaultMessage="Post a Job" />
        ),
        to: "/post-job"
      },
      {
        link: (
          <FormattedMessage id="search-candidates" defaultMessage="Search Candidates" />
        ),
        to: "/candidates"
      },
      {
        link: (
          <FormattedMessage id="pricing" defaultMessage="Pricing" />
        ),
        to: "/pricing"
      },
      {
        link: (
          <FormattedMessage id="recruitment-solutions" defaultMessage="Recruitment Solutions" />
        ),
        to: "/solutions"
      }
    ]
  },
  {
    category: (
      <FormattedMessage id="support" defaultMessage="Support" />
    ),
    links: [
      {
        link: (
          <FormattedMessage id="help-center" defaultMessage="Help Center" />
        ),
        to: "/help"
      },
      {
        link: (
          <FormattedMessage id="contact-us" defaultMessage="Contact Us" />
        ),
        to: "/contact"
      },
      {
        link: (
          <FormattedMessage id="faq" defaultMessage="FAQ" />
        ),
        to: "/faq"
      }
    ]
  },
  {
    category: (
      <FormattedMessage id="legal" defaultMessage="Legal" />
    ),
    links: [
      {
        link: (
          <FormattedMessage id="privacy-policy" defaultMessage="Privacy Policy" />
        ),
        to: "/privacy"
      },
      {
        link: (
          <FormattedMessage id="terms-of-use" defaultMessage="Terms of Use" />
        ),
        to: "/terms"
      },
      {
        link: (
          <FormattedMessage id="cookie-policy" defaultMessage="Cookie Policy" />
        ),
        to: "/cookies"
      },
      {
        link: (
          <FormattedMessage id="security" defaultMessage="Security" />
        ),
        to: "/security"
      }
    ]
  }
];