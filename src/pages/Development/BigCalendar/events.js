const now = new Date()

export const dndEvents = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2019, 5, 29, 9, 0, 0),
    end: new Date(2019, 5, 29, 13, 0, 0),
    resourceId: 1,
  },
  {
    id: 1,
    title: 'MS training',
    start: new Date(2019, 5, 29, 14, 0, 0),
    end: new Date(2019, 5, 29, 16, 30, 0),
    resourceId: 2,
  },
  {
    id: 2,
    title: 'Team lead meeting',
    start: new Date(2019, 5, 29, 8, 30, 0),
    end: new Date(2019, 5, 29, 12, 30, 0),
    resourceId: 3,
  },
  {
    id: 10,
    title: 'Board meeting',
    start: new Date(2019, 5, 30, 23, 0, 0),
    end: new Date(2019, 5, 30, 23, 59, 0),
    resourceId: 1,
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2019, 5, 30, 7, 0, 0),
    end: new Date(2019, 5, 30, 10, 30, 0),
    resourceId: 4,
  },
  {
    id: 12,
    title: 'Board meeting',
    start: new Date(2019, 5, 29, 23, 59, 0),
    end: new Date(2019, 5, 30, 13, 0, 0),
    resourceId: 1,
  },
  {
    id: 13,
    title: 'Board meeting',
    start: new Date(2019, 5, 29, 23, 50, 0),
    end: new Date(2019, 5, 30, 13, 0, 0),
    resourceId: 2,
  },
  {
    id: 14,
    title: 'Board meeting',
    start: new Date(2019, 5, 29, 23, 40, 0),
    end: new Date(2019, 5, 30, 13, 0, 0),
    resourceId: 4,
  },
]

export default [
  {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2019, 3, 0),
    end: new Date(2019, 3, 1),
  },
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2019, 3, 7),
    end: new Date(2019, 3, 10),
  },

  {
    id: 2,
    title: 'DTS STARTS',
    start: new Date(2016, 2, 13, 0, 0, 0),
    end: new Date(2016, 2, 20, 0, 0, 0),
  },

  {
    id: 3,
    title: 'DTS ENDS',
    start: new Date(2016, 10, 6, 0, 0, 0),
    end: new Date(2016, 10, 13, 0, 0, 0),
  },

  {
    id: 4,
    title: 'Some Event',
    start: new Date(2019, 3, 9, 0, 0, 0),
    end: new Date(2019, 3, 10, 0, 0, 0),
  },
  {
    id: 5,
    title: 'Conference',
    start: new Date(2019, 6, 11),
    end: new Date(2019, 6, 13),
    desc: 'Big conference for important people',
  },
  {
    id: 6,
    title: 'Meeting',
    start: new Date(2019, 6, 12, 10, 30, 0, 0),
    end: new Date(2019, 6, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting',
  },
  {
    id: 7,
    title: 'Lunch',
    start: new Date(2019, 6, 12, 12, 0, 0, 0),
    end: new Date(2019, 6, 12, 13, 0, 0, 0),
    desc: 'Power lunch',
  },
  {
    id: 8,
    title: 'Meeting',
    start: new Date(2019, 6, 12, 14, 0, 0, 0),
    end: new Date(2019, 6, 12, 15, 0, 0, 0),
  },
  {
    id: 9,
    title: 'Happy Hour',
    start: new Date(2019, 6, 12, 17, 0, 0, 0),
    end: new Date(2019, 6, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day',
  },
  {
    id: 10,
    title: 'Dinner',
    start: new Date(2019, 6, 12, 20, 0, 0, 0),
    end: new Date(2019, 6, 12, 21, 0, 0, 0),
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2019, 6, 13, 7, 0, 0),
    end: new Date(2019, 6, 13, 10, 30, 0),
  },
  {
    id: 12,
    title: 'Late Night Event',
    start: new Date(2019, 6, 17, 19, 30, 0),
    end: new Date(2019, 6, 18, 2, 0, 0),
  },
  {
    id: 12.5,
    title: 'Late Same Night Event',
    start: new Date(2019, 6, 17, 19, 30, 0),
    end: new Date(2019, 6, 17, 23, 30, 0),
  },
  {
    id: 13,
    title: 'Multi-day Event',
    start: new Date(2019, 6, 20, 19, 30, 0),
    end: new Date(2019, 6, 22, 2, 0, 0),
  },
  {
    id: 14,
    title: 'Today',
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 15,
    title: 'Point in Time Event',
    start: now,
    end: now,
  },
]
