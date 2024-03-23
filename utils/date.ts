import dayjs from "dayjs";

export enum TimeTick {
    DAILY = 'D',
    WEEKLY = 'W',
    MONTHLY = 'M',
  }

export const formatDate = (time: number | string | undefined, timTick?: TimeTick): string => {
    const now = dayjs()
    const formattedTimeBase = dayjs(time).format('MMM D')
    const formattedTimePlusWeek = dayjs(time).add(1, 'week')
    const formattedTimePlusMonth = dayjs(time).add(1, 'month')
    const formattedTimeDaily = dayjs(time).format('MMM D YYYY')
    const formattedTime = dayjs(time).format('MMM D, YYYY h:mm A')

      if (timTick === TimeTick.WEEKLY) {
        const isCurrent = formattedTimePlusWeek.isAfter(now)
        return formattedTimeBase + '-' + (isCurrent ? 'current' : formattedTimePlusWeek.format('MMM D, YYYY'));
      } else if (timTick === TimeTick.MONTHLY) {
        const isCurrent = formattedTimePlusMonth.isAfter(now)
        return formattedTimeBase + '-' + (isCurrent ? 'current' : formattedTimePlusMonth.format('MMM D, YYYY'));
      } else if (timTick) {
        return formattedTimeDaily;
      } else {
        return time ? formattedTime : '-';
      }
};