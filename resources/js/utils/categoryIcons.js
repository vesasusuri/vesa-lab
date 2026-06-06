import {
  FaPenNib,
  FaCode,
  FaBullhorn,
  FaCirclePlay,
  FaMusic,
  FaChartColumn,
  FaBriefcaseMedical,
  FaDatabase,
} from 'react-icons/fa6';

const FALLBACK = FaCode;

export const categoryIconMap = {
  FaPenNib,
  FaCode,
  FaBullhorn,
  FaCirclePlay,
  FaMusic,
  FaChartColumn,
  FaBriefcaseMedical,
  FaDatabase,
};

export const getCategoryIcon = (iconKey) => categoryIconMap[iconKey] || FALLBACK;

export const CATEGORY_ICON_OPTIONS = Object.keys(categoryIconMap);
