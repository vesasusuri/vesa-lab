import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const FALLBACK = FaLinkedinIn;

export const footerSocialIconMap = {
  FaLinkedinIn,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
};

export const getFooterSocialIcon = (iconKey) => footerSocialIconMap[iconKey] || FALLBACK;
