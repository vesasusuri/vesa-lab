import React from "react";
import "./Carusel.scss";
import { usePlatformAdmin } from "../../../../../context/PlatformAdminContext";
  
const Carusel = () => {
    const { data } = usePlatformAdmin();
    const trustedBySection = (data.homeSections || []).find((section) => section.key === "trusted_by");
    const logos = (trustedBySection?.items || []).filter((item) => item.isActive !== false && item.imageUrl);

    return (
        <div data-aos="slide-up">
            <div className="trusted-by" >
                <h2 className="trusted-by-text">{trustedBySection?.title || "Trusted By:"}</h2>
                <div className="underline"></div>
            </div>
            <div className="slider">
                <div className="slide-track">
                {[...logos, ...logos].map((logo, index) => (
                    <div className="slide" key={index}>
                    <img
                        src={logo.imageUrl}
                        alt={logo.imageAlt || logo.title || "Trusted company"}
                        style={{
                            width: `${logo?.metadata?.width || 130}px`,
                            height: `${logo?.metadata?.height || 100}px`,
                        }}
                    />
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default Carusel;
