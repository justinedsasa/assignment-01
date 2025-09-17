const express = require("express");
const { faker } = require("@faker-js/faker");

const app = express();
const PORT = 3000;

function generateUser() {
  return {
    gender: faker.person.sex(),
    name: {
      title: faker.person.prefix(),
      first: faker.person.firstName(),
      last: faker.person.lastName(),
    },
    email: faker.internet.email(),
    phone: faker.phone.number(),
    dob: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
    picture: faker.image.avatar(),
    location: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      postcode: faker.location.zipCode(),
    },
  };
}

app.get("/api", (req, res) => {
  const results = parseInt(req.query.results) || 1;
  const users = Array.from({ length: results }, generateUser);
  res.json({ results: users });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/api`);
});
