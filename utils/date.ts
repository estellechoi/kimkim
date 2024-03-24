import { Languages } from "@/constants/app";
import dayjs from "dayjs";

export enum TimeTick {
    TIME = 'T',
    DAILY = 'D',
    WEEKLY = 'W',
    MONTHLY = 'M',
}

const TIME_FORMAT_DICT: Record<Languages, string> = {
  [Languages.EN]: 'MMM D, YYYY',
  [Languages.KR]: 'YYYY년 M월 D일',
}

export const formatDate = (time: number | string | undefined, timTick?: TimeTick, lang?: Languages): string => {
    const format = TIME_FORMAT_DICT[lang ?? Languages.EN];

    const now = dayjs()
    const formattedTimeBase = dayjs(time).format(format)
    const formattedTimePlusWeek = dayjs(time).add(1, 'week')
    const formattedTimePlusMonth = dayjs(time).add(1, 'month')
    const formattedTimeDaily = dayjs(time).format(format)
    const formattedTime = dayjs(time).format(`${format} h:mm A`)

      if (timTick === TimeTick.WEEKLY) {
        const isCurrent = formattedTimePlusWeek.isAfter(now)
        return formattedTimeBase + '-' + (isCurrent ? 'current' : formattedTimePlusWeek.format(format));
      } else if (timTick === TimeTick.MONTHLY) {
        const isCurrent = formattedTimePlusMonth.isAfter(now)
        return formattedTimeBase + '-' + (isCurrent ? 'current' : formattedTimePlusMonth.format(format));
      } else if (timTick === TimeTick.DAILY) {
        return formattedTimeDaily;
      } else {
        return time ? formattedTime : '-';
      }
};