const oldArr = [
  "Flash Sale Going On Till 5th January!",
  "Discount up to 35% for first purchase only this month.",
  "Free Shipping! First in Town.",
  "Exclusive prices only for the month",
  "Black Friday Coming. Hurry Up!",
  "Best offers every week! 40% Off!",
];

const newArr = oldArr.map((notification) => {
  return { notification, createdAt: new Date() };
});

console.log(JSON.stringify(newArr));
