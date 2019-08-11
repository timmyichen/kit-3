import * as React from 'react';
import { Header, List, Image } from 'semantic-ui-react';
import { useUpcomingBirthdaysQuery } from 'generated/generated-types';
import Loader from 'client/components/Loader';
import {
  getDateString,
  getDateDistance,
  getCurrentTimezoneDate,
} from 'client/lib/date';

const BIRTHDAY_RANGE_DAYS = 60;

function UpcomingBirthdays() {
  const { data, loading } = useUpcomingBirthdaysQuery({
    variables: { days: BIRTHDAY_RANGE_DAYS },
  });

  return (
    <div className="upcoming-birthday-wrapper">
      <Header as="h2">Upcoming Birthdays</Header>
      {loading || !data || !data.upcomingBirthdays ? (
        <Loader />
      ) : (
        <List relaxed>
          {data.upcomingBirthdays.map(friend => {
            const birthday = getCurrentTimezoneDate(new Date(friend.birthday));

            const birthdayStr = getDateString(birthday);
            const distance = getDateDistance(birthday);

            return (
              <List.Item>
                <Image avatar src="" />
                <List.Content>
                  <List.Header>{friend.fullName}</List.Header>
                  <List.Description>
                    {birthdayStr} ({distance} days away)
                  </List.Description>
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      )}
      <style jsx>{`
        .upcoming-birthday-wrapper {
          margin-top: 30px;
        }
      `}</style>
    </div>
  );
}

export default UpcomingBirthdays;
