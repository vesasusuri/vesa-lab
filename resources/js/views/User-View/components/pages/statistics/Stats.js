import React, { useEffect, useState } from "react";
import bg from "../../../assets/home/images.jpeg";
import "./stats.scss";

const items = [
    { num: 82, text: "Companies Joined" },
    { num: 15, text: "Qualified Staff" },
    { num: 55, text: "People Employed" },
    { num: 3, text: "Years of Experience" },
];

const Stats = () => {
    const [counts, setCounts] = useState(items.map(() => 0));

    useEffect(() => {
        const duration = 1400;
        const start = performance.now();

        let frameId = 0;

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);

            setCounts(items.map((item) => Math.round(item.num * progress)));

            if (progress < 1) {
                frameId = window.requestAnimationFrame(tick);
            }
        };

        frameId = window.requestAnimationFrame(tick);

        return () => window.cancelAnimationFrame(frameId);
    }, []);

    return (
        <section className="stats">
            <div
                className="stats__shade"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="stats__overlay">
                    <div className="stats__row">
                    {items.map((item, index) => (
                        <div className="box" key={item.text}>
                            <h3 className="num">{counts[index]}</h3>
                            <p className="txt">{item.text}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
