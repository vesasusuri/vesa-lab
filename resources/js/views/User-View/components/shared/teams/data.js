import { FormattedMessage } from "react-intl";

import img1 from "../../../assets/home/img1.png";
import img2 from "../../../assets/home/img2.png";
import img3 from "../../../assets/home/img3.png";
import img4 from "../../../assets/home/img4.png";

import yellowBG from "../../../assets/home/yellowBG.png";

export const TabData = [
  { img: img1 },
  { img: img2 },
  { img: img3 },
  { img: img4 },
];

export const PanelData = [
  {
    img: img1,
    name: "Vesa Susuri",
    occupation: (
      <FormattedMessage
        id="lead-developer"
        defaultMessage="Lead Developer"
      />
    ),
    bg: yellowBG,
    bio: (
      <FormattedMessage
        id="lead-developer-bio"
        defaultMessage="Leads the development team by managing tasks, reviewing progress, and ensuring the project is delivered successfully. Focused on clean architecture, teamwork, and building scalable solutions."
      />
    ),
    reviews: [],
    to1: "/",
  },
  {
    img: img3,
    name: "Rige Qerimi",
    occupation: (
      <FormattedMessage
        id="product-owner-developer"
        defaultMessage="Product Owner & Developer"
      />
    ),
    bg: yellowBG,
    bio: (
      <FormattedMessage
        id="product-owner-developer-bio"
        defaultMessage="Bridges business ideas with technical execution by defining product goals, managing priorities, and contributing to development. Focused on delivering value and improving user experience."
      />
    ),
    reviews: [],
    to1: "/",
  },
  {
    img: img2,
    name: "Denisa Gjuraj",
    occupation: (
      <FormattedMessage
        id="full-stack-developer"
        defaultMessage="Full Stack Developer"
      />
    ),
    bg: yellowBG,
    bio: (
      <FormattedMessage
        id="full-stack-developer-bio"
        defaultMessage="Works across both frontend and backend systems, building responsive interfaces and reliable server-side features. Skilled in connecting databases, APIs, and user experiences together."
      />
    ),
    reviews: [],
    to1: "/",
  },
  {
    img: img4,
    name: "Migjen Prenaj",
    occupation: (
      <FormattedMessage
        id="backend-developer"
        defaultMessage="Back End Developer"
      />
    ),
    bg: yellowBG,
    bio: (
      <FormattedMessage
        id="backend-developer-bio"
        defaultMessage="Builds secure and efficient backend systems, APIs, and database structures that power the platform. Focused on performance, logic, and maintaining reliable application infrastructure."
      />
    ),
    reviews: [],
    to1: "/",
  },
];