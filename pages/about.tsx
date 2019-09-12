import * as React from 'react';
import { Header, Image } from 'semantic-ui-react';
import { headerHeight } from 'client/lib/pageMeasurements';
import Meta from 'client/components/Meta';

export default () => (
  <div className="about-wrapper">
    <Meta title="About" />
    <div className="what-is-kit">
      <div className="overlay" />
      <Header as="h1">What is KIT?</Header>
      <div className="text-content">
        <p>
          The idea behind Keep in Touch (KIT) was born when Tim and Shirley were
          in college. Being college students, we moved addresses every year, and
          it was difficult keeping track of who lived where so we could send
          each other post mail. We built what we wish we had.
        </p>
        <p>
          The way to use KIT is simple. Share your address or other contact info
          with your friends, then update it when it changes. Your friends will
          always have access to your latest deets. You'll also be able to get an
          advance notice of an upcoming friend's birthday, so you can prepare
          something special for them or write them a nice card.
        </p>
        <p>
          We believe that sending and receiving post mail is underrated in
          today's world of instanct communication. Tim and Shirley keep each and
          every letter they receive from friends, and reading back on them
          creates good feels that are incomparable to reading old chat logs.
          This is the feeling we want everyone to experience, and they can last
          a lifetime.
        </p>
      </div>
    </div>
    <div className="privacy">
      <div className="overlay" />
      <Header as="h1">Privacy</Header>
      <div className="text-content">
        <p>
          We understand that you might be skeptical of putting your contact
          information online. Rest assured that we will never sell your data and
          have no interest in doing so, and we never store your data longer than
          you want us to. Once you delete something from our servers, it's gone
          for good; we don't soft-delete anything except for your user accounts
          (those get perma-deleted 15 days after deletion).
        </p>
      </div>
    </div>
    <div className="team">
      <div className="overlay" />
      <Header as="h1">The Team</Header>
      <div className="team-members">
        <div className="team-member">
          <Image src="/images/marketing/tim.jpg" size="medium" circular />
          <div className="label">Tim</div>
        </div>
        <div className="team-member">
          <Image src="/images/marketing/shirley.jpg" size="medium" circular />
          <div className="label">Shirley</div>
        </div>
      </div>
    </div>
    <style jsx>{`
      .about-wrapper :global(h1) {
        color: #fff;
        font-size: 60px;
        text-align: center;
        z-index: 1;
      }
      .text-content {
        color: #fff;
        font-size: 20px;
        z-index: 1;
        padding: 20px 40px;
      }
      .what-is-kit {
        background: url('/images/marketing/foreign-letters.jpg') no-repeat
          center center fixed;
        min-height: calc(100vh - ${headerHeight}px);
      }
      .privacy {
        background: url('/images/marketing/building.jpg') no-repeat center
          center fixed;
        min-height: 100vh;
      }
      .team {
        background: url('/images/marketing/pencils.jpg') no-repeat center center
          fixed;
        min-height: 100vh;
      }
      .what-is-kit,
      .privacy,
      .team {
        position: relative;
        display: flex;
        background-size: cover;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: hsla(0, 0%, 0%, 0.75);
      }
      .team-members {
        margin-top: 100px;
        display: flex;
        justify-content: space-around;
        width: 100%;
      }
      .team-member {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 30px;
        color: #fff;
        z-index: 1;
      }
      .team-member .label {
        margin-top: 40px;
      }
    `}</style>
  </div>
);
