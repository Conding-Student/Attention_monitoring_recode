export function generateMeetingCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function getRandomLetter() {
    const randomNumber = Math.random() * letters.length;
    const wholeNumber = Math.floor(randomNumber);
    const letter = letters[wholeNumber];

    return letter;
  }

  const randomMeetingNumber = Math.floor(Math.random() * 9000) + 1000;

  const firstLetter = getRandomLetter();
  const secondLetter = getRandomLetter();
  const thirdLetter = getRandomLetter();
  const lastLetter = getRandomLetter();

  const meetingCode = firstLetter + secondLetter + thirdLetter + "-" + randomMeetingNumber + "-" + lastLetter;

  return meetingCode;
}
