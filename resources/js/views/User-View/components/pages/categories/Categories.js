import React, { useMemo } from "react";
import {
    FaArrowRight,
} from "react-icons/fa6";
import { usePlatformAdmin } from "../../../../../context/PlatformAdminContext";
import { getCategoryIcon } from "../../../../../utils/categoryIcons";
import "./Categories.scss";
import categoriesFallback from "./data";

const Categories = () => {
    const { data } = usePlatformAdmin();
    const homeContent = data.homeContent || {};
    const categoriesSection = (data.homeSections || []).find((s) => s.key === "categories");

    const categories = useMemo(() => {
        const raw = (categoriesSection?.items || []).filter((item) => item.isActive !== false);
        if (raw.length === 0) {
            return categoriesFallback.map(({ slug, title, positions, Icon }) => ({
                slug,
                title,
                positions,
                Icon,
            }));
        }
        return raw.map((item) => {
            const slug = item.metadata?.slug || String(item.title || "").toLowerCase().replace(/\s+/g, "-");
            const positions = item.metadata?.positions ?? 0;
            const Icon = getCategoryIcon(item.metadata?.iconKey);
            return {
                slug,
                title: item.title || slug,
                positions,
                Icon,
            };
        });
    }, [categoriesSection]);

    return (
        <section className="category-section" data-aos="slide-up">
            <header className="category-section-header">
                <h2 id="category-section-title" className="category-section-title">
                    {homeContent.categoriesTitle || 'Popular category'}
                </h2>
                <a href="/categories" className="category-section-link">
                    {homeContent.categoriesCta || 'View All'} <FaArrowRight className="category-section-link-icon" aria-hidden />
                </a>
            </header>

            <div className="category-grid">
                {categories.map(({ slug, title, positions, Icon }) => (
                    <a
                        key={slug}
                        href={`/categories/${slug}`}
                        className="category-tile"
                    >
                        <span className="category-tile-icon-box">
                            <Icon className="category-tile-icon" />
                        </span>
                        <span className="category-tile-content">
                            <span className="category-tile-title">{title}</span>
                            <span className="category-tile-count">
                                {positions} Open position
                            </span>
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Categories;
