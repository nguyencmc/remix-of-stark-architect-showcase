const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/pages/Leaderboard.tsx',
  'src/pages/Settings.tsx',
  'src/pages/StudentDashboard.tsx',
  'src/pages/ExamCategoryDetail.tsx',
  'src/pages/Flashcards.tsx',
  'src/pages/InstructorProfile.tsx',
  'src/pages/UserProfile.tsx',
  'src/pages/StudyGroups.tsx',
  'src/pages/StudyGroupDetail.tsx',
  'src/pages/BookDetail.tsx',
  'src/pages/PodcastDetail.tsx',
  'src/pages/ExamHistory.tsx',
  'src/pages/AttemptDetail.tsx',
  'src/pages/MyCourses.tsx',
  'src/pages/CourseDetail.tsx',
  'src/pages/VerifyCertificate.tsx',
  'src/pages/admin/AdminDashboard.tsx',
  'src/pages/admin/TeacherDashboard.tsx',
  'src/pages/admin/ExamManagement.tsx',
  'src/pages/admin/ExamEditor.tsx',
  'src/pages/admin/FlashcardManagement.tsx',
  'src/pages/admin/FlashcardEditor.tsx',
  'src/pages/admin/PodcastManagement.tsx',
  'src/pages/admin/PodcastEditor.tsx',
  'src/pages/admin/CategoryManagement.tsx',
  'src/pages/admin/UserManagement.tsx',
  'src/pages/admin/CourseManagement.tsx',
  'src/pages/admin/CourseEditor.tsx',
  'src/pages/admin/QuestionSetManagement.tsx',
  'src/pages/admin/QuestionSetEditor.tsx',
  'src/pages/admin/PermissionManagement.tsx',
  'src/features/flashcards/pages/DeckDetailPage.tsx',
  'src/features/flashcards/pages/DeckListPage.tsx',
  'src/features/flashcards/pages/StudyDeckPage.tsx',
  'src/features/flashcards/pages/TodayPage.tsx',
  'src/features/classroom/pages/CreateClassPage.tsx',
  'src/features/classroom/pages/JoinClassPage.tsx',
  'src/features/classroom/pages/ClassDetailPage.tsx',
  'src/features/classroom/pages/ClassListPage.tsx',
  'src/features/practice/pages/MyPracticeSetsPage.tsx',
  'src/features/practice/pages/ExamRunner.tsx',
  'src/features/practice/pages/ExamSetup.tsx',
  'src/features/practice/pages/ReviewWrongRunner.tsx',
  'src/features/practice/pages/QuestionBankPage.tsx',
  'src/features/practice/pages/PracticeRunner.tsx',
  'src/features/practice/pages/PracticeEditorPage.tsx',
  'src/features/practice/pages/PracticeSetup.tsx',
  'src/features/practice/pages/ExamResult.tsx',
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`Found: ${file}`);
  } else {
    console.log(`Missing: ${file}`);
  }
});
