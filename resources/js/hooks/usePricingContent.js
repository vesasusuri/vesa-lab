import { useEffect, useState } from 'react';

const cache = { hero: null, plans: null };

const usePricingContent = () => {
    const [hero, setHero]       = useState(cache.hero);
    const [plans, setPlans]     = useState(cache.plans);
    const [loading, setLoading] = useState(!cache.hero || !cache.plans);

    useEffect(() => {
        const promises = [];

        if (!cache.hero) {
            promises.push(
                fetch('/api/home-page-content')
                    .then(r => r.json())
                    .then(payload => {
                        cache.hero = payload?.pageContent?.pricing || {};
                        setHero(cache.hero);
                    })
                    .catch(() => { cache.hero = {}; })
            );
        }

        if (!cache.plans) {
            promises.push(
                fetch('/api/pricing-plans')
                    .then(r => r.json())
                    .then(data => {
                        cache.plans = data;
                        setPlans(data);
                    })
                    .catch(() => { cache.plans = []; })
            );
        }

        if (promises.length > 0) {
            Promise.all(promises).then(() => setLoading(false));
        }
    }, []);

    return { hero: hero || {}, plans: plans || [], loading };
};

export default usePricingContent;
