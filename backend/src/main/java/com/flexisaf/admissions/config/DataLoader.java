package com.flexisaf.admissions.config;

import com.flexisaf.admissions.entity.*;
import com.flexisaf.admissions.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final ExamRepository examRepository;
    private final PaymentRepository paymentRepository;
    private final AnnouncementRepository announcementRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Load sample data only if tables are empty
        if (courseRepository.count() == 0) {
            loadCourses();
        }

        if (examRepository.count() == 0 && courseRepository.count() > 0) {
            loadExams();
        }

        // Disabled: We want only real students from actual admissions, not sample data
        // if (studentRepository.count() == 0) {
        //     loadStudents();
        // }

        // Disabled: We want only real payments from actual transactions, not sample data
        // if (paymentRepository.count() == 0) {
        //     loadPayments();
        // }

        if (announcementRepository.count() == 0) {
            loadAnnouncements();
        }
    }

    private void loadCourses() {
        String[] programs = {
            "BSc Computer Science",
            "BSc Information Technology",
            "BSc Software Engineering",
            "BSc Data Science",
            "BSc Cybersecurity",
            "BSc Business Administration",
            "BSc Accounting",
            "BSc Economics",
            "BSc Mathematics",
            "BSc Physics"
        };

        String[][] coursesByProgram = {
            // CS Courses
            {"CSC101", "Introduction to Programming", "Dr. Adams"},
            {"CSC201", "Data Structures", "Prof. Wilson"},
            {"CSC301", "Algorithms", "Dr. Thompson"},
            {"CSC401", "Artificial Intelligence", "Prof. Martinez"},
            // IT Courses
            {"IT101", "Database Systems", "Dr. Johnson"},
            {"IT201", "Network Administration", "Prof. Lee"},
            {"IT301", "Cloud Computing", "Dr. Garcia"},
            {"IT401", "IT Project Management", "Prof. Chen"},
            // SE Courses
            {"SE101", "Software Design", "Dr. Brown"},
            {"SE201", "Agile Development", "Prof. Davis"}
        };

        for (int i = 0; i < Math.min(100, programs.length * 10); i++) {
            int programIndex = i % programs.length;
            int courseIndex = i % coursesByProgram.length;

            Course course = new Course();
            course.setCode(coursesByProgram[courseIndex][0] + "-" + i);
            course.setName(coursesByProgram[courseIndex][1]);
            course.setCredits(3);
            course.setInstructor(coursesByProgram[courseIndex][2]);
            course.setSchedule("Mon/Wed 10:00-11:30");
            course.setProgram(programs[programIndex]);
            course.setDescription("Comprehensive course covering " + coursesByProgram[courseIndex][1]);
            course.setCapacity(50);
            course.setEnrolled(0);
            course.setActive(true);
            course.setCreatedAt(LocalDateTime.now());
            course.setUpdatedAt(LocalDateTime.now());

            courseRepository.save(course);
        }
    }

    private void loadExams() {
        courseRepository.findAll().forEach(course -> {
            // Create MIDTERM exam
            Exam midterm = new Exam();
            midterm.setCourseId(course.getId());
            midterm.setExamType(Exam.ExamType.MIDTERM);
            midterm.setPublished(false);
            midterm.setExamDate(LocalDateTime.now().plusDays(30));
            midterm.setDurationMinutes(120);
            midterm.setTotalMarks(100);
            midterm.setInstructions("Midterm Exam: Complete all questions. No external materials allowed.");
            midterm.setCreatedAt(LocalDateTime.now());
            midterm.setUpdatedAt(LocalDateTime.now());
            examRepository.save(midterm);

            // Create FINAL exam
            Exam finalExam = new Exam();
            finalExam.setCourseId(course.getId());
            finalExam.setExamType(Exam.ExamType.FINAL);
            finalExam.setPublished(false);
            finalExam.setExamDate(LocalDateTime.now().plusDays(90));
            finalExam.setDurationMinutes(180);
            finalExam.setTotalMarks(100);
            finalExam.setInstructions("Final Comprehensive Exam: Answer all sections.");
            finalExam.setCreatedAt(LocalDateTime.now());
            finalExam.setUpdatedAt(LocalDateTime.now());
            examRepository.save(finalExam);
        });
    }

    private void loadStudents() {
        String[] programs = {
            "BSc Computer Science",
            "BSc Information Technology",
            "BSc Software Engineering",
            "BSc Data Science",
            "BSc Cybersecurity",
            "BSc Business Administration",
            "BSc Accounting",
            "BSc Economics",
            "BSc Mathematics",
            "BSc Physics"
        };

        String[] firstNames = {
            "Adewale", "Chioma", "Emeka", "Fatima", "Ibrahim", "Ngozi", "Oluwaseun", "Zainab",
            "Chukwudi", "Aisha", "Babatunde", "Chiamaka", "Yusuf", "Blessing", "Kehinde",
            "Amina", "Chinedu", "Halima", "Oluwatoyin", "Musa", "Funmilayo", "Sadiq",
            "Nneka", "Usman", "Temitope", "Hauwa", "Ikechukwu", "Zara", "Adebayo", "Rukayat",
            "Chidi", "Khadija", "Folake", "Ahmed", "Chinonso", "Safiya", "Tunde", "Hadiza",
            "Segun", "Maryam", "Ayo", "Bilkisu", "Chukwuma", "Asma'u", "Femi", "Abubakar",
            "Biodun", "Jamila", "Gbenga", "Salamatu"
        };

        String[] lastNames = {
            "Adeyemi", "Okafor", "Ibrahim", "Bello", "Okonkwo", "Mohammed", "Eze", "Abdullahi",
            "Ojo", "Yusuf", "Nwankwo", "Hassan", "Okeke", "Aliyu", "Adeleke", "Suleiman",
            "Ogunyemi", "Usman", "Oladele", "Garba", "Chukwu", "Musa", "Afolabi", "Yakubu",
            "Obi", "Tijani", "Adebisi", "Danjuma", "Nnamdi", "Rabiu", "Olaniyan", "Sani",
            "Ezeh", "Mustapha", "Babangida", "Nwosu", "Abubakar", "Onyeka", "Isa", "Chima",
            "Lawal", "Nnadi", "Bala", "Emeka", "Aminu", "Kalu", "Ismail", "Udoh", "Salisu", "Eze"
        };

        int studentCounter = 1001;
        LocalDateTime baseEnrollmentDate = LocalDateTime.now().minusYears(2);

        for (int i = 0; i < 50; i++) {
            // Create a user first
            User user = User.builder()
                .email(firstNames[i].toLowerCase() + "." + lastNames[i].toLowerCase() + "@flexisaf.edu.ng")
                .password("$2a$10$dummyHashPasswordForTesting")
                .firstName(firstNames[i])
                .lastName(lastNames[i])
                .role(User.UserRole.STUDENT)
                .build();
            user = userRepository.save(user);

            // Create student record
            Student student = new Student();
            student.setUserId(user.getId());
            student.setStudentId("STU-2024-" + String.format("%04d", studentCounter++));
            student.setProgram(programs[i % programs.length]);
            student.setStatus(Student.Status.ACTIVE);
            student.setEnrollmentDate(baseEnrollmentDate.plusDays(i * 7));
            student.setGpa(2.5 + (Math.random() * 1.5)); // GPA between 2.5 and 4.0
            student.setCreditsEarned((int) (Math.random() * 80) + 20); // 20-100 credits
            student.setCreditsRequired(120);

            studentRepository.save(student);
        }
    }

    private void loadPayments() {
        // Get all students
        var students = studentRepository.findAll();
        if (students.isEmpty()) {
            return;
        }

        String[] programs = {
            "BSc Computer Science",
            "BSc Information Technology",
            "BSc Software Engineering",
            "BSc Data Science",
            "BSc Cybersecurity",
            "BSc Business Administration",
            "BSc Accounting",
            "BSc Economics",
            "BSc Mathematics",
            "BSc Physics"
        };

        Payment.PaymentType[] paymentTypes = {
            Payment.PaymentType.TUITION_FEE,
            Payment.PaymentType.LAB_FEE,
            Payment.PaymentType.LIBRARY_FEE,
            Payment.PaymentType.REGISTRATION_FEE,
            Payment.PaymentType.EXAM_FEE
        };

        // Create 100+ payments linked to real students
        int paymentCount = 0;
        for (int round = 0; round < 3; round++) {
            for (Student student : students) {
                if (paymentCount >= 120) break;

                // Get user details
                var userOpt = userRepository.findById(student.getUserId());
                if (userOpt.isEmpty()) continue;
                User user = userOpt.get();

                Payment.PaymentType paymentType;
                BigDecimal amount;
                Payment.Status status;

                if (round == 0) {
                    // First round: Tuition fees
                    paymentType = Payment.PaymentType.TUITION_FEE;
                    amount = new BigDecimal(250000 + (Math.random() * 250000)); // 250,000 - 500,000 Naira
                    status = Payment.Status.COMPLETED;
                } else if (round == 1) {
                    // Second round: Other fees
                    paymentType = paymentTypes[(int) (Math.random() * (paymentTypes.length - 1)) + 1];
                    amount = new BigDecimal(15000 + (Math.random() * 35000)); // 15,000 - 50,000 Naira
                    status = Math.random() > 0.1 ? Payment.Status.COMPLETED : Payment.Status.PENDING;
                } else {
                    // Third round: Mix of various fees
                    if (paymentCount % 2 == 0) continue; // Skip some to create variation
                    paymentType = paymentTypes[(int) (Math.random() * paymentTypes.length)];
                    amount = new BigDecimal(20000 + (Math.random() * 80000)); // 20,000 - 100,000 Naira
                    double rand = Math.random();
                    status = rand > 0.8 ? Payment.Status.PENDING : (rand > 0.05 ? Payment.Status.COMPLETED : Payment.Status.FAILED);
                }

                Payment payment = new Payment();
                payment.setStudentId(student.getId());
                payment.setStudentName(user.getFirstName() + " " + user.getLastName());
                payment.setProgram(student.getProgram());
                payment.setAmount(amount.setScale(2, BigDecimal.ROUND_HALF_UP));
                payment.setPaymentType(paymentType);
                payment.setStatus(status);
                payment.setTransactionId("TXN-NGN-2025-" + String.format("%05d", paymentCount + 1));
                payment.setSemester("2024/2025 - Semester " + ((round % 2) + 1));
                payment.setPaymentMethod(Math.random() > 0.5 ? "Bank Transfer" : "Card Payment");
                payment.setPaymentDate(LocalDateTime.now().minusDays((int) (Math.random() * 90)));
                payment.setCreatedAt(LocalDateTime.now());
                payment.setUpdatedAt(LocalDateTime.now());

                paymentRepository.save(payment);
                paymentCount++;
            }
        }
    }

    private void loadAnnouncements() {
        Announcement ann1 = new Announcement();
        ann1.setTitle("Welcome to 2024/2025 Academic Session");
        ann1.setContent("We are pleased to welcome all students to the new academic session.");
        ann1.setAudience(Announcement.Audience.ALL);
        ann1.setPriority(Announcement.Priority.HIGH);
        ann1.setPinned(true);
        ann1.setAuthor("Admin");
        ann1.setCreatedAt(LocalDateTime.now());
        announcementRepository.save(ann1);

        Announcement ann2 = new Announcement();
        ann2.setTitle("Exam Schedule Published");
        ann2.setContent("The examination schedule for this semester has been published. Check your student portal.");
        ann2.setAudience(Announcement.Audience.STUDENTS);
        ann2.setPriority(Announcement.Priority.HIGH);
        ann2.setPinned(true);
        ann2.setAuthor("Exam Control");
        ann2.setCreatedAt(LocalDateTime.now().minusDays(1));
        announcementRepository.save(ann2);
    }
}
