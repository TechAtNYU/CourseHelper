interface CourseProps {
  courseCode: string;
  title: string;
  timeStart: string;
  timeEnd: string;
  instructor: string;
}

const Course = ({
  courseCode,
  title,
  timeStart,
  timeEnd,
  instructor,
}: CourseProps) => {
  return (
    <div className="plasmo-flex plasmo-flex-row plasmo-items-center plasmo-justify-between plasmo-gap-2 plasmo-text-md plasmo-font-medium plasmo-rounded-md plasmo-p-2 plasmo-bg-gray-50">
      <div className="plasmo-flex plasmo-flex-col">
        <span className="plasmo-font-normal">{courseCode}</span>
        <span className="plasmo-font-semibold">{title}</span>
      </div>
      <div>Details</div>
    </div>
  );
};

export default Course;
