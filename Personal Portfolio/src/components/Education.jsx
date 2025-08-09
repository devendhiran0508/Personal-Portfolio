

import { Timeline } from "./TimeLine";

const Education = () => {
  const data = [
    {
      title: "Bachelor's Degree",
      time: "2024 - Present",
      content: (
        <p>
          Currently pursuing a Bachelor of Engineering in Computer Engineering at Madras Institute of Technology, Anna University, Chennai, 
          with a strong focus on advanced computer science concepts, software engineering principles, machine learning, and emerging technologies. 
          Actively engaging in academic projects and practical applications to build expertise in solving real-world technological challenges.
        </p>
      ),
    },
    {
      title: "Diploma in Computer Engineering",
      time: "2021 - 2024",
      content: (
        <p>
          Successfully completed a Diploma in Computer Engineering from Government Polytechnic College, Krishnagiri, 
          gaining comprehensive knowledge of programming languages, database management, web development, and software engineering practices. 
          Developed a strong foundation in both theoretical concepts and practical applications through hands-on projects and coursework.
        </p>
      ),
    },
    {
      title: "Secondary School Certificate (SSLC)",
      time: "2019 - 2020",
      content: (
        <p>
         Completed the Secondary School Leaving Certificate (SSLC) at Gopi Krishna Matriculation Higher Secondary School, Kaveripattinam, 
         demonstrating strong academic performance,
         which provided a solid foundation for further technical education and career development.
        </p>
      ),
    },
  ];

  return <Timeline data={data} />;
};

export default Education;