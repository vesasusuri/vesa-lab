import React, { useEffect, useState } from "react";
import "./aboutTeam.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { RiArrowRightSFill } from "react-icons/ri";
import yellowBG from "../../../assets/home/yellowBG.png";

const AboutTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team-members")
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !members.length) return null;

  return (
    <div className="shared-top-academy-teachers" data-aos="fade-up">
      <Tabs>
        <TabList>
          {members.map((item, index) => (
            <Tab key={index}>
              <div className="line" />
              <div className="img-container">
                {item.img && <img src={item.img} alt="" className="img" />}
              </div>
              <RiArrowRightSFill className="arrow" />
            </Tab>
          ))}
        </TabList>

        <div className="tab-panel">
          {members.map((item, index) => (
            <TabPanel key={index}>
              <div className="inner-tab-panel flex-box">
                <div className="images">
                  <img src={yellowBG} alt="" className="bg" />
                  <div className="circle" />
                  <div className="profile-container">
                    <div className="info">
                      {item.img && (
                        <img src={item.img} alt={item.name} className="profile" />
                      )}
                      <h6>{item.name}</h6>
                      <p>{item.occupation}</p>
                    </div>
                  </div>
                </div>

                <div className="right-content">
                  <div className="inline inline1">
                    <div className="block">
                      <h6>{item.name}</h6>
                      <p>{item.occupation}</p>
                    </div>
                  </div>
                  <div className="bio">
                    <h5 className="uppercase">About</h5>
                    <br />
                    <p>{item.bio}</p>
                  </div>
                </div>
              </div>
            </TabPanel>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default AboutTeam;