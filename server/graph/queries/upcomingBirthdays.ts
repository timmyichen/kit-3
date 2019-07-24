import * as express from 'express';
import { GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import { Friendships, Users } from 'server/models';
import { AuthenticationError } from 'apollo-server';
import { Op } from 'sequelize';
import birthdayUserType from '../types/birthdayUserType';

const pad = (num: number) => (num < 10 ? '0' + num : '' + num);

interface DateRange {
  start: {
    month: number;
    date: number;
  };
  end: {
    month: number;
    date: number;
  };
}

const getDateRanges = (days: number): Array<DateRange> => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  const today = {
    month: d.getMonth(),
    date: d.getDate(),
  };

  d.setDate(today.date + days);

  const ending = {
    month: d.getMonth(),
    date: d.getDate(),
  };

  if (ending.month < today.month) {
    // looped past year
    return [
      { start: today, end: { month: 11, date: 30 } },
      { start: { month: 0, date: 0 }, end: ending },
    ];
  }

  return [{ start: today, end: ending }];
};

const getMonthDateString = (d: Date) =>
  pad(d.getMonth()) + '-' + pad(d.getDate());

export default {
  description: 'Get all users with upcoming birthdays',
  type: new GraphQLNonNull(
    new GraphQLList(new GraphQLNonNull(birthdayUserType)),
  ),
  args: {
    days: { type: GraphQLInt },
  },
  async resolve(
    _1: any,
    { days }: { days?: number },
    { user }: express.Request,
  ) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const ranges = getDateRanges(days || 90);

    const filterRanges = ranges.map(range => ({
      [Op.gt]: new Date(1234, range.start.month, range.start.date),
      [Op.lt]: new Date(1234, range.end.month, range.end.date),
    }));

    const friendships = await Friendships.findAll({
      where: {
        first_user: user.id,
      },
      include: [
        {
          model: Users,
          as: 'friend',
          where: { birthday_date: { [Op.or]: filterRanges } },
        },
      ],
    });

    let friends = friendships.map(f => f.friend);

    // looped around
    if (ranges.length > 1) {
      const now = new Date();

      const map: { [s: string]: Users } = friends.reduce(
        (o, f) => ({
          ...o,
          [f.id]: f,
        }),
        {},
      );

      const birthdays = friends.map(friend => {
        const birthday = new Date(friend.birthday_date);
        const birthdayYear =
          getMonthDateString(birthday) < getMonthDateString(now) ? 1235 : 1234;
        return {
          id: friend.id,
          birthdayString: birthdayYear + '-' + getMonthDateString(birthday),
        };
      });

      birthdays.sort((a, b) => (a.birthdayString > b.birthdayString ? 1 : -1));

      return birthdays.map(b => map[b.id]);
    }

    return friends;
  },
};
