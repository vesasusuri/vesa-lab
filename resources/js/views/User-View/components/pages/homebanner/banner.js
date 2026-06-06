import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { usePlatformAdmin } from "../../../../../context/PlatformAdminContext";
import "./banner.scss";

const Banner = () => {
    const { data } = usePlatformAdmin();
    const homeContent = data.homeContent || {};
    const bannerSection = (data.homeSections || []).find((section) => section.key === "banner");
    const bannerAvatars = (bannerSection?.items || []).filter((item) => item.isActive !== false && item.imageUrl);

    return (
        <section className="banner">
            <div className="banner-grid" />
                <div className="banner-inner" data-aos="slide-up">
                    <div className="banner-main">
                        <div className="proof">
                            <div className="proof-faces">
                                {bannerAvatars.map((item) => (
                                    <img
                                        key={item.id || item.title || item.imageUrl}
                                        src={item.imageUrl}
                                        alt={item.imageAlt || item.title || ""}
                                        className="proof-face"
                                        width={40}
                                        height={40}
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                            <span className="proof-note">{homeContent.proofText || '1k+ student reviews'}</span>
                        </div>

                        <h1 className="banner-headline">
                            {homeContent.heroTitle || 'Build skills. New opportunities.'}
                        </h1>

                        <p className="banner-lede">
                            {homeContent.heroSubtitle || 'Bee Hired helps you discover new job opportunities and move confidently toward your next step.'}
                        </p>

                        <a href="/" className="banner-btn">
                            <span>{homeContent.primaryCta || 'Explore the job market'}</span>
                            <span className="btn-arrow">
                                <FaArrowRight />
                            </span>
                        </a>
                        {homeContent.secondaryCta ? (
                            <p className="banner-lede" style={{ marginTop: "10px", fontSize: "14px" }}>
                                {homeContent.secondaryCta}
                            </p>
                        ) : null}
                    </div>
                </div>
        </section>
    );
};

export default Banner;
