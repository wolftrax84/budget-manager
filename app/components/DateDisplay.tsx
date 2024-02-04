import { DateTime } from "luxon";

export default function DateDisplay({date}:{date: DateTime}) {
    return date.toLocaleString(DateTime.DATE_SHORT)
}