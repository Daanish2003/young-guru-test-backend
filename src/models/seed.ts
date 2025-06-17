import { prisma } from "./client";


async function seedDB() {
  await prisma.course.createMany({
    data: [
      {
        title: 'Course 1: JavaScript Basics',
        video_url: 'https://example.com/video1.mp4',
        is_locked: true,
      },
      {
        title: 'Course 2: Advanced React',
        video_url: 'https://example.com/video2.mp4',
        is_locked: true,
      },
      {
        title: 'Course 3: Fullstack with Node.js',
        video_url: 'https://example.com/video3.mp4',
        is_locked: true,
      },
    ],
  });

  console.log('✅ Seeded courses!');
}

seedDB()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
