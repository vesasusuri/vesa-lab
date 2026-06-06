import React, { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePlatformAdmin } from "../../../../../context/PlatformAdminContext";
import { Data as testimonialsFallback } from "./data";
import { ImQuotesLeft } from "react-icons/im";
import "./Testimonal.scss";

const Testimonials = () => {
  const { data } = usePlatformAdmin();
  const section = (data.homeSections || []).find((s) => s.key === "testimonials");

  const slides = useMemo(() => {
    const raw = (section?.items || []).filter((item) => item.isActive !== false);
    if (raw.length === 0) {
      return testimonialsFallback.map((item) => ({
        quote: item.comment.defaultMessage,
        name: item.name,
        location: item.location.defaultMessage,
      }));
    }
    return raw.map((item) => ({
      quote: item.description || '',
      name: item.title || '',
      location: item.subtitle || '',
    }));
  }, [section]);

  const heading = section?.title || 'What our clients say about us';

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="shared-testimonials">
      <h1 data-aos="fade-up">
        {heading}
      </h1>

      <div className="embla" data-aos="slide-up">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((item, index) => (
              <div className="embla__slide" key={index} data-aos="flip-left">
                <div className="slider-item">
                  <div className="bg"></div>

                  <div className="main">
                    <div className="top">
                      <div className="quote">
                        <ImQuotesLeft />
                      </div>
                      <p>{item.quote}</p>
                    </div>

                    <div className="bottom">
                      <div className="line2"></div>
                      <h6>{item.name}</h6>
                      <small>{item.location}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="embla__controls">
          <button
            type="button"
            className="embla__button"
            aria-label="Show previous testimonial"
            onClick={scrollPrev}
          >
            <span aria-hidden="true">‹</span>
          </button>

          <button
            type="button"
            className="embla__button"
            aria-label="Show next testimonial"
            onClick={scrollNext}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
