// insertMockStudents.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// === connect ===
mongoose.connect('mongodb://localhost:27017/studentanalytics', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// === import existing models ===
import User from './index.js';      // adjust path if needed
import Student from './index.js'; // adjust path if needed

async function insertMockData() {
  try {
    await User.deleteMany({ role: 'student' });
    await Student.deleteMany({});

    const mockStudents = [
      {
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        major: 'Computer Science',
        year: '3',
        semester: 'Fall 2025',
        department: 'Engineering',
        riskLevel: 'low',
        gpaHistory: [
          { date: new Date('2024-09-01'), gpa: 3.2 },
          { date: new Date('2025-01-15'), gpa: 3.4 },
          { date: new Date('2025-06-01'), gpa: 3.6 }
        ],
        assignments: [
          { title: 'Data Structures HW1', status: 'completed', score: 85, dueDate: new Date('2025-02-01') },
          { title: 'OS Project', status: 'in-progress', score: null, dueDate: new Date('2025-09-20') }
        ],
        courses: [
          { code: 'CS301', name: 'Data Structures', grade: 'B+', credits: 3 },
          { code: 'CS302', name: 'Operating Systems', grade: 'A', credits: 4 }
        ],
        attendanceRate: 92
      },
      {
        fullName: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        major: 'Mechanical Engineering',
        year: '2',
        semester: 'Spring 2025',
        department: 'Engineering',
        riskLevel: 'medium',
        gpaHistory: [
          { date: new Date('2024-09-01'), gpa: 2.5 },
          { date: new Date('2025-01-15'), gpa: 2.6 },
          { date: new Date('2025-06-01'), gpa: 2.4 }
        ],
        assignments: [
          { title: 'Thermo HW1', status: 'completed', score: 70, dueDate: new Date('2025-03-01') },
          { title: 'Fluid Mechanics Project', status: 'not-started', dueDate: new Date('2025-09-25') }
        ],
        courses: [
          { code: 'ME201', name: 'Thermodynamics', grade: 'C+', credits: 3 },
          { code: 'ME202', name: 'Fluid Mechanics', grade: 'B-', credits: 3 }
        ],
        attendanceRate: 75
      },
      {
        fullName: 'Charlie Lee',
        email: 'charlie@example.com',
        password: 'password123',
        major: 'Electrical Engineering',
        year: '4',
        semester: 'Fall 2025',
        department: 'Engineering',
        riskLevel: 'high',
        gpaHistory: [
          { date: new Date('2024-09-01'), gpa: 2.0 },
          { date: new Date('2025-01-15'), gpa: 1.8 },
          { date: new Date('2025-06-01'), gpa: 1.9 }
        ],
        assignments: [
          { title: 'Circuits Lab', status: 'completed', score: 60, dueDate: new Date('2025-02-10') },
          { title: 'Power Systems Project', status: 'overdue', score: null, dueDate: new Date('2025-08-01') }
        ],
        courses: [
          { code: 'EE401', name: 'Power Systems', grade: 'C', credits: 3 },
          { code: 'EE402', name: 'Control Systems', grade: 'D+', credits: 3 }
        ],
        attendanceRate: 60
      }
    ];

    for (const data of mockStudents) {
      const passwordHash = await bcrypt.hash(data.password, 10);

      const user = new User({
        fullName: data.fullName,
        email: data.email,
        passwordHash,
        role: 'student'
      });
      await user.save();

      const student = new Student({
        user: user._id,
        studentId: `S${Date.now()}${Math.floor(Math.random()*1000)}`,
        major: data.major,
        year: data.year,
        semester: data.semester,
        department: data.department,
        riskLevel: data.riskLevel,
        gpaHistory: data.gpaHistory,
        assignments: data.assignments,
        courses: data.courses,
        attendanceRate: data.attendanceRate,
        lastActivity: new Date()
      });
      await student.save();

      console.log(`Inserted: ${data.fullName}`);
    }

    console.log('✅ Mock data inserted');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

insertMockData();
