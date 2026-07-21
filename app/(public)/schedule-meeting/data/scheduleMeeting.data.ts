// app/(public)/schedule-meeting/data/scheduleMeeting.data.ts

export const durationOptions = [
	{
		label: "15 minutes",
		value: "15",
	},
	{
		label: "30 minutes",
		value: "30",
	},
	{
		label: "45 minutes",
		value: "45",
	},
	{
		label: "1 hour",
		value: "60",
	},
	{
		label: "1 hour 30 minutes",
		value: "90",
	},
	{
		label: "2 hours",
		value: "120",
	},
] as const;