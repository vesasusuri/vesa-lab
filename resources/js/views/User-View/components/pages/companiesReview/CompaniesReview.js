import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaStar } from 'react-icons/fa6';
import { ImQuotesLeft } from 'react-icons/im';
import './CompaniesReview.scss';

const CompaniesReview = ({ reviews = [] }) => {
  const shouldLoop = reviews.length > 2;

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({loop: shouldLoop, align: 'start',skipSnaps: false,});

  const updateControls = useCallback((api) => { setCanScrollPrev(api.canScrollPrev()); setCanScrollNext(api.canScrollNext());}, []);

  const scrollPrev = useCallback(() => {if (!emblaApi) return; emblaApi.scrollPrev();}, [emblaApi]);

  const scrollNext = useCallback(() => {if (!emblaApi) return; emblaApi.scrollNext();}, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    updateControls(emblaApi);
    emblaApi.on('select', updateControls);
    emblaApi.on('reInit', updateControls);

    return () => {
      emblaApi.off('select', updateControls);
      emblaApi.off('reInit', updateControls);
    };
  }, [emblaApi, updateControls]);

  if (!reviews.length) return null;

  return (
    <div className="company-reviews-carousel">
      <h1 data-aos="fade-up">People Reviews</h1>

      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container" data-aos="fade-up">
            {reviews.map((item, index) => (
              <div className="embla__slide" key={item.id ?? index}>
                <div className="slider-item">
                  <div className="bg" />

                  <div className="main">
                    <div className="top">
                      <div className="quote">
                        <ImQuotesLeft />
                      </div>
                      <p>{item.comment}</p>

                      <div className="review-stars" aria-label={`${item.rating} star rating`}>
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <FaStar key={`${item.id}-${i}`} />
                        ))}
                      </div>
                    </div>

                    <div className="bottom">
                      <div className="line2" />
                      <h6>{item.author}</h6>
                      <small>{item.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="embla__controls">
          <button type="button" className="embla__button" aria-label="Show previous review" onClick={scrollPrev} disabled={!shouldLoop && !canScrollPrev}>
            <span aria-hidden="true">‹</span>
          </button>

          <button
            type="button"  className="embla__button" aria-label="Show next review" onClick={scrollNext} disabled={!shouldLoop && !canScrollNext}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompaniesReview;