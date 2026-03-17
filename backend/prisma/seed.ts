import { prisma } from "./prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

async function main() {
  console.log("Starting the seeding process...");

  await prisma.user.deleteMany();
  await prisma.conversation.deleteMany();

  const userHashedPassword = await bcrypt.hash("user123", 10);
  const convHashedPassword = await bcrypt.hash("conv123", 10);

  const userPromises = Array.from({ length: 10 }).map(() => {
    const [firstName, lastName] = [
      faker.person.firstName(),
      faker.person.lastName(),
    ];

    return prisma.user.create({
      data: {
        firstName,
        lastName,
        username: faker.internet.username({ firstName, lastName }),
        email: faker.internet.email({ firstName, lastName }),
        profilePicture: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
        credentials: {
          create: {
            provider: "EMAIL_PASSWORD",
            identifier: userHashedPassword,
          },
        },
      },
    });
  });

  const users = await Promise.all(userPromises);

  users.push(
    await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "johndoe@google.com",
        profilePicture: "https://ui-avatars.com/api/?name=John+Doe&background=random",
        credentials: {
          create: {
            provider: "EMAIL_PASSWORD",
            identifier: userHashedPassword,
          },
        },
      },
    }),
  );

  console.log(`Successfully created ${users.length} users`);

  function getRandomUsers() {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * users.length) + 2;
    return shuffled.slice(0, count);
  }

  const conversationPromises = Array.from({ length: 25 }).map(() => {
    const randomUsers = getRandomUsers();

    return prisma.conversation.create({
      data: {
        title: faker.book.title(),
        isPublic: faker.datatype.boolean(),
        ...(faker.datatype.boolean() ? { password: convHashedPassword } : {}),
        users: {
          createMany: {
            data: [
              {
                userId: randomUsers[0].id,
                isOwner: true,
                ...(faker.datatype.boolean()
                  ? { nickname: faker.internet.username() }
                  : {}),
              },
              ...randomUsers.slice(1).map((u) => ({
                userId: u.id,
                ...(faker.datatype.boolean()
                  ? { nickname: faker.internet.username() }
                  : {}),
              })),
            ],
          },
        },
        messages: {
          createMany: {
            data: Array.from({ length: 50 }).map(() => ({
              userId:
                randomUsers[
                  Math.floor(Math.random() * (randomUsers.length - 1))
                ].id,
              content: faker.lorem.sentences(),
            })),
          },
        },
      },
    });
  });

  const conversations = await Promise.all(conversationPromises);
  console.log(`Successfully created ${conversations.length} conversations`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Finished the seeding process");
    await prisma.$disconnect();
  });
